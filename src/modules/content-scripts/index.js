import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import MarkingService from '../markingService';
import SmimeMessageHandler from '../smimeMessageHandler';
import GmailSource from '../gmailSource';

const base64lib = Base64lib.Base64;
const configService = new Config();
const loggerConfig = configService.get('application').logger;

const loggerService = new Logger(loggerConfig);
const markingService = new MarkingService();
const gmailSourceService = new GmailSource(loggerService);
const smimeMessageHandler = new SmimeMessageHandler(markingService, loggerService, gmailSourceService);

export {
  base64lib,
  configService,
  loggerService,
  smimeMessageHandler
};
