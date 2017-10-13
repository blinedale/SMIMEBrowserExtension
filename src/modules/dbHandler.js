import constants from '../config/constants';

const dbConfig = constants.db;

class DbHandler {
  constructor(dbConfig) {
    this.db = null;

    this.getDb(dbConfig).then(db => {this.db = db;});
  }

  /**
   * Tries to connect to the indexedDB in the browser window. Only resolves as there is no way to recover if something goes
   * wrong; we just return null and are done with it.
   * @returns {Promise}
   */
  getDb(dbConfig) {
    return new Promise(resolve => {

      if (!window.indexedDB) {
        return resolve(null);
      }

      let db = null;

      const request = window.indexedDB.open(dbConfig.dbName, dbConfig.dbVersion);

      request.onerror = function (event) {
        console.error('Rocket S/MIME Browser extension: Error while creating database connector.');
        console.error(event);
        return resolve(null);
      };

      // Upgrade/create db as needed
      request.onupgradeneeded = function (event) {
        db = request.result;
        if (event.oldVersion < 1) {
          // There is no old version - creating db and store from scratch
          db.createObjectStore(dbConfig.stores.results, {keyPath: "mailId"});
          console.log('Rocket S/MIME Browser extension: Created database successfully.');
        }
        if (event.oldVersion < 2) {
          // In future versions we'd upgrade our database here.
        }
      };

      /* This is always run if the request to open the db connection is granted, regardless if we need to upgrade the db
         or not. In that case it is run after the upgrade is done. */
      request.onsuccess = function (ev) {
        db = request.result;
        console.log('Rocket S/MIME Browser extension: Created database connector.');
        return resolve(db);
      };

    });
  }

  getSavedResult(mailId) {
    return new Promise(resolve => {

      if (!this.db) {
        console.error(`Tried to get result for a mail id but there is no database connection.`);
        return resolve(null);
      }

      if (!mailId) {
        console.error(`Tried to get result for a mail id but an empty or invalid mail id was passed.`);
        return resolve(null);
      }

      const transaction = this.db.transaction([ dbConfig.stores.results ], "readonly");
      const resultStore = transaction.objectStore(dbConfig.stores.results);
      const request = resultStore.get(mailId);

      request.onerror = function (event) {
        console.error(`Ran into an error when getting result for mail id ${mailId}`);
        console.error(event);
        return resolve(null);
      };

      request.onsuccess = function (event) {
        console.log(`Fetched saved result for mail id ${mailId}`);
        console.log(request.result);
        console.log(event);
        return resolve(request.result);
      }
    });
  }

  saveResult(resultObject) {
    return new Promise(resolve => {

      if (!this.db) {
        console.error(`Tried to save result for a mail id but there is no database connection.`);
        return resolve(null);
      }

      if (!resultObject || !resultObject.mailId) {
        console.error(`Tried to save result for a mail id an invalid result object was passed.`);
        return resolve(null);
      }

      const transaction = this.db.transaction([ dbConfig.stores.results ], "readwrite");
      const resultStore = transaction.objectStore(dbConfig.stores.results);
      const request = resultStore.add(resultObject);

      request.onerror = function (event) {
        console.error(`Ran into an error when saving result for mail id ${resultObject.mailId}`);
        console.error(event);
        return resolve(null);
      };

      request.onsuccess = function (event) {
        console.log(`Query success for mail id ${resultObject.mailId}`);
        console.log(request.result);
        console.log(event);
        return resolve(request.result);
      }

    });
  }

  closeConnection() {

  }
}

export default new DbHandler(dbConfig);
