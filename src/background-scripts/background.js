import messagingMethods from '../constants/messagingMethods';
import databaseStores from '../constants/databaseStores';
import {smimeVerificationService, dbHandler, loggerService} from '../modules/background';

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
      dbHandler.get(request.messageId, databaseStores.signatureVerifications)
      .then(result => sendResponse(result));

      return true;
    }

    if (request.method === messagingMethods.saveResult) {
      dbHandler.persist(request.result, databaseStores.signatureVerifications)
      .then(result => sendResponse(result));

      return true;
    }

    console.error('unknown message');
  }
);
