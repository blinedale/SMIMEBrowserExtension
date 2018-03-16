import databaseStores from '../constants/databaseStores';

class DbHandler {
  constructor(dbConfig, loggerService, base64lib) {
    this.db = null;
    this.dbConfig = dbConfig;
    this.loggerService = loggerService;
    this.base64lib = base64lib;

    this.getDb().then(db => {
      this.db = db;
      this.db.onerror = event => {
        this.loggerService.err(`Uncaught database error:`);
        this.loggerService.err(event);
      };
    });

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
        this.loggerService.err(`Browser does not seem to support IndexedDB.`);
        return resolve(null);
      }

      const request = window.indexedDB.open(this.dbConfig.dbName, this.dbConfig.dbVersion);

      request.onerror = event => {
        this.loggerService.err(`Error while creating database connector.`);
        this.loggerService.err(event);
        return resolve(null);
      };

      let dbConnection = null;

      // Upgrade/create db as needed
      request.onupgradeneeded = event => {
        dbConnection = request.result;
        if (event.oldVersion < 1) {
          // There is no old version - creating db and stores from scratch

          Object.keys(databaseStores).forEach(storeKey =>
            dbConnection.createObjectStore(databaseStores[storeKey], {keyPath: `id`}));

          this.loggerService.log(`Created database successfully.`);
        }
        if (event.oldVersion < 2) {
          // In future versions we'd upgrade our database here.
        }
      };

      /* This is always run if the request to open the db connection is granted, regardless if we need to upgrade the db
         or not. In that case it is run after the upgrade is done. */
      request.onsuccess = event => {
        dbConnection = event.target.result;
        this.loggerService.log(`Created database connector.`);
        return resolve(dbConnection);
      };
    });
  }

  get(id, store) {
    return new Promise(resolve => {
      if (!this.db) {
        this.loggerService.err(`Tried to get id ${id} in store ${store} but there is no database connection.`);
        return resolve(null);
      }

      if (!id) {
        this.loggerService.err(`Tried to get id ${id} in store ${store} but an empty or invalid id was passed.`);
        return resolve(null);
      }

      const transaction = this.db.transaction([store], `readonly`);
      const resultStore = transaction.objectStore(store);
      const request = resultStore.get(id);

      request.onerror = event => {
        this.loggerService.err(`Ran into an error when getting id ${id} in store ${store}`);
        this.loggerService.err(event);
        return resolve(null);
      };

      request.onsuccess = () => {
        this.loggerService.log(`Get query completed for id ${id} in store ${store}.`);
        this.loggerService.log(request.result);

        if (!request.result) {
          this.loggerService.log(`Found nothing in db for id ${id} in store ${store}.`);
          return resolve(null);
        }

        if (!request.result.hasOwnProperty(`expirationTime`)) {
          this.loggerService.log(`Got result for id ${id} in store ${store} but no expiration time was set. Returning null instead.`);
          // Email will be verified again and this key will be updated and receive an expiration time.
          return resolve(null);
        }

        if (this.isExpired(request.result)) {
          this.loggerService.log(`Found id ${id} in store ${store} but the entity has expired. Returning null instead.`);
          // Email will be verified again and this key will be updated.
          return resolve(null);
        }

        this.loggerService.log(`Found id ${id} in store ${store} that has not expired yet.`);
        request.result.signer = this.base64lib.decode(request.result.signer);
        return resolve(request.result);
      };
    });
  }

  persist(entity, store) {
    return new Promise(resolve => {
      if (!this.db) {
        this.loggerService.err(`Tried to save a verification result but there is no database connection.`);
        return resolve(null);
      }

      if (!entity || !entity.id) {
        this.loggerService.err(`Tried to save in store ${store} but an invalid entity was passed.`);
        return resolve(null);
      }

      // Cloning to not cause issues with concurrently running code using the same object.
      const entityClone = Object.assign({}, entity, this.calculateExpirationTime());

      // Obfuscating the signer's email.
      entityClone.signer =  this.base64lib.encode(entityClone.signer);

      const transaction = this.db.transaction([store], `readwrite`);

      const resultStore = transaction.objectStore(store);
      resultStore.put(entityClone);

      transaction.oncomplete = () => {
        this.loggerService.log(`Save success for id ${entityClone.id} in store ${store}.`);
        return resolve(entityClone.id);
      };

      transaction.onerror = event => {
        this.loggerService.err(`Ran into an error when saving for id ${entityClone.id} in store ${store}.`);
        this.loggerService.err(event);
        return resolve(null);
      };

      transaction.onabort = event => {
        this.loggerService.err(`Transaction was aborted when saving id ${entityClone.id} in store ${store}.`);
        this.loggerService.err(event);
        return resolve(null);
      };
    });
  }

  /**
   * @param entity
   * @returns {boolean}
   */
  isExpired(entity) {
    const currentDate = new Date();
    return currentDate.getTime() > entity.expirationTime;
  }

  /**
   * @returns {Object}
   */
  calculateExpirationTime() {
    const millisecondsPerMinute = 60000;
    return {
      expirationTime: (new Date((new Date()).getTime() + this.dbConfig.records_expiration_minutes * millisecondsPerMinute))
    };
  }

  closeConnection() {
    this.loggerService.log(`Closing database connection.`);
    if (this.db) {
      this.db.close();
    }
  }
}

export default DbHandler;
