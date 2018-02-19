import {OCSPRequest, TBSRequest, Request} from 'pkijs';
import BetterCertID from "./betterCertID";

class BetterOCSPRequest extends OCSPRequest {
  /**
   * Making OCSP Request for specific certificate
   * @param {Certificate} certificate Certificate making OCSP Request for
   * @param {Object} parameters Additional parameters
   * @returns {Promise}
   */
  createForCertificate(certificate, parameters)
  {
    //region Initial variables
    let sequence = Promise.resolve();

    const certID = new BetterCertID();
    //endregion

    //region Create OCSP certificate identifier for the certificate
    sequence = sequence.then(() =>
      certID.createForCertificate(certificate, parameters)
    );
    //endregion

    //region Make final request data
    sequence = sequence.then(() =>
    {
      this.tbsRequest = new TBSRequest({
        requestList: [
          new Request({
            reqCert: certID
          })
        ]
      });
    }, error =>
      Promise.reject(error)
    );
    //endregion

    return sequence;
  }
}

export default BetterOCSPRequest;
