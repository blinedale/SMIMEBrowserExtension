import MimeParser from 'emailjs-mime-parser';
import {stringToArrayBuffer, utilConcatBuf} from 'pvutils';
import * as asn1js from 'asn1js';
import {SignedData, ContentInfo, getAlgorithmByOID, OCSPRequest, CertID, AlgorithmIdentifier} from 'pkijs';

import getResultPrototype from './resultPrototype';
import smimeSpecificationConstants from '../constants/smimeSpecificationConstants';
import smimeVerificationResultCodes from '../constants/smimeVerificationResultCodes';
import BetterOCSPRequest from "./betterOCSPRequest";

class SmimeVerificationService {
  /**
   * @param {Logger} loggerService
   * @param {boolean} requireRootCerts
   */
  constructor(loggerService, requireRootCerts = true) {
    this.trustedRootCerts = [];
    this.logger = loggerService;
    this.requireRootCerts = requireRootCerts;
  }

  setTrustedRoots(trustedRoots) {
    this.trustedRootCerts = trustedRoots;
  }

  /**
   * Verifies a passed rawMessage as a signed S/MIME message.
   * You should surround this with try/catch where it's called in case of unexpected exceptions that prohibit reaching
   * a conclusive result - in this case we should not persist the result.
   * The returned result object's message is meant to be displayed to the user and should not be too technical.
   * @param rawMessage Full MIME message. Preferably in binary form as this reduces the risk of encoding issues.
   * @param {String} mailId String of mail id.
   * @returns {Promise}
   */
  verifyMessageSignature(rawMessage, mailId) {
    return new Promise(resolve => {
      const result = getResultPrototype();

      if (this.requireRootCerts && this.trustedRootCerts.length === 0) {
        return resolve(result); // Returning empty result if we do not have root certs.
      }

      this.logger.log(`nr certs ${this.trustedRootCerts.length}`);

      result.mailId = mailId;

      const parser = new MimeParser();
      parser.write(rawMessage);
      parser.end();

      // S/MIME signature must be in content node 2. Email content is in content node 1.
      const signatureNode = parser.getNode(`2`);

      if (!this.isValidSmimeEmail(parser.node, signatureNode)) {
        result.code = smimeVerificationResultCodes.CANNOT_VERIFY;
        result.message = `Message is not digitally signed.`;
        return resolve(result);
      }

      let cmsSignedSimpl = null;
      let signerEmail = '';
      let signerIndex = 0;

      try {
        // Get signature buffer
        const signatureBuffer = utilConcatBuf(new ArrayBuffer(0), signatureNode.content);

        const asn1 = this.getAsn1TypeFromBuffer(signatureBuffer);

        cmsSignedSimpl = this.getSignedDataFromAsn1(asn1);

        ({signerEmail, signerIndex} = this.fetchSignerEmail(cmsSignedSimpl));
      }
      catch (ex) {
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `Invalid digital signature.`;
        return resolve(result);
      }

      this.logger.log(`Dumping certificates.`);
      this.logger.log(cmsSignedSimpl);





      //region one option for ocsp

      const issuerCertIndex = signerIndex === 0 ? 1 : 0;

      console.log('generating ocsp thing');
      //      const ocspreq = new OCSPRequest();
      const ocspreq = new BetterOCSPRequest();

      //      const algParams = getAlgorithmByOID(cmsSignedSimpl.certificates[signerIndex].signature.algorithmId);
      const algParams = getAlgorithmByOID("1.3.14.3.2.26"); //sha-1

      //      const hashAlgorithm = {name: 'RSASSA-PKCS1-V1_5', hash: {name: 'SHA-256'}};
      //      const options = {hashAlgorithm: 'SHA-256', issuerCertificate: cmsSignedSimpl.certificates[issuerCertIndex]};
      //      const options = {hashAlgorithm: 'RSA', issuerCertificate: cmsSignedSimpl.certificates[issuerCertIndex]};
      const options = {hashAlgorithm: algParams, issuerCertificate: cmsSignedSimpl.certificates[issuerCertIndex]};

      ocspreq.createForCertificate(cmsSignedSimpl.certificates[signerIndex], options)
      .then(() => {
        console.log('we now have ocsprequest');
        console.log(ocspreq);
        const ocspSchema = ocspreq.toSchema(false);
        console.log('ocspSchema');
        console.log(ocspSchema);
        const ocspreqBuffer = ocspSchema.toBER(false); // fails here now all of a sudden
        const ocspreqAsBitArray = new Uint8Array(ocspreqBuffer);
        // ocspreq in base64:
        const ocspDataString = String.fromCharCode.apply(null, ocspreqAsBitArray);
        const base64String = window.btoa(ocspDataString);
        console.log('ocsp req in base64:');
        console.log(base64String);
      });
      //endregion

      //region another option for ocsp from pki.js examples

      /*
      const ocspReqSimpl = new OCSPRequest();

      ocspReqSimpl.tbsRequest.requestList = [new Request({
        reqCert: new CertID({
          hashAlgorithm: new AlgorithmIdentifier({
            algorithmId: cmsSignedSimpl.certificates[signerIndex].signature.algorithmId
          }),
          issuerNameHash: new asn1js.OctetString({ valueHex: fictionBuffer }),
          issuerKeyHash: new asn1js.OctetString({ valueHex: fictionBuffer }),
          serialNumber: new asn1js.Integer({ valueHex: fictionBuffer })
        })
      })];
      */
      //endregion


      /* We have to check for expiration here since we cannot do OCSP on expired certs.
         Ergo, if it's expired, it's impossible to know if the cert is revoked or not.
         No point in continuing further. */
      if (this.isAnyCertificateExpired(cmsSignedSimpl)) {
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `The signature's certificate has expired. Be wary of message content.`;
        return resolve(result);
      }

      // Get content of email that was signed. Should be entire first child node.
      const signedDataBuffer = stringToArrayBuffer(parser.nodes.node1.raw.replace(/\n/g, "\r\n"));

      let verificationOptions = {
        signer: 0, // index to use in array in cmsSignedSimpl.signerInfos - this is always 0
        data: signedDataBuffer,
        checkChain: true,
        extendedMode: true,
        trustedCerts: this.trustedRootCerts
      };

      if (!this.requireRootCerts) {
        verificationOptions = {
          signer: 0,
          data: signedDataBuffer
        };
      }

      // Verify the signed data
      cmsSignedSimpl.verify(verificationOptions).then(verificationResult => {
        result.signer = signerEmail;

        if (this.isVerificationFailed(verificationResult)) {
          result.code = smimeVerificationResultCodes.FRAUD_WARNING;
          result.message = `Signature verification failed. Message content may be fraudulent.`;
          return resolve(result);
        }

        if (!this.isFromAddressCorrect(parser, signerEmail)) {
          result.code = smimeVerificationResultCodes.FRAUD_WARNING;
          result.message = `The "From" email address does not match the signature's email address.`;
          return resolve(result);
        }

        result.code = smimeVerificationResultCodes.VERIFICATION_OK;
        result.message = `Message signature is valid for the sender.`;
        return resolve(result);
      }).catch(error => {
        if (error.message.indexOf('No valid certificate paths found') !== -1) {
          // This happens when we could not find the corresponding root CA in this.trustedRootCerts
          result.code = smimeVerificationResultCodes.FRAUD_WARNING;
          result.message = `Could not verify the signature's certificate origin.`;
          return resolve(result);
        }

        result.code = smimeVerificationResultCodes.CANNOT_VERIFY;
        result.message = `Message cannot be verified. Unknown error.`;
        return resolve(result);
      }
      );
    });
  }

  /**
   * Get signer's email address from signature
   * @param {SignedData} signedData
   * @returns {object}
   */
  fetchSignerEmail(signedData) {
    let signerEmail = null;
    let signerIndex = null;
    Object.keys(signedData.certificates).forEach(certKey => {
      Object.keys(signedData.certificates[certKey].subject.typesAndValues).forEach(subjectKey => {
        const type = signedData.certificates[certKey].subject.typesAndValues[subjectKey].type;
        if (type == smimeSpecificationConstants.certificateTypeForSignerEmail) {
          signerEmail = signedData.certificates[certKey].subject.typesAndValues[subjectKey].value.valueBlock.value;
          signerIndex = certKey;
        }
      });
    });
    return {signerEmail, signerIndex};
  }

  /**
   * Checks if any of the included certificates expired/not valid yet.
   * @param {SignedData} signedData
   * @returns {Boolean}
   */
  isAnyCertificateExpired(signedData) {
    const marginMilliseconds = smimeSpecificationConstants.expirationDateMarginHours * 60 * 60 * 1000;
    const now = new Date();
    let startDateWithMargin;
    let endDateWithMargin;

    for (const certificate of signedData.certificates) {
      startDateWithMargin = new Date(certificate.notBefore.value.getTime() - marginMilliseconds);
      if (now < startDateWithMargin) {
        return true;
      }

      endDateWithMargin = new Date(certificate.notAfter.value.getTime() + marginMilliseconds);
      if (now > endDateWithMargin) {
        return true;
      }
    }

    return false;
  }

  isValidSmimeEmail(rootNode, signatureNode) {
    return rootNode.contentType &&
      rootNode.contentType.params &&
      rootNode._childNodes &&
      signatureNode &&
      this.isRootNodeContentTypeValueCorrect(rootNode) &&
      this.isRootNodeContentTypeProtocolCorrect(rootNode) &&
      this.isRootNodeContentTypeMicalgCorrect(rootNode) &&
      this.isSignatureNodeContentTypeValueCorrect(signatureNode);
  }

  isRootNodeContentTypeValueCorrect(rootNode) {
    return smimeSpecificationConstants.rootNodeContentTypeValue.indexOf(rootNode.contentType.value) !== -1;
  }

  isRootNodeContentTypeProtocolCorrect(rootNode) {
    return smimeSpecificationConstants.rootNodeContentTypeProtocol.indexOf(rootNode.contentType.params.protocol) !== -1;
  }

  isRootNodeContentTypeMicalgCorrect(rootNode) {
    const lowerCaseMicalg = rootNode.contentType.params.micalg.toLowerCase();
    return smimeSpecificationConstants.rootNodeContentTypeMessageIntegrityCheckAlgorithms.indexOf(lowerCaseMicalg) !== -1;
  }

  isSignatureNodeContentTypeValueCorrect(signatureNode) {
    return smimeSpecificationConstants.signatureNodeContentTypeValues.indexOf(signatureNode.contentType.value) !== -1;
  }

  getAsn1TypeFromBuffer(signatureBuffer) {
    const asn1 = asn1js.fromBER(signatureBuffer);
    if (asn1.offset === -1) {
      throw new TypeError('Could not parse signature.');
    }
    return asn1;
  }

  getSignedDataFromAsn1(asn1) {
    const cmsContentSimpl = new ContentInfo({schema: asn1.result});
    return  new SignedData({schema: cmsContentSimpl.content});
  }

  isVerificationFailed(verificationResult) {
    let failed = false;
    if (typeof verificationResult !== "undefined") {
      if (verificationResult === false) {
        failed = true;
      }
    }
    return failed;
  }

  isFromAddressCorrect(parser, signerEmail) {
    const fromNode = parser.node.headers.from[0].value[0];
    return fromNode.address === signerEmail;
  }
}

export default SmimeVerificationService;
