import messagingMethods from '../constants/messagingMethods';
import {smimeVerificationService, signatureVerificationRepository, loggerService} from '../modules/background';

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.method === messagingMethods.verifyMessageSignature) {
      try {
        smimeVerificationService.verifyMessageSignature(request.rawMessage, request.mailId)
        .then(result => sendResponse(result));
      } catch (e) {
        loggerService.err(e);
        sendResponse(null);
      }

      return true; // Will make sure sendResponse is called async
    }

    if (request.method === messagingMethods.getSavedResult) {
      signatureVerificationRepository.get(request.messageId)
      .then(result => sendResponse(result));

      return true;
    }

    if (request.method === messagingMethods.saveResult) {
      signatureVerificationRepository.persist(request.result)
      .then(result => sendResponse(result));

      return true;
    }

    loggerService.err('unknown message');
  }
);
