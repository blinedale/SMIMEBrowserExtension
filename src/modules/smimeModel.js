import MimeParser from 'emailjs-mime-parser';
import {stringToArrayBuffer, utilConcatBuf} from 'pvutils';
import * as asn1js from 'asn1js';
import {SignedData, ContentInfo} from 'pkijs';

import constants from '../config/constants';

const specificationConstants = constants.smimeSpecification;
const resultCodes = constants.smimeVerificationResultCodes;

export function verifyMessageSignature(binaryMessage) {
  return new Promise((resolve, reject) => {
    const result = {
      success: false,
      code: '',
      message: '',
      fromEmail: '',
      fromName: '',
      signerEmail: ''
    };

    if (!binaryMessage) {
      result.success = false;
      result.code = resultCodes.MESSAGE_PARSE_ERROR;
      result.message = 'Passed message was empty.';
      return reject(result);
    }

    const parser = new MimeParser();
    parser.write(binaryMessage);
    parser.end();

    if (!parser.node) {
      result.success = false;
      result.code = resultCodes.MESSAGE_PARSE_ERROR;
      result.message = 'Could not parse MIME message.';
      return reject(result);
    }

    // S/MIME signature must be in content node 2. Email content is in content node 1.
    const signatureNode = parser.getNode("2");

    if (!parser.node.contentType ||
      !parser.node.contentType.params ||
      !parser.node._childNodes ||
      !signatureNode ||
      !signatureNode.contentType
    ) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Parsed MIME message but key parts of message are not set.';
      return reject(result);
    }

    if (!isRootNodeContentTypeValueCorrect(parser.node)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message content type value does not match that of an S/MIME message.';
      return reject(result);
    }

    if (!isRootNodeContentTypeProtocolCorrect(parser.node)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message content type protocol does not match that of an S/MIME message.';
      return reject(result);
    }

    if (!isRootNodeContentTypeMicalgCorrect(parser.node)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message integrity check algorithm not recognized.';
      return reject(result);
    }

    if (!isSignatureNodeContentTypeValueCorrect(signatureNode)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message signature content type value does not match that of an S/MIME message.';
      return reject(result);
    }

    // Finally done with specification checks. Let's actually verify the message.

    // Get signature buffer
    const signatureBuffer = utilConcatBuf(new ArrayBuffer(0), signatureNode.content);

    // Parse into pkijs types
    const asn1 = asn1js.fromBER(signatureBuffer);
    if (asn1.offset === -1) {
      result.success = false;
      result.code = resultCodes.MESSAGE_PARSE_ERROR;
      result.message = "Signature could not be parsed correctly.";
      return reject(result);
    }

    let cmsContentSimpl;
    let cmsSignedSimpl;

    try {
      cmsContentSimpl = new ContentInfo({schema: asn1.result});
      cmsSignedSimpl = new SignedData({schema: cmsContentSimpl.content});
    }
    catch (ex) {
      result.success = false;
      result.code = resultCodes.MESSAGE_PARSE_ERROR;
      result.message = "Signature could not be processed properly.";
      return reject(result);
    }

    // Get content of email that was signed. Should be entire first child node.
    const signedDataBuffer = stringToArrayBuffer(parser.nodes.node1.raw.replace(/\n/g, "\r\n"));

    // Verify the signed data
    let sequence = Promise.resolve();
    sequence = sequence.then(
      () => cmsSignedSimpl.verify({signer: 0, data: signedDataBuffer})
    );

    // Get signer's email address from signature
    const signerEmail = cmsSignedSimpl.certificates[0].subject.typesAndValues[0].value.valueBlock.value;

    const fromNode = parser.node.headers.from[0].value[0];

    sequence.then(
      verificationResult => {
        let failed = false;
        if (typeof verificationResult !== "undefined") {
          if (verificationResult === false) {
            failed = true;
          }
        }

        console.log('passed');
        console.log(verificationResult);

        if (failed) {
          result.success = false;
          result.code = resultCodes.FRAUD_WARNING_CONTENT_VERIFICATION;
          result.message = "Fraud warning: Message content failed verification with signature.";
          return reject(result);
        }

        if (fromNode.address !== signerEmail) {
          result.success = false;
          result.code = resultCodes.FRAUD_WARNING_FROM_ADDRESS;
          result.message = "Fraud warning: Content passed verification but 'From' email address does not match the signature's email address.";
          return reject(result);
        }

        result.success = true;
        result.code = resultCodes.VERIFICATION_OK;
        result.fromEmail = fromNode.address;
        result.fromName = fromNode.name;
        result.signerEmail = signerEmail;
        result.message = "Message passed verification.";
        return resolve(result);
      },
      error => {
        result.success = false;
        result.code = resultCodes.UNKNOWN_VERIFICATION_ERROR;
        result.message = "Unknown error caught during verification of message content with signature.";
        return reject(result);
      }
    );
  });

  function isSignatureNodeContentTypeValueCorrect(signatureNode) {
    return specificationConstants.signatureNodeContentTypeValues.indexOf(signatureNode.contentType.value) !== -1;
  }

  function isRootNodeContentTypeValueCorrect(rootNode) {
    return specificationConstants.rootNodeContentTypeValue.indexOf(rootNode.contentType.value) !== -1;
  }

  function isRootNodeContentTypeProtocolCorrect(rootNode) {
    return rootNode.contentType.params.protocol === specificationConstants.rootNodeContentTypeProtocol;
  }

  function isRootNodeContentTypeMicalgCorrect(rootNode) {
    return specificationConstants.rootNodeContentTypeMessageIntegrityCheckAlgorithms.indexOf(rootNode.contentType.params.micalg) !== -1;
  }
}
