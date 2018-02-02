import SmimeVerificationService from "../smimeVerificationService";
import * as Base64lib from 'js-base64';
import Config from '../config';
import Logger from '../logger';
import DbHandler from '../dbHandler';
import CertificateProvider from '../certificateProvider';
import CertificateParser from '../certificateParser';

const base64lib = Base64lib.Base64;
const configService = new Config();
const dbConfig = configService.get('db');
const applicationConfig = configService.get('application');
const loggerConfig = applicationConfig.logger;

const loggerService = new Logger(loggerConfig);
const dbHandler = new DbHandler(dbConfig, loggerService, base64lib);

const certificateParser = new CertificateParser(base64lib);

const certificateConfig = applicationConfig.certificates;
const certificateProvider = new CertificateProvider(certificateConfig, certificateParser, loggerService);

const smimeVerificationService = new SmimeVerificationService(loggerService);

certificateProvider.getTrustedRootCertificates()
.then(trustedRoots => smimeVerificationService.setTrustedRoots(trustedRoots));

export {
  smimeVerificationService,
  dbHandler,
};
