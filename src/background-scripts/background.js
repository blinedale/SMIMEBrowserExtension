import messagingMethods from '../constants/messagingMethods';
import {smimeVerificationService, dbHandler} from '../modules/background';

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.method === messagingMethods.verifyMessageSignature) {
      try {
        smimeVerificationService.verifyMessageSignature(request.rawMessage, request.mailId).then(result => sendResponse(result));
      } catch (e) {
        sendResponse(null);
      }

      return true; // Will make sure sendResponse is called async
    }

    if (request.method === messagingMethods.getSavedResult) {
      dbHandler.getSavedResult(request.messageId).then(result => sendResponse(result));

      return true;
    }

    if (request.method === messagingMethods.saveResult) {
      dbHandler.saveResult(request.result).then(result => sendResponse(result));

      return true;
    }

    console.error('unknown message');
  }
);
