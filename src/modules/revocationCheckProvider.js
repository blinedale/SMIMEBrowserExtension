import ocspCheckResultCodes from '../constants/ocspCheckResultCodes';

class RevocationCheckProvider {
  /**
   * @param {RevocationCheckRepository} revocationCheckRepository
   * @param {Object} config
   * @param {Logger} loggerService 
   * @param {Object} base64lib 
   */
  constructor(revocationCheckRepository, config, loggerService, base64lib) {
    this.repository = revocationCheckRepository;
    this.ocspUrl = config.ocspUrl;
    this.logger = loggerService;
    this.base64lib = base64lib;
    this.unrecognizedStatusMessage = `Unrecognized revocation status.`;
  }

  /**
   * Resolves to a boolean - true if the certificate is revoked, false if the certificate is not revoked.
   * Rejects with an Error if we cannot get a conclusive result. 
   *
   * @param {string} clientCertificateSerialNumber Serial number in hex format.
   * @param {MimeNode} signatureNode 
   * @returns {Promise}
   */
  isCertificateRevoked(clientCertificateSerialNumber, signatureNode) {
    return new Promise((resolve, reject) => {
      this.logger.log(`This is where we do the OCSP check`);

      this.logger.log(`Checking if we already checked the revocation status of client certificate ${clientCertificateSerialNumber}.`);
      this.repository.get(clientCertificateSerialNumber)
      .then(revocationCheckResult => {
        if (revocationCheckResult) {
          this.logger.log(`Found cached revocation status.`);
          this.logger.log(revocationCheckResult);
          return resolve(this.processResult(revocationCheckResult.status));
        }

        this.logger.log(`Found no cached revocation status. Will perform a new revocation check.`);
        this.performRevocationCheck(signatureNode)
        .then(revocationStatus => {
          const isRevoked = this.processResult(revocationStatus);

          if (typeof isRevoked !== 'boolean') {
            return reject(isRevoked);
          }

          this.repository.persist({id: clientCertificateSerialNumber, status: revocationStatus});
          return resolve(isRevoked);
        });
      });
    });
  }

  /**
   * Example response from the included OCSP server code:
   * {
   *   client_certificate_serial_number: "[32 char hex value]", 
   *   ocsp_result: "unauthorized/good/revoked"
   * }
   * @param {MimeNode} signatureNode 
   * @returns {Promise}
   */
  performRevocationCheck(signatureNode) {
    const sigString = String.fromCharCode.apply(null, signatureNode.content);
    const sigBase64 = this.base64lib.btoa(sigString);

    const data = new FormData();
    data.append(`json`, JSON.stringify({signature: sigBase64}));
    const params = {method: `POST`, body: data};

    return fetch(this.ocspUrl, params)
    .then(res => res.json())
    .then(resultObj => resultObj.ocsp_result);
  }

  processResult(result) {
    switch (result) {
      case ocspCheckResultCodes.GOOD:
        return false; // IS NOT revoked
      case ocspCheckResultCodes.REVOKED:
        return true; // IS revoked
      default:
        return new TypeError(this.unrecognizedStatusMessage);
    }
  }
}

export default RevocationCheckProvider;
