class SmimeMessageHandler {
  constructor(dbHandler, markingService, smimeVerificationService, loggerService, gmailSourceService) {
    this.dbHandler = dbHandler;
    this.markingService = markingService;
    this.smimeVerificationService = smimeVerificationService;
    this.loggerService = loggerService;
    this.gmailSourceService = gmailSourceService;
  }

  handle(domMessage, messageId) {
    this.dbHandler.getSavedResult(messageId).then(resultObject => {
      if (resultObject) {
        // Found something in the database for this messageId. Let's mark and we're done.
        this.markingService.markResult(domMessage, resultObject);
        return;
      }

      // No saved result for this messageId. Let's fetch message source and verify it.
      this.gmailSourceService.getRawMessage(messageId, false)
      .then(rawMessage => this.verifyAndMark(rawMessage, messageId, domMessage))
      .catch(err => this.loggerService.err(err));
    });
  }

  verifyAndMark(rawMessage, mailId, domMessage) {
    try {
      this.smimeVerificationService.verifyMessageSignature(rawMessage, mailId).then(result => {
        this.loggerService.log(`Reached conclusive result in S/MIME verification of mail id ${mailId}. Will attempt to save it.`);
        this.loggerService.log(result);

        this.dbHandler.saveResult(result); // Can run this async, does not affect marking.

        this.markingService.markResult(domMessage, result);
      });
    }
    catch (ex) {
      this.loggerService.err(`S/MIME verification failed due to uncaught exception for mail id ${mailId}. Will not save result.`);
      this.loggerService.err(ex);
    }
  }
}

export default SmimeMessageHandler;
