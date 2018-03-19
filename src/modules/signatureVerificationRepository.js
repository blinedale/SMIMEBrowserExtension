import databaseStores from '../constants/databaseStores';

class SignatureVerificationRepository {
  /**
     * @param {DbHandler} dbHandler 
     * @param {Object} base64lib 
     */
  constructor(dbHandler, base64lib) {
    this.dbHandler = dbHandler;
    this.base64lib = base64lib;
  }

  get(id) {
    return this.dbHandler.get(id, databaseStores.signatureVerifications)
    .then(result => {
      if (result) {
        result.signer = this.base64lib.decode(result.signer);
      }

      return result;
    });
  }

  persist(signatureVerification) {
    const obfuscatedEntity = Object.assign(
      {},
      signatureVerification,
      {signer: this.base64lib.encode(signatureVerification.signer)}
    );

    return this.dbHandler.persist(obfuscatedEntity, databaseStores.signatureVerifications);
  }
}

export default SignatureVerificationRepository;
