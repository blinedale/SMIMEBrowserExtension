import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import DbHandler from '../dbHandler';
import MarkingService from '../markingService';
import SmimeMessageHandler from '../smimeMessageHandler';
import GmailSource from '../gmailSource';

const base64lib = Base64lib.Base64;
const configService = new Config();
const dbConfig = configService.get('db');
const loggerConfig = configService.get('application').logger;

const loggerService = new Logger(loggerConfig);
const dbHandler = new DbHandler(dbConfig, loggerService, base64lib);
const markingService = new MarkingService();
const gmailSourceService = new GmailSource(loggerService);
const smimeMessageHandler = new SmimeMessageHandler(dbHandler, markingService, loggerService, gmailSourceService);

export {
  base64lib,
  configService,
  loggerService,
  smimeMessageHandler
};
