import ocspCheckResultCodes from '../constants/ocspCheckResultCodes';

class RevocationCheckProvider {
  /**
   * 
   * @param {Logger} loggerService 
   * @param {Object} base64lib 
   */
  constructor(loggerService, base64lib) {
    this.logger = loggerService;
    this.base64lib = base64lib;
  }

  /**
   * @param {MimeNode} signatureNode 
   */
  isCertificateRevoked(signatureNode) {
    this.logger.log('This is where we do the OCSP check');
    // this.logger.log(signatureNode);
    const sigString = String.fromCharCode.apply(null, signatureNode.content);
    // this.logger.log(sigString);
    const sigBase64 = this.base64lib.btoa(sigString);
    this.logger.log(sigBase64);

    const result = ocspCheckResultCodes.GOOD;

    return this.processResult(result);
  }

  processResult(result) {
    switch (result) {
      case ocspCheckResultCodes.GOOD:
        return false; // IS NOT revoked
      case ocspCheckResultCodes.REVOKED:
        return true; // IS revoked
      default:
        throw new Error(`Could not verify revocation status.`);
    }
  }
}

export default RevocationCheckProvider;
