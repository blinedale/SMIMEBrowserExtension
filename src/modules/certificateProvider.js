import * as csv from 'csvtojson';

class CertificateProvider {
  /**
   * @param {Object} certificateConfig
   * @param {CertificateParser} certificateParser
   * @param {Logger} loggerService
   */
  constructor(certificateConfig, certificateParser, loggerService) {
    this.config = certificateConfig;
    this.parser = certificateParser;
    this.logger = loggerService;

    this.trustedRootCertificates = [];
  }

  getTrustedRootCertificates() {
    return new Promise(resolve => {
      if (this.trustedRootCertificates.length > 0) {
        return resolve(this.trustedRootCertificates);
      }

      this.fetchTrustedRootCertificates()
      .then(rawCsvData => this.parseTrustedRootCertificates(rawCsvData))
      .then(trustedRoots => resolve(trustedRoots));
    });
  }

  fetchTrustedRootCertificates() {
    const url = chrome.runtime.getURL(this.config.filename);
    return fetch(url).then(response => response.text());
  }

  parseTrustedRootCertificates(rawCsvData) {
    return new Promise(resolve => {
      csv().fromString(rawCsvData)
      .on(`json`, jsonObj => {
        const certificatePEM = jsonObj[`PEM Info`];
        const parsedCertificate = this.parser.parseCertificate(certificatePEM);

        if (parsedCertificate !== null) {
          this.trustedRootCertificates.push(parsedCertificate);
        }
      })
      .on('done', () => {
        this.logger.log(`Successfully parsed ${this.trustedRootCertificates.length} root certificates.`);
        return resolve(this.trustedRootCertificates);
      });
    });
  }
}

export default CertificateProvider;
