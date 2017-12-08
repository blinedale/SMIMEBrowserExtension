import messagingMethods from '../constants/messagingMethods';
import {smimeVerificationService} from '../modules/background';

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.method === messagingMethods.verifyMessageSignature) {
      smimeVerificationService.verifyMessageSignature(request.rawMessage, request.mailId).then(result => sendResponse(result));

      return true; // Will make sure sendResponse is called async
    }

    console.log('unknown message');
  }
);
