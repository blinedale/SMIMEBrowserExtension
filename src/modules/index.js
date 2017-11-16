import Config from './config';
import Logger from './logger';
import DbHandler from './dbHandler';
//import SmimeVerificationService from './smimeVerificationService';
import MarkingService from './markingService';
import SmimeMessageHandler from './smimeMessageHandler';
import GmailSource from './gmailSource';

const configService = new Config();
const dbConfig = configService.get('db');
const loggerConfig = configService.get('application').logger;

const loggerService = new Logger(loggerConfig);
const dbHandler = new DbHandler(dbConfig, loggerService);
const markingService = new MarkingService();
//const smimeVerificationService = new SmimeVerificationService();
const gmailSourceService = new GmailSource(loggerService);
const smimeMessageHandler = new SmimeMessageHandler(dbHandler, markingService, loggerService, gmailSourceService);

export {
  configService,
  loggerService,
  smimeMessageHandler
};
