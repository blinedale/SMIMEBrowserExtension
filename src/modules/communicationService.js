import communicationMethods from '../constants/communicationMethods';

class CommunicationService {
  constructor(markingService, loggerService, gmailSourceService) {
    this.chromeRuntime = chrome.runtime;
    this.markingService = markingService;
    this.loggerService = loggerService;
    this.gmailSourceService = gmailSourceService;
  }

  handle(domMessage, messageId) {
    this.domMessage = domMessage;
    this.messageId = messageId;

    this.getSavedMessage();
  }

  getSavedMessage() {
    this.chromeRuntime.sendMessage({
      method: communicationMethods.getSavedResult,
      messageId: this.messageId
    }, result => {
      this.result = result;
      if (this.result) {
        this.markResult();
      } else {
        this.gmailSourceService.getRawMessage(this.messageId, false)
        .then(rawMessage => this.verifyAndMark(rawMessage))
        .catch(err => this.loggerService.err(err));
      }
    });
  }

  verifyAndMark(rawMessage) {
    try {
      this.chromeRuntime.sendMessage({
        method: communicationMethods.verifyMessageSignature,
        rawMessage,
        messageId: this.messageId
      }, result => {
        this.result = result;

        this.loggerService.log(`Reached conclusive result in S/MIME verification of mail id ${this.messageId}. Will attempt to save it.`);
        this.loggerService.log(result);

        this.chromeRuntime.sendMessage({method: communicationMethods.saveResult, result: this.result}, result => {
          if (result) {
            this.loggerService.log(`Mail with id ${this.messageId} successfully saved.`);
          }
        });

        this.markResult();
      });
    }
    catch (ex) {
      this.loggerService.err(`S/MIME verification failed due to uncaught exception for mail id ${this.messageId}. Will not save result.`);
      this.loggerService.err(ex);
    }
  }

  markResult() {
    this.markingService.markResult(
      this.domMessage,
      this.result
    );
  }
}

export default CommunicationService;
