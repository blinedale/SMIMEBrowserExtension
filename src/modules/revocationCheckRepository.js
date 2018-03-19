import databaseStores from '../constants/databaseStores';

class RevocationCheckRepository {
  /**
   * @param {DbHandler} dbHandler 
   * @param {Object} base64lib 
   */
  constructor(dbHandler, base64lib) {
    this.dbHandler = dbHandler;
    this.base64lib = base64lib;
  }

  get(certificateSerialNumber) {
    return this.dbHandler.get(certificateSerialNumber, databaseStores.revocationChecks);
  }

  persist(revocationCheckResult) {
    return this.dbHandler.persist(revocationCheckResult, databaseStores.revocationChecks);
  }
}

export default RevocationCheckRepository;
