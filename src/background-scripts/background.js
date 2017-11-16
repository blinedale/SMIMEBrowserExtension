import SmimeVerificationService from '../modules/smimeVerificationService';

console.log('background, booyah!');

const smimeVerificationService = new SmimeVerificationService();


chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.method === 'verifyMessageSignature') {
      smimeVerificationService.verifyMessageSignature(request.rawMessage, request.mailId).then(result => sendResponse(result));

      return true; //will make sure sendResponse is called async
    }

    console.log('unknown message');
  }
);
