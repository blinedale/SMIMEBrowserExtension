import SmimeVerificationService from '../smimeVerificationService';
import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import DbHandler from '../dbHandler';
import CertificateProvider from '../certificateProvider';
import CertificateParser from '../certificateParser';
import RevocationCheckProvider from '../revocationCheckProvider';

const base64lib = Base64lib.Base64;

const configService = new Config();
const dbConfig = configService.get('db');
const loggerConfig = configService.get('logger');
const smimeVerificationConfig = configService.get('smimeVerification');

const loggerService = new Logger(loggerConfig);
const dbHandler = new DbHandler(dbConfig, loggerService, base64lib);

const revocationCheckProvider = new RevocationCheckProvider(smimeVerificationConfig, loggerService, base64lib);
const certificateParser = new CertificateParser(base64lib);
const certificateConfig = smimeVerificationConfig.certificates;
const certificateProvider = new CertificateProvider(certificateConfig, certificateParser, loggerService);

const smimeVerificationService = new SmimeVerificationService(loggerService, smimeVerificationConfig, certificateProvider, revocationCheckProvider);

export {
  smimeVerificationService,
  dbHandler,
};
