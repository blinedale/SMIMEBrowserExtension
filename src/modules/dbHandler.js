import * as Base64lib from 'js-base64';

const base64 = Base64lib.Base64;

class DbHandler {
  constructor(dbConfig, loggerService) {
    this.db = null;
    this.dbConfig = dbConfig;
    this.loggerService = loggerService;

    this.getDb().then(db => { this.db = db; });

    // eslint-disable-next-line no-unused-vars
    window.onunload = () => {
      this.closeConnection();
      return false;
    };
  }

  /**
   * Tries to connect to the indexedDB in the browser window. Only resolves as there is no way to recover if something goes
   * wrong; we just return null and are done with it.
   * @returns {Promise}
   */
  getDb() {
    return new Promise(resolve => {
      if (!window.indexedDB) {
        return resolve(null);
      }

      const request = window.indexedDB.open(this.dbConfig.dbName, this.dbConfig.dbVersion);

      request.onerror = event => {
        this.loggerService.err('Error while creating database connector.');
        this.loggerService.err(event);
        return resolve(null);
      };

      let dbConnection = null;

      // Upgrade/create db as needed
      request.onupgradeneeded = event => {
        dbConnection = request.result;
        if (event.oldVersion < 1) {
          // There is no old version - creating db and store from scratch
          dbConnection.createObjectStore(this.dbConfig.stores.results, {keyPath: "mailId"});
          this.loggerService.log('Created database successfully.');
        }
        if (event.oldVersion < 2) {
          // In future versions we'd upgrade our database here.
        }
      };

      /* This is always run if the request to open the db connection is granted, regardless if we need to upgrade the db
         or not. In that case it is run after the upgrade is done. */
      request.onsuccess = event => {
        dbConnection = event.target.result;
        this.loggerService.log('Created database connector.');
        return resolve(dbConnection);
      };
    });
  }

  getSavedResult(mailId) {
    return new Promise(resolve => {
      if (!this.db) {
        this.loggerService.err(`Tried to get result for mail id ${mailId} but there is no database connection.`);
        return resolve(null);
      }

      if (!mailId) {
        this.loggerService.err(`Tried to get result for mail id ${mailId} but an empty or invalid mail id was passed.`);
        return resolve(null);
      }

      const transaction = this.db.transaction([this.dbConfig.stores.results], "readonly");
      const resultStore = transaction.objectStore(this.dbConfig.stores.results);
      const request = resultStore.get(mailId);

      request.onerror = event => {
        this.loggerService.err(`Ran into an error when getting result for mail id ${mailId}`);
        this.loggerService.err(event);
        return resolve(null);
      };

      // eslint-disable-next-line no-unused-vars
      request.onsuccess = event => {
        this.loggerService.log(`Get query completed for mail id ${mailId}`);
        this.loggerService.log(request.result);

        if (request.result) {
          request.result.signer = base64.decode(request.result.signer);
        }

        return resolve(request.result);
      };
    });
  }

  saveResult(resultObject) {
    return new Promise(resolve => {
      if (!this.db) {
        this.loggerService.err(`Tried to save a verification result but there is no database connection.`);
        return resolve(null);
      }

      if (!resultObject || !resultObject.mailId) {
        this.loggerService.err(`Tried to save result for a mail id an invalid result object was passed.`);
        return resolve(null);
      }

      // To "censor" the signer's email. Cloning to not cause issues with concurrently running code using the same object.
      const resultObjectClone = Object.assign({}, resultObject);
      resultObjectClone.signer =  base64.encode(resultObjectClone.signer);

      const transaction = this.db.transaction([this.dbConfig.stores.results], "readwrite");
      const resultStore = transaction.objectStore(this.dbConfig.stores.results);
      const request = resultStore.add(resultObjectClone);

      request.onerror = event => {
        this.loggerService.err(`Ran into an error when saving result for mail id ${resultObject.mailId}`);
        this.loggerService.err(event);
        return resolve(null);
      };

      // eslint-disable-next-line no-unused-vars
      request.onsuccess = event => {
        this.loggerService.log(`Save success for mail id ${resultObject.mailId}`);
        return resolve(request.result);
      };
    });
  }

  closeConnection() {
    this.loggerService.log('Closing database connection.');
    if (this.db) {
      this.db.close();
    }
  }
}

export default DbHandler;
