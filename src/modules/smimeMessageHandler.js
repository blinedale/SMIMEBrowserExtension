import messagingMethods from '../constants/messagingMethods';

class SmimeMessageHandler {
  constructor(markingService, loggerService, gmailSourceService) {
    this.markingService = markingService;
    this.loggerService = loggerService;
    this.gmailSourceService = gmailSourceService;
  }

  handle(domMessage, messageId) {
    chrome.runtime.sendMessage({method: messagingMethods.getSavedResult, messageId}, result => {
      if (result) {
        // Found something in the database for this messageId. Let's mark and we're done.
        this.markingService.markResult(domMessage, result);
      } else {
        // No saved result for this messageId. Let's fetch message source and verify it.
        this.gmailSourceService.getRawMessage(messageId, false)
        .then(rawMessage => this.verifyAndMark(rawMessage, messageId, domMessage))
        .catch(err => this.loggerService.err(err));
      }
    });
  }

  verifyAndMark(rawMessage, mailId, domMessage) {
    try {
      //send to background and process response
      chrome.runtime.sendMessage({method: messagingMethods.verifyMessageSignature, rawMessage, mailId}, result => {
        if (!result || !result.mailId) {
          throw `Verification error - cannot proceed with mail id ${mailId}.`;
        }

        this.loggerService.log(`Reached conclusive result in S/MIME verification of mail id ${mailId}. Will attempt to save it.`);
        this.loggerService.log(result);

        chrome.runtime.sendMessage({method: messagingMethods.saveResult, result}, result => {
          if (result) {
            this.loggerService.log(`Mail with id ${mailId} successfully saved.`);
          }
        });

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
