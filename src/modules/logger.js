import Config from '../modules/config';

const loggerConfig = Config.get('application').logger;

class Logger {
  constructor(loggerConfig) {
    this.prefix = loggerConfig.prefix || '';
    this.debug = loggerConfig.debugMode || false;
  }

  log(message) {
    if (this.debug) {
      console.log(this.addPrefixIfString(message));
    }
  }

  err(message) {
    if (this.debug) {
      console.error(this.addPrefixIfString(message));
    }
  }

  addPrefixIfString(message) {
    if (typeof message === 'string') {
      return this.prefix + message;
    }

    return message;
  }
}

export default new Logger(loggerConfig);
