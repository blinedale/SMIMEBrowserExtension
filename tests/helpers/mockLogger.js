import Logger from '../../src/modules/logger';

class MockLogger extends Logger {

  constructor() {
    super({prefix: '', debugMode: true});
  }

  log(message) {}

  err(message) {}

  addPrefixIfString(message) {}

}

export default MockLogger;
