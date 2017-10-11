const constants = {
  smimeSpecification: {
    signatureNodeContentTypeValues: ['application/x-pkcs7-signature', 'application/pkcs7-signature'],
    rootNodeContentTypeValue: 'multipart/signed',
    rootNodeContentTypeProtocol: 'application/pkcs7-signature',
    rootNodeContentTypeMessageIntegrityCheckAlgorithms: ['md5', 'sha-1', 'sha-224', 'sha-256', 'sha-384', 'sha-512', 'unknown'],
  },
  smimeVerificationResultCodes: {
    MESSAGE_NOT_SIGNED: 'MESSAGE_NOT_SIGNED',
    MESSAGE_PARSE_ERROR: 'MESSAGE_PARSE_ERROR',
    FRAUD_WARNING_CONTENT_VERIFICATION: 'FRAUD_WARNING_CONTENT_VERIFICATION',
    FRAUD_WARNING_FROM_ADDRESS: 'FRAUD_WARNING_FROM_ADDRESS',
    UNKNOWN_VERIFICATION_ERROR: 'UNKNOWN_VERIFICATION_ERROR',
    VERIFICATION_OK: 'VERIFICATION_OK'
  },
  db: {
    dbName: 'RocketSMIMEBrowserExtensionDatabase',
    dbVersion: 1,
    stores: {
      results: 'results'
    }
  }
};

export default constants;
