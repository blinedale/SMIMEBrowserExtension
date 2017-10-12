import MimeParser from 'emailjs-mime-parser';
import {stringToArrayBuffer, utilConcatBuf} from 'pvutils';
import * as asn1js from 'asn1js';
import {SignedData, ContentInfo} from 'pkijs';

import constants from '../config/constants';
import getResultPrototype from './resultPrototype';

const specificationConstants = constants.smimeSpecification;
const resultCodes = constants.smimeVerificationResultCodes;

/**
 * Verifies a passed binaryMessage as a signed S/MIME message.
 * Resolves if the results from the verification are conclusive.
 * Rejects if passed empty binaryMessage or we encounter any unhandled error.
 * @param binaryMessage
 * @returns {Promise}
 */
export function verifyMessageSignature(binaryMessage) {
  return new Promise((resolve, reject) => {
    const result = getResultPrototype();

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
      return resolve(result);
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
      return resolve(result);
    }

    if (!isRootNodeContentTypeValueCorrect(parser.node)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message content type value does not match that of an S/MIME message.';
      return resolve(result);
    }

    if (!isRootNodeContentTypeProtocolCorrect(parser.node)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message content type protocol does not match that of an S/MIME message.';
      return resolve(result);
    }

    if (!isRootNodeContentTypeMicalgCorrect(parser.node)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message integrity check algorithm not recognized.';
      return resolve(result);
    }

    if (!isSignatureNodeContentTypeValueCorrect(signatureNode)) {
      result.success = false;
      result.code = resultCodes.MESSAGE_NOT_SIGNED;
      result.message = 'Message signature content type value does not match that of an S/MIME message.';
      return resolve(result);
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
      return resolve(result);
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
      return resolve(result);
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
          return resolve(result);
        }

        if (fromNode.address !== signerEmail) {
          result.success = false;
          result.code = resultCodes.FRAUD_WARNING_FROM_ADDRESS;
          result.message = "Fraud warning: Content passed verification but 'From' email address does not match the signature's email address.";
          return resolve(result);
        }

        result.success = true;
        result.code = resultCodes.VERIFICATION_OK;
        result.message = "Message passed verification.";
        return resolve(result);
    }).catch(
    error => {
      result.success = false;
      result.code = resultCodes.UNKNOWN_VERIFICATION_ERROR;
      result.message = `Unknown error caught during verification of message content with signature. See ${error}`;
      return reject(result);
    });
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
