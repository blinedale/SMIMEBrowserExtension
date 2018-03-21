import messagingMethods from '../constants/messagingMethods';

class SmimeMessageHandler {
  constructor(markingService, loggerService, gmailSourceService) {
    this.markingService = markingService;
    this.loggerService = loggerService;
    this.gmailSourceService = gmailSourceService;
  }

  chromeRuntimeSendMessage(payload) {
    return new Promise(((resolve, reject) => {
      chrome.runtime.sendMessage(payload, result => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Chrome Runtime sendMessage failed.'));
        }
      });
    }));
  }

  handle(domMessage, messageId) {
    this.chromeRuntimeSendMessage({method: messagingMethods.getSavedResult, messageId})
    .then(result => {
      if (result) {
        this.markingService.markResult(domMessage, result);
      } else {
        this.gmailSourceService.getRawMessage(messageId, false)
        .then(rawMessage => this.verifyAndMark(rawMessage, messageId, domMessage))
        .catch(err => this.loggerService.err(err));
      }
    })
    .catch(error => {
      this.loggerService.log(error);
    });
  }

  verifyAndMark(rawMessage, mailId, domMessage) {
    try {
      // Send to background script and process response
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
