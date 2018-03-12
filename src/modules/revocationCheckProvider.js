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
   * @param {MimeNode} signatureNode 
   */
  isCertificateRevoked(signatureNode) {
    this.logger.log('This is where we do the OCSP check');
    // this.logger.log(signatureNode);
    const sigString = String.fromCharCode.apply(null, signatureNode.content);
    // this.logger.log(sigString);
    const sigBase64 = this.base64lib.btoa(sigString);
    this.logger.log(sigBase64);

    // const result = ocspCheckResultCodes.GOOD;

    const xhr = new XMLHttpRequest();
    // xhr.overrideMimeType('text/plain'); // Needed for Firefox, otherwise it tries to parse the response as XML.
    xhr.open('POST', this.ocspUrl, false); // Need to call synchronously or it's too slow
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(JSON.stringify({signature: sigBase64}));
    const resultObj = JSON.parse(xhr.responseText);

    this.logger.log('Performed OCSP');
    this.logger.log(resultObj);

    // example result {client_certificate_serial_number: "C0B312847198DD6BDF577BB6520C1024", ocsp_result: "unauthorized"}

    return this.processResult(resultObj);
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
