

class RevocationCheckProvider {
  constructor(loggerService) {
    this.logger = loggerService;
  }

  checkRevocationForSignature(signature) {
      this.logger.log('This is where we do the OCSP check');
  }
}

export default RevocationCheckProvider;
