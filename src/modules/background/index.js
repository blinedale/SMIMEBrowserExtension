import SmimeVerificationService from '../smimeVerificationService';
import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import DbHandler from '../dbHandler';
import CertificateProvider from '../certificateProvider';
import CertificateParser from '../certificateParser';
import RevocationCheckProvider from '../revocationCheckProvider';
import SignatureVerificationRepository from '../signatureVerificationRepository';
import RevocationCheckRepository from '../revocationCheckRepository';

const base64lib = Base64lib.Base64;

const configService = new Config();
const dbConfig = configService.get('db');
const loggerConfig = configService.get('logger');
const smimeVerificationConfig = configService.get('smimeVerification');

const loggerService = new Logger(loggerConfig);
const dbHandler = new DbHandler(dbConfig, loggerService, base64lib);
const signatureVerificationRepository = new SignatureVerificationRepository(dbHandler, base64lib);
const revocationCheckRepository = new RevocationCheckRepository(dbHandler, base64lib);

const revocationCheckProvider = new RevocationCheckProvider(revocationCheckRepository, smimeVerificationConfig, loggerService, base64lib);
const certificateParser = new CertificateParser(base64lib);
const certificateConfig = smimeVerificationConfig.certificates;
const certificateProvider = new CertificateProvider(certificateConfig, certificateParser, loggerService);

const smimeVerificationService = new SmimeVerificationService(loggerService, smimeVerificationConfig, certificateProvider, revocationCheckProvider);

export {
  smimeVerificationService,
  signatureVerificationRepository,
  loggerService
};
