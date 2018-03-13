import ocspCheckResultCodes from '../constants/ocspCheckResultCodes';

class RevocationCheckProvider {
  /**
   * 
   * @param {Logger} loggerService 
   * @param {Object} base64lib 
   */
  constructor(config, loggerService, base64lib) {
    this.ocspUrl = config.ocspUrl;
    this.logger = loggerService;
    this.base64lib = base64lib;
  }

  /**
   * Resolves to a boolean - true if the certificate is revoked, false if the certificate is not revoked.
   * Throws an exception if we cannot get a clear result. 
   * 
   * Example response from the included OCSP server code:
   * {
   *   client_certificate_serial_number: "[32 char hex value]", 
   *   ocsp_result: "unauthorized/good/revoked"
   * }
   * @param {MimeNode} signatureNode 
   * @returns {Promise}
   */
  isCertificateRevoked(signatureNode) {
    this.logger.log('This is where we do the OCSP check');
    const sigString = String.fromCharCode.apply(null, signatureNode.content);
    const sigBase64 = this.base64lib.btoa(sigString);

    const data = new FormData();
    data.append(`json`, JSON.stringify({signature: sigBase64}));
    const params = {method: `POST`, body: data};

    return fetch(this.ocspUrl, params)
    .then(res => res.json())
    .then(resultObj => this.processResult(resultObj.ocsp_result));
    // .then(resultObj => {
    //   this.logger.log(`Performed OCSP, returning hardcoded 'revoked'`);
    //   this.logger.log(resultObj);
    //   return this.processResult('revoked');
    // });
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
