import * as csv from 'csvtojson';

class CertificateProvider {
  /**
   * @param {Object} certificateConfig
   * @param {CertificateParser} certificateParser
   */
  constructor(certificateConfig, certificateParser) {
    this.config = certificateConfig;
    this.parser = certificateParser;

    this.trustedRootCertificates = [];

    // this.parseTrustedRootCertificates();
  }

  getTrustedRootCertificates() {
    return this.trustedRootCertificates;
  }

  parseTrustedRootCertificates() {
    return new Promise(resolve => {
      const url = chrome.runtime.getURL(this.config.filename);
      const xhr = new XMLHttpRequest(url);
      xhr.overrideMimeType('text/plain'); // Needed for Firefox, otherwise it tries to parse the response as XML.
      xhr.open('GET', url, false); // Need to call synchronously or it's too slow
      xhr.send(null);
      console.log('done');

      csv().fromString(xhr.responseText)
      .on('json', (jsonObj, rowIndex) => {
        // console.log(jsonObj);
        console.log(rowIndex);

        const certificatePEM = jsonObj['PEM Info'];
        console.log(certificatePEM);
        const parsedCertificate = this.parser.parseCertificate(certificatePEM);
        console.log(parsedCertificate);

        this.trustedRootCertificates.push(parsedCertificate);
      })
      .on('done', () => {
        console.log('done');
        return resolve(this.trustedRootCertificates);
      });
    });
  }
}

export default CertificateProvider;
