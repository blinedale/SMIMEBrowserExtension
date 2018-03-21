/* eslint-disable no-undef, no-unused-vars */

import sinon from 'sinon';
import MimeBuilder from 'emailjs-mime-builder';

import smimeVerificationResultCodes from '../../src/constants/smimeVerificationResultCodes';
import SmimeVerificationService from '../../src/modules/smimeVerificationService';
import RevocationCheckProvider from '../../src/modules/revocationCheckProvider';
import {
  emailWithAsn1CompliantButInvalidSignature,
  emailWithValidSignatureAndIncorrectFromAddress,
  emailWithValidSignatureAndManipulatedMessage,
  emailWithValidSignatureAndExpiredCertificate,
  emailWithValidEverything
} from '../helpers/smimeEmails';
import MockLogger from '../helpers/mockLogger';

/* TODO: All included test data was made with certificates that expire in September 2018. */

const mockLogger = new MockLogger();
const mailId = 'abc123';

describe('SmimeVerificationService - revocation check off', () => {

  const config = {requireRootCerts: false, requireRevocationCheck: false};

  const revocationCheckProvider = new RevocationCheckProvider(null, {ocspUrl: ''}, mockLogger, null);
  const isCertificateRevokedStub = sinon.stub(revocationCheckProvider, 'isCertificateRevoked');

  const smimeVerificationService = new SmimeVerificationService(mockLogger, config, null, revocationCheckProvider);

  const isValidSmimeEmailSpy = sinon.spy(smimeVerificationService, 'isValidSmimeEmail');
  const isRootNodeContentTypeValueCorrectSpy = sinon.spy(smimeVerificationService, 'isRootNodeContentTypeValueCorrect');
  const isRootNodeContentTypeProtocolCorrectSpy = sinon.spy(smimeVerificationService, 'isRootNodeContentTypeProtocolCorrect');
  const isRootNodeContentTypeMicalgCorrectSpy = sinon.spy(smimeVerificationService, 'isRootNodeContentTypeMicalgCorrect');
  const isSignatureNodeContentTypeValueCorrectSpy = sinon.spy(smimeVerificationService, 'isSignatureNodeContentTypeValueCorrect');
  const getAsn1TypeFromBufferSpy = sinon.spy(smimeVerificationService, 'getAsn1TypeFromBuffer');
  const getSignedDataFromAsn1Spy = sinon.spy(smimeVerificationService, 'getSignedDataFromAsn1');
  const fetchSignerEmailSpy = sinon.spy(smimeVerificationService, 'fetchSignerEmailAndIndex');
  const isAnyCertificateExpiredSpy = sinon.spy(smimeVerificationService, 'isAnyCertificateExpired');
  const doVerificationSpy = sinon.spy(smimeVerificationService, 'doVerification');
  const isVerificationFailedSpy = sinon.spy(smimeVerificationService, 'isVerificationFailed');
  const isFromAddressCorrectSpy = sinon.spy(smimeVerificationService, 'isFromAddressCorrect');

  describe('ways to fail isValidSmimeEmail - revocation check off', () => {
    it('root node has no content type', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder();
      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.notCalled).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('root node has no child nodes', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/mixed');
      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.notCalled).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('root node has no signature node', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/mixed');
      const contentNode = rootNode.createChild('text/plain; charset=utf-8');
      contentNode.setContent('some content');

      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.notCalled).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('root node has incorrect content type', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/mixed');
      const contentNode = rootNode.createChild('text/plain; charset=utf-8');
      contentNode.setContent('some content');

      const sigNode = rootNode.createChild('somesignature'); // this would be signature node
      sigNode.setContent('some signature');

      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.notCalled).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.notCalled).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('root node has incorrect content type protocol', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/signed; protocol="application/json"');
      const contentNode = rootNode.createChild('text/plain; charset=utf-8');
      contentNode.setContent('some content');

      const sigNode = rootNode.createChild('somesignature'); // this would be signature node
      sigNode.setContent('some signature');

      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.notCalled).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('root node has incorrect content type micalg', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/signed; protocol="application/pkcs7-signature"; micalg=invalidValue');
      const contentNode = rootNode.createChild('text/plain; charset=utf-8');
      contentNode.setContent('some content');

      const sigNode = rootNode.createChild('somesignature'); // this would be signature node
      sigNode.setContent('some signature');

      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.notCalled).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('signature node has incorrect content type', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/signed; protocol="application/pkcs7-signature"; micalg=md5');
      const contentNode = rootNode.createChild('text/plain; charset=utf-8');
      contentNode.setContent('some content');

      const sigNode = rootNode.createChild('somesignature'); // this would be signature node
      sigNode.setContent('some signature');

      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.CANNOT_VERIFY);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.notCalled).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });
  });

  describe('ways to get fraud warning from invalid signature', () => {

    it('has an invalid signature', () => {
      expect.assertions(14);
      const rootNode = new MimeBuilder('multipart/signed; protocol="application/pkcs7-signature"; micalg=md5');
      const contentNode = rootNode.createChild('text/plain; charset=utf-8');
      contentNode.setContent('some content');

      const sigNode = rootNode.createChild('application/pkcs7-signature; name=smime.p7s');
      sigNode.setHeader('Content-Transfer-Encoding', 'base64');
      sigNode.setHeader('Content-Disposition', 'attachment; filenamailme=smime.p7s');
      sigNode.setContent('some text that is definitely not a signature');

      const message = rootNode.build();

      return smimeVerificationService.verifyMessageSignature(message, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.FRAUD_WARNING);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.notCalled).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    it('has valid asn1 object as signature but it can\'t be cast to SignedData', () => {

      expect.assertions(14);
    
      /* This example email's signature is parsed into a valid asn1 object but will cause an exception to be thrown inside
      getSignedDataFromAsn1 when the asn1 object is used to create a ContentInfo object.

      This happened to me when trying to sign an email programmatically and doing it incorrectly, thus ending up with
      an asn1 compliant signature object that was not actually a valid signature.

      Expected exception message: Object's schema was not verified against input data for CMS_CONTENT_INFO
       */
      return smimeVerificationService.verifyMessageSignature(emailWithAsn1CompliantButInvalidSignature, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.FRAUD_WARNING);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.notCalled).toBe(true);
          expect(isAnyCertificateExpiredSpy.notCalled).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      )
    });
  });

  describe('ways to get fraud warning from valid signature', () => {
    it('one of the included certificates has expired', () => {
      expect.assertions(14);

      return smimeVerificationService.verifyMessageSignature(emailWithValidSignatureAndExpiredCertificate, mailId).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.FRAUD_WARNING);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.calledOnce).toBe(true);
          expect(isAnyCertificateExpiredSpy.calledOnce).toBe(true);
          expect(isCertificateRevokedStub.notCalled).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      )
    });

    // TODO: Test for revoked certificate

    // FIXME: Verification fails since PKI.js cannot instantiate a WebCrypto instance
    /*
    it('fails verification due to manipulated message body', () => {
      return smimeVerificationService.verifyMessageSignature(emailWithValidSignatureAndManipulatedMessage).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.FRAUD_WARNING);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.calledOnce).toBe(true);
          expect(isAnyCertificateExpiredSpy.calledOnce).toBe(true);
          expect(isVerificationFailedSpy.calledOnce).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      );
    });

    // FIXME: Verification fails since PKI.js cannot instantiate a WebCrypto instance
    it('has a "from" address that differs from the signer email', () => {
      return smimeVerificationService.verifyMessageSignature(emailWithValidSignatureAndIncorrectFromAddress).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.FRAUD_WARNING);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.calledOnce).toBe(true);
          expect(isAnyCertificateExpiredSpy.calledOnce).toBe(true);
          expect(isVerificationFailedSpy.calledOnce).toBe(true);
          expect(isFromAddressCorrectSpy.calledOnce).toBe(true);
        }
      );
    });
    */

    // TODO: Case where we include trustedCerts and fail
  });

  describe('valid signed email', () => {
    // TODO: Pass valid email and done. One test case should be enough.
  });

  afterEach(() => {
    isValidSmimeEmailSpy.reset();
    isRootNodeContentTypeValueCorrectSpy.reset();
    isRootNodeContentTypeProtocolCorrectSpy.reset();
    isRootNodeContentTypeMicalgCorrectSpy.reset();
    isSignatureNodeContentTypeValueCorrectSpy.reset();
    getAsn1TypeFromBufferSpy.reset();
    getSignedDataFromAsn1Spy.reset();
    fetchSignerEmailSpy.reset();
    isAnyCertificateExpiredSpy.reset();
    isCertificateRevokedStub.reset();
    doVerificationSpy.reset();
    isVerificationFailedSpy.reset();
    isFromAddressCorrectSpy.reset();
  });
});

describe('SmimeVerificationService - revocation check on', () => {

  const config = {requireRootCerts: false, requireRevocationCheck: true};

  const revocationCheckProvider = new RevocationCheckProvider(null, {ocspUrl: ''}, mockLogger, null);
  const isCertificateRevokedStub = sinon.stub(revocationCheckProvider, 'isCertificateRevoked');

  const smimeVerificationService = new SmimeVerificationService(mockLogger, config, null, revocationCheckProvider);

  const isValidSmimeEmailSpy = sinon.spy(smimeVerificationService, 'isValidSmimeEmail');
  const isRootNodeContentTypeValueCorrectSpy = sinon.spy(smimeVerificationService, 'isRootNodeContentTypeValueCorrect');
  const isRootNodeContentTypeProtocolCorrectSpy = sinon.spy(smimeVerificationService, 'isRootNodeContentTypeProtocolCorrect');
  const isRootNodeContentTypeMicalgCorrectSpy = sinon.spy(smimeVerificationService, 'isRootNodeContentTypeMicalgCorrect');
  const isSignatureNodeContentTypeValueCorrectSpy = sinon.spy(smimeVerificationService, 'isSignatureNodeContentTypeValueCorrect');
  const getAsn1TypeFromBufferSpy = sinon.spy(smimeVerificationService, 'getAsn1TypeFromBuffer');
  const getSignedDataFromAsn1Spy = sinon.spy(smimeVerificationService, 'getSignedDataFromAsn1');
  const fetchSignerEmailSpy = sinon.spy(smimeVerificationService, 'fetchSignerEmailAndIndex');
  const isAnyCertificateExpiredSpy = sinon.spy(smimeVerificationService, 'isAnyCertificateExpired');
  const doVerificationSpy = sinon.spy(smimeVerificationService, 'doVerification');
  const isVerificationFailedSpy = sinon.spy(smimeVerificationService, 'isVerificationFailed');
  const isFromAddressCorrectSpy = sinon.spy(smimeVerificationService, 'isFromAddressCorrect');

  describe('reaches revocation check', () => {

    it('client certificate has been revoked', () => {
      // Let's pretend we do an OCSP check and it responds that it was revoked.
      expect.assertions(15);
      isCertificateRevokedStub.resolves(true);

      return smimeVerificationService.verifyMessageSignature(emailWithValidEverything).then(
        result => {
          expect(result.code).toBe(smimeVerificationResultCodes.FRAUD_WARNING);
          expect(result.message).toBe(`certificateRevoked`);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.calledOnce).toBe(true);
          expect(isAnyCertificateExpiredSpy.calledOnce).toBe(true);
          expect(isCertificateRevokedStub.calledOnce).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      )
    });

    it('client certificate is good', () => {
      // Let's pretend we do an OCSP check and it works fine and the cert is good.
      expect.assertions(14);
      isCertificateRevokedStub.resolves(false);

      // TODO: Setting this as expected to fail because PKI.JS cannot instantiate WebCrypto, so it cannot run verification.
      // In reality, it should work just fine. 
      // The main focus of this test case is that execution continues when we get isRevoked = false from the revocation check.
      return smimeVerificationService.verifyMessageSignature(emailWithValidEverything).catch( 
        error => {
          expect(error instanceof Error).toBe(true);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.calledOnce).toBe(true);
          expect(isAnyCertificateExpiredSpy.calledOnce).toBe(true);
          expect(isCertificateRevokedStub.calledOnce).toBe(true);
          expect(doVerificationSpy.calledOnce).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      )
    });

    it('revocation check fails', () => {
      // Let's pretend we do an OCSP check and it fails because of an unrecognized response.
      expect.assertions(14);
      const returnedError = new TypeError('invalid something');
      isCertificateRevokedStub.rejects(returnedError);

      return smimeVerificationService.verifyMessageSignature(emailWithValidEverything).catch(
        error => {
          expect(error).toBe(returnedError);
          expect(isValidSmimeEmailSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeProtocolCorrectSpy.calledOnce).toBe(true);
          expect(isRootNodeContentTypeMicalgCorrectSpy.calledOnce).toBe(true);
          expect(isSignatureNodeContentTypeValueCorrectSpy.calledOnce).toBe(true);
          expect(getAsn1TypeFromBufferSpy.calledOnce).toBe(true);
          expect(getSignedDataFromAsn1Spy.calledOnce).toBe(true);
          expect(fetchSignerEmailSpy.calledOnce).toBe(true);
          expect(isAnyCertificateExpiredSpy.calledOnce).toBe(true);
          expect(isCertificateRevokedStub.calledOnce).toBe(true);
          expect(doVerificationSpy.notCalled).toBe(true);
          expect(isVerificationFailedSpy.notCalled).toBe(true);
          expect(isFromAddressCorrectSpy.notCalled).toBe(true);
        }
      )
    });
  });


  afterEach(() => {
    isValidSmimeEmailSpy.reset();
    isRootNodeContentTypeValueCorrectSpy.reset();
    isRootNodeContentTypeProtocolCorrectSpy.reset();
    isRootNodeContentTypeMicalgCorrectSpy.reset();
    isSignatureNodeContentTypeValueCorrectSpy.reset();
    getAsn1TypeFromBufferSpy.reset();
    getSignedDataFromAsn1Spy.reset();
    fetchSignerEmailSpy.reset();
    isAnyCertificateExpiredSpy.reset();
    isCertificateRevokedStub.reset();
    doVerificationSpy.reset();
    isVerificationFailedSpy.reset();
    isFromAddressCorrectSpy.reset();
  });

});
