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

  const getResultGood = {id: serialNumber, status: ocspCheckResultCodes.GOOD};
  const getResultRevoked = {id: serialNumber, status: ocspCheckResultCodes.REVOKED};


  describe('Has not cached a revocation result', () => {
    it('Checks revocation status and gets a good certificate', () => {
      expect.assertions(5);
      getStub.resolves(null);
      performRevocationCheckStub.resolves(ocspCheckResultCodes.GOOD);

      return provider.isCertificateRevoked(serialNumber, signatureNode).then(
        isRevoked => {
          expect(isRevoked).toBe(false);
          expect(performRevocationCheckStub.calledOnce).toBe(true);
          expect(processResultSpy.calledOnce).toBe(true);
          expect(getStub.calledOnce).toBe(true);
          expect(persistStub.calledOnce).toBe(true);
        }
      );
    });

    it('Checks revocation status and gets a revoked certificate', () => {
      expect.assertions(5);
      getStub.resolves(null);
      performRevocationCheckStub.resolves(ocspCheckResultCodes.REVOKED);

      return provider.isCertificateRevoked(serialNumber, signatureNode).then(
        isRevoked => {
          expect(isRevoked).toBe(true);
          expect(performRevocationCheckStub.calledOnce).toBe(true);
          expect(processResultSpy.calledOnce).toBe(true);
          expect(getStub.calledOnce).toBe(true);
          expect(persistStub.calledOnce).toBe(true);
        }
      );
    });

    it('Checks revocation status and gets an unhandled status code', () => {
      expect.assertions(5);
      getStub.resolves(null);
      performRevocationCheckStub.resolves(ocspCheckResultCodes.UNAUTHORIZED);

      return provider.isCertificateRevoked(serialNumber, signatureNode)
      .catch(isRevoked => {
        expect(isRevoked instanceof TypeError).toBe(true); 
        expect(performRevocationCheckStub.calledOnce).toBe(true);
        expect(processResultSpy.calledOnce).toBe(true);
        expect(getStub.calledOnce).toBe(true);
        expect(persistStub.notCalled).toBe(true);
      });
    });
  });

  describe('Has a cached a revocation result', () => {
    it('Gets a cached result that is good', () => {
      expect.assertions(5);
      getStub.resolves(getResultGood);

      return provider.isCertificateRevoked(serialNumber, signatureNode).then(
        isRevoked => {
          expect(isRevoked).toBe(false);
          expect(performRevocationCheckStub.notCalled).toBe(true);
          expect(processResultSpy.calledOnce).toBe(true);
          expect(getStub.calledOnce).toBe(true);
          expect(persistStub.notCalled).toBe(true);
        }
      );
    });

    it('Gets a cached result that is revoked', () => {
      expect.assertions(5);
      getStub.resolves(getResultRevoked);

      return provider.isCertificateRevoked(serialNumber, signatureNode).then(
        isRevoked => {
          expect(isRevoked).toBe(true);
          expect(performRevocationCheckStub.notCalled).toBe(true);
          expect(processResultSpy.calledOnce).toBe(true);
          expect(getStub.calledOnce).toBe(true);
          expect(persistStub.notCalled).toBe(true);
        }
      );
    });
  });

  afterEach(() => {
    processResultSpy.reset();
    performRevocationCheckStub.reset();
    getStub.reset();
    persistStub.reset();
  });
});
