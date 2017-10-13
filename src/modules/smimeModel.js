import MimeParser from 'emailjs-mime-parser';
import {stringToArrayBuffer, utilConcatBuf} from 'pvutils';
import * as asn1js from 'asn1js';
import {SignedData, ContentInfo} from 'pkijs';

import constants from '../config/constants';
import getResultPrototype from './resultPrototype';

const specificationConstants = constants.smimeSpecification;
const resultCodes = constants.smimeVerificationResultCodes;

/**
 * Verifies a passed rawMessage as a signed S/MIME message.
 * You should surround this with try/catch where it's called in case of unexpected exceptions that prohibit reaching
 * a conclusive result - in this case we should not persist the result.
 * The returned result object's message is meant to be displayed to the user and should not be too technical.
 * @param rawMessage Full MIME message. Preferably in binary form as this reduces the risk of encoding issues.
 * @returns {Promise}
 */
export function verifyMessageSignature(rawMessage) {
  return new Promise(resolve => {
    const result = getResultPrototype();
    const parser = new MimeParser();
    parser.write(rawMessage);
    parser.end();

    // S/MIME signature must be in content node 2. Email content is in content node 1.
    const signatureNode = parser.getNode("2");

    if (!isValidSmimeEmail(parser.node, signatureNode)) {
      result.success = false;
      result.code = resultCodes.CANNOT_VERIFY;
      result.message = 'Message is not digitally signed.';
      return resolve(result);
    }

    // Finally done with specification checks. Let's actually verify the message.

    let cmsContentSimpl = null;
    let cmsSignedSimpl = null;
    let signerEmail = '';

    try {
      // Get signature buffer
      const signatureBuffer = utilConcatBuf(new ArrayBuffer(0), signatureNode.content);

      // Parse into pkijs types
      const asn1 = asn1js.fromBER(signatureBuffer);
      if (asn1.offset === -1) {
        throw new TypeError('Could not parse signature.');
      }

      cmsContentSimpl = new ContentInfo({schema: asn1.result});
      cmsSignedSimpl = new SignedData({schema: cmsContentSimpl.content});

      // Get signer's email address from signature
      signerEmail = cmsSignedSimpl.certificates[0].subject.typesAndValues[0].value.valueBlock.value;
    }
    catch (ex) {
      result.success = false;
      result.code = resultCodes.FRAUD_WARNING;
      result.message = "Fraud warning: Invalid signature.";
      return resolve(result);
    }

    // Get content of email that was signed. Should be entire first child node.
    const signedDataBuffer = stringToArrayBuffer(parser.nodes.node1.raw.replace(/\n/g, "\r\n"));

    // Verify the signed data
    let sequence = Promise.resolve();
    sequence = sequence.then(
      () => cmsSignedSimpl.verify({signer: 0, data: signedDataBuffer})
    );

    sequence.then(
      verificationResult => {
        let failed = false;
        if (typeof verificationResult !== "undefined") {
          if (verificationResult === false) {
            failed = true;
          }
        }

        if (failed) {
          result.success = false;
          result.code = resultCodes.FRAUD_WARNING;
          result.message = "Fraud warning: Message failed verification with signature.";
          return resolve(result);
        }

        const fromNode = parser.node.headers.from[0].value[0];

        if (fromNode.address !== signerEmail) {
          result.success = false;
          result.code = resultCodes.FRAUD_WARNING;
          result.message = "Fraud warning: The 'From' email address does not match the signature's email address.";
          return resolve(result);
        }

        result.success = true;
        result.code = resultCodes.VERIFICATION_OK;
        result.message = "Message passed verification.";
        return resolve(result);
    }).catch(
    error => {
      result.success = false;
      result.code = resultCodes.CANNOT_VERIFY;
      result.message = 'Message cannot be verified: Unknown error.';
      console.error(error);
      return resolve(result);
    });
  });

  function isValidSmimeEmail(rootNode, signatureNode) {
    return rootNode.contentType &&
      rootNode.contentType.params &&
      rootNode._childNodes &&
      signatureNode &&
      signatureNode.contentType  &&
      isRootNodeContentTypeValueCorrect(rootNode) &&
      isRootNodeContentTypeProtocolCorrect(rootNode) &&
      isRootNodeContentTypeMicalgCorrect(rootNode) &&
      isSignatureNodeContentTypeValueCorrect(signatureNode);
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

  function isSignatureNodeContentTypeValueCorrect(signatureNode) {
    return specificationConstants.signatureNodeContentTypeValues.indexOf(signatureNode.contentType.value) !== -1;
  }
}
