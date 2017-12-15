import SmimeVerificationService from "../smimeVerificationService";
import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import DbHandler from '../dbHandler';

const smimeVerificationService = new SmimeVerificationService();
const base64lib = Base64lib.Base64;
const configService = new Config();
const dbConfig = configService.get('db');
const loggerConfig = configService.get('application').logger;

const loggerService = new Logger(loggerConfig);
const dbHandler = new DbHandler(dbConfig, loggerService, base64lib);

export {
  smimeVerificationService,
  dbHandler,
};
