import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import MarkingService from '../markingService';
import SmimeMessageHandler from '../smimeMessageHandler';
import GmailSource from '../gmailSource';
import TooltipService from '../tooltipService';

const base64lib = Base64lib.Base64;
const configService = new Config();
const inboxSDKConfig = configService.get('inboxSDK');
const tooltipConfig = configService.get('tooltipster');
const loggerConfig = configService.get('logger');

const loggerService = new Logger(loggerConfig);
const tooltipService = new TooltipService(tooltipConfig);
const markingService = new MarkingService(tooltipService);
const gmailSourceService = new GmailSource(loggerService);
const smimeMessageHandler = new SmimeMessageHandler(markingService, loggerService, gmailSourceService);

export {
  base64lib,
  inboxSDKConfig,
  loggerService,
  smimeMessageHandler
};
