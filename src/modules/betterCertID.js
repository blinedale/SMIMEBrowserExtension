import {CertID, AlgorithmIdentifier, getCrypto, getOIDByAlgorithm} from 'pkijs';
import * as asn1js from "asn1js";

class BetterCertID extends CertID {
  /**
   * Making OCSP certificate identifier for specific certificate
   * @param {Certificate} certificate Certificate making OCSP Request for
   * @param {Object} parameters Additional parameters
   * @returns {Promise}
   */
  createForCertificate(certificate, parameters)
  {
    //region Initial variables
    let sequence = Promise.resolve();

    let issuerCertificate;
    //endregion

    //region Get a "crypto" extension
    const crypto = getCrypto();
    if (typeof crypto === "undefined")
    { return Promise.reject("Unable to create WebCrypto object"); }
    //endregion

    //region Check input parameters
    if (("hashAlgorithm" in parameters) === false)
    { return Promise.reject("Parameter \"hashAlgorithm\" is mandatory for \"OCSP_REQUEST.createForCertificate\""); }

    const hashOID = getOIDByAlgorithm(parameters.hashAlgorithm); // NOTE: Different to CertID
    if (hashOID === "")
    { return Promise.reject(`Incorrect \"hashAlgorithm\": ${this.hashAlgorithm}`); }

    this.hashAlgorithm = new AlgorithmIdentifier({
      algorithmId: hashOID,
      algorithmParams: new asn1js.Null()
    });

    if ("issuerCertificate" in parameters)
    { issuerCertificate = parameters.issuerCertificate; }
    else
    { return Promise.reject("Parameter \"issuerCertificate\" is mandatory for \"OCSP_REQUEST.createForCertificate\""); }
    //endregion

    //region Initialize "serialNumber" field
    this.serialNumber = certificate.serialNumber;
    //endregion

    //region Create "issuerNameHash"
    sequence = sequence.then(() =>
      crypto.digest(parameters.hashAlgorithm, issuerCertificate.subject.toSchema().toBER(false)), // NOTE: Different to CertID
    error =>
      Promise.reject(error)
    );
    //endregion

    //region Create "issuerKeyHash"
    sequence = sequence.then(result =>
    {
      this.issuerNameHash = new asn1js.OctetString({valueHex: result});

      const issuerKeyBuffer = issuerCertificate.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex;

      return crypto.digest(parameters.hashAlgorithm, issuerKeyBuffer); // NOTE: Different to CertID
    }, error =>
      Promise.reject(error)
    ).then(result =>
    {
      this.issuerKeyHash = new asn1js.OctetString({valueHex: result});
    }, error =>
      Promise.reject(error)
    );
    //endregion

    return sequence;
  }
}

export default BetterCertID;
