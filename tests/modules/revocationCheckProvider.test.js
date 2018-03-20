/* eslint-disable no-undef, no-unused-vars */

import sinon from 'sinon';
import MimeBuilder from 'emailjs-mime-builder';

import RevocationCheckProvider from '../../src/modules/revocationCheckProvider';
import RevocationCheckRepository from '../../src/modules/revocationCheckRepository';
import ocspCheckResultCodes from '../../src/constants/ocspCheckResultCodes';
import * as Base64lib from 'js-base64';
import MockLogger from '../helpers/mockLogger';

describe('RevocationCheckProvider', () => {

  const mockLogger = new MockLogger();
  const config = {ocspUrl: ''};
  const base64lib = Base64lib.Base64;

  const mockRepo = new RevocationCheckRepository(null, base64lib);
  const getStub = sinon.stub(mockRepo, 'get');
  const persistStub = sinon.stub(mockRepo, 'persist').resolves(null); // For all test cases
  
  const provider = new RevocationCheckProvider(mockRepo, config, mockLogger, base64lib);
  const performRevocationCheckStub = sinon.stub(provider, 'performRevocationCheck');
  const processResultSpy = sinon.spy(provider, 'processResult');

  const serialNumber = '1111';
  const signatureNode = new MimeBuilder();

  describe('Has not cached a revocation result', () => {
    it('Checks revocation status and gets a good certificate', () => {
      expect.assertions(4);
      getStub.resolves(null);
      performRevocationCheckStub.resolves(ocspCheckResultCodes.GOOD);

      return provider.isCertificateRevoked(serialNumber, signatureNode).then(
        isRevoked => {
          expect(isRevoked).toBe(false);
          expect(processResultSpy.calledOnce).toBe(true);
          expect(getStub.calledOnce).toBe(true);
          expect(persistStub.calledOnce).toBe(true);
        }
      );
    });

    it('Checks revocation status and gets a revoked certificate', () => {
      expect.assertions(4);
      getStub.resolves(null);
      performRevocationCheckStub.resolves(ocspCheckResultCodes.REVOKED);

      return provider.isCertificateRevoked(serialNumber, signatureNode).then(
        isRevoked => {
          expect(isRevoked).toBe(true);
          expect(processResultSpy.calledOnce).toBe(true);
          expect(getStub.calledOnce).toBe(true);
          expect(persistStub.calledOnce).toBe(true);
        }
      );
    });

    it('Checks revocation status and gets an unhandled status code', () => {
      expect.assertions(4);
      getStub.resolves(null);
      performRevocationCheckStub.resolves(ocspCheckResultCodes.UNAUTHORIZED);

      provider.isCertificateRevoked(serialNumber, signatureNode)
      .catch(isRevoked => {
        expect(isRevoked instanceof Error).toBe(true); 
        expect(processResultSpy.calledOnce).toBe(true);
        expect(getStub.calledOnce).toBe(true);
        expect(persistStub.calledOnce).toBe(true);
      });
    });
  });

  describe('Has a cached a revocation result', () => {
    // it('Checks revocation status and gets a revoked certificate', () => {
    //   expect.assertions(4);
    //   getStub.resolves(null);
    //   performRevocationCheckStub.resolves(ocspCheckResultCodes.REVOKED);

    //   return provider.isCertificateRevoked(serialNumber, signatureNode).then(
    //     isRevoked => {
    //       expect(isRevoked).toBe(true);
    //       expect(processResultSpy.calledOnce).toBe(true);
    //       expect(getStub.calledOnce).toBe(true);
    //       expect(persistStub.calledOnce).toBe(true);
    //     }
    //   );
    // });
  });

  afterEach(() => {
    processResultSpy.reset();
    getStub.reset();
    persistStub.reset();
  });
});
