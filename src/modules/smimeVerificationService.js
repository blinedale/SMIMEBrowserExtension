import MimeParser from 'emailjs-mime-parser';
import {stringToArrayBuffer, utilConcatBuf} from 'pvutils';
import * as asn1js from 'asn1js';
import {SignedData, ContentInfo} from 'pkijs';

import getResultPrototype from './resultPrototype';
import smimeSpecificationConstants from '../constants/smimeSpecificationConstants';
import smimeVerificationResultCodes from '../constants/smimeVerificationResultCodes';

class SmimeVerificationService {
  /**
   * @param {Logger} loggerService
   * @param {Object} config
   * @param {CertificateProvider} certificateProvider
   * @param {RevocationCheckProvider} revocationCheckProvider
   */
  constructor(loggerService, config, certificateProvider, revocationCheckProvider) {
    this.trustedRootCerts = [];
    this.logger = loggerService;
    this.revocationCheckProvider = revocationCheckProvider;

    this.requireRootCerts = config.requireRootCerts;
    this.requireRevocationCheck = config.requireRevocationCheck;

    if (this.requireRootCerts) {
      certificateProvider.getTrustedRootCertificates()
      .then(trustedRoots => this.trustedRootCerts = trustedRoots);
    }
  }

  /**
   * Verifies a passed rawMessage as a signed S/MIME message.
   * You should surround this with try/catch where it's called in case of unexpected exceptions that prohibit reaching
   * a conclusive result - in this case we should not persist the result.
   * The returned result object's message is meant to be displayed to the user and should not be too technical.
   * @param rawMessage Full MIME message. Preferably in binary form as this reduces the risk of encoding issues.
   * @param {string} mailId String of mail id.
   * @returns {Promise}
   */
  verifyMessageSignature(rawMessage, mailId) {
    return new Promise(resolve => {
      const result = getResultPrototype();

      if (this.requireRootCerts && this.trustedRootCerts.length === 0) {
        throw new Error(`Verification is configured to check against root certificates, but we haven't parsed any. Exiting verification.`);
      }

      result.mailId = mailId;

      const parser = new MimeParser();
      parser.write(rawMessage);
      parser.end();

      // S/MIME signature must be in content node 2. Email content is in content node 1.
      const signatureNode = parser.getNode(`2`);

      if (!this.isValidSmimeEmail(parser.node, signatureNode)) {
        result.code = smimeVerificationResultCodes.CANNOT_VERIFY;
        result.message = `messageNotSigned`;
        return resolve(result);
      }

      let cmsSignedSimpl = null;

      try {
        // Get signature buffer
        const signatureBuffer = utilConcatBuf(new ArrayBuffer(0), signatureNode.content);

        const asn1 = this.getAsn1TypeFromBuffer(signatureBuffer);

        cmsSignedSimpl = this.getSignedDataFromAsn1(asn1);

        result.signer = this.fetchSignerEmail(cmsSignedSimpl);
      }
      catch (ex) {
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `invalidSignature`;
        return resolve(result);
      }

      this.logger.log(`Dumping certificates.`);
      this.logger.log(cmsSignedSimpl);
      this.logger.log(`Dumping hex of serial.`);
      const hexSerial = this.buf2hex(cmsSignedSimpl.certificates[0].serialNumber.valueBlock._valueHex);
      this.logger.log(hexSerial);

      /* We have to check for expiration here since we cannot do OCSP on expired certs.
         Ergo, if it's expired, it's impossible to know if the cert is revoked or not.
         No point in continuing further. */
      if (this.isAnyCertificateExpired(cmsSignedSimpl)) {
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `certificateExpired`;
        return resolve(result);
      }

      if (this.requireRevocationCheck) {
        // OCSP check - throws exception if the check itself does not return valid result
        this.revocationCheckProvider.isCertificateRevoked(signatureNode)
        .then(isRevoked => {
          if (isRevoked) {
            this.logger.log(`Certificate revoked!`);
            result.code = smimeVerificationResultCodes.FRAUD_WARNING;
            result.message = `The signature's certificate has been revoked. Be wary of message content.`;
            return resolve(result);
          }
          this.logger.log(`Certificate is not revoked!`);
          return this.doVerification(parser, cmsSignedSimpl, result, resolve);
        });
      } else {
        return this.doVerification(parser, cmsSignedSimpl, result, resolve);
      }
    });
  }

  /**
   * Performs the actual cryptographic verification plus additional sanity checks.
   * @param {MimeParser} parser 
   * @param {SignedData} cmsSignedSimpl 
   * @param {Object} result 
   * @returns {Promise}
   */
  doVerification(parser, cmsSignedSimpl, result, resolve) {
    // Get content of email that was signed. Should be entire first child node.
    const signedDataBuffer = stringToArrayBuffer(parser.nodes.node1.raw.replace(/\n/g, `\r\n`));

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
      if (this.isVerificationFailed(verificationResult)) {
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `verificationFailed`;
        return resolve(result);
      }

      if (!this.isFromAddressCorrect(parser, result.signer)) {
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `fromEmailDoesNotMatchSignature`;
        return resolve(result);
      }

      result.code = smimeVerificationResultCodes.VERIFICATION_OK;
      result.message = `messageIsValid`;
      return resolve(result);
    }).catch(error => {
      if (error.message.indexOf('No valid certificate paths found') !== -1) {
        // This happens when we could not find the corresponding root CA in this.trustedRootCerts
        result.code = smimeVerificationResultCodes.FRAUD_WARNING;
        result.message = `cannotVerifyOrigin`;
        return resolve(result);
      }

      throw new Error(`Message cannot be verified. Unknown error.`);
    });
  }

  /**
   * @param {ArrayBuffer} buffer 
   */
  buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => (`00${x.toString(16)}`).slice(-2)).join('');
  }

  /**
   * Get signer's email address from signature
   * @param {SignedData} signedData
   * @returns {string}
   */
  fetchSignerEmail(signedData) {
    let signerEmail = null;
    Object.keys(signedData.certificates).forEach(certKey => {
      Object.keys(signedData.certificates[certKey].subject.typesAndValues).forEach(subjectKey => {
        const type = signedData.certificates[certKey].subject.typesAndValues[subjectKey].type;
        if (type == smimeSpecificationConstants.certificateTypeForSignerEmail) {
          signerEmail = signedData.certificates[certKey].subject.typesAndValues[subjectKey].value.valueBlock.value;
        }
      });
    });
    return signerEmail;
  }

  /**
   * Checks if any of the included certificates expired/not valid yet.
   * @param {SignedData} signedData
   * @returns {boolean}
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
      throw new TypeError(`Could not parse signature.`);
    }
    return asn1;
  }

  getSignedDataFromAsn1(asn1) {
    const cmsContentSimpl = new ContentInfo({schema: asn1.result});
    return  new SignedData({schema: cmsContentSimpl.content});
  }

  isVerificationFailed(verificationResult) {
    let failed = false;
    if (typeof verificationResult !== `undefined`) {
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
