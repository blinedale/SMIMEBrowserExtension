import databaseStores from '../constants/databaseStores';

class RevocationCheckRepository {
  /**
   * @param {DbHandler} dbHandler 
   * @param {object} base64lib 
   */
  constructor(dbHandler, base64lib) {
    this.dbHandler = dbHandler;
    this.base64lib = base64lib;
  }

  /**
   * @param {string} certificateSerialNumber 
   * @returns {Promise}
   */
  get(certificateSerialNumber) {
    return this.dbHandler.get(certificateSerialNumber, databaseStores.revocationChecks);
  }

  /**
   * @param {object} revocationCheckResult
   * @returns {Promise}
   */
  persist(revocationCheckResult) {
    return this.dbHandler.persist(revocationCheckResult, databaseStores.revocationChecks);
  }
}

export default RevocationCheckRepository;
