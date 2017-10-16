import {verifyMessageSignature} from '../modules/smimeModel';
import Config from '../modules/config';
import DbHandler from '../modules/dbHandler';
import Logger from '../modules/logger';

const inboxSDKConfig = Config.get('inboxSDK');
const inboxSDKApiVersion = inboxSDKConfig.API_VERSION;
const inboxSDKApiKey = window.atob(inboxSDKConfig.API_KEY);

// eslint-disable-next-line no-undef
InboxSDK.load(inboxSDKApiVersion, inboxSDKApiKey).then(sdk => {
  sdk.Conversations.registerMessageViewHandler(domMessage => {
    domMessage.getMessageIDAsync().then(messageId => {
      DbHandler.getSavedResult(messageId).then(savedResult => {
        if (!savedResult) {
          fetch(`https://mail.google.com/mail/u/0?view=att&th=${messageId}`)
          .then(rawMessage => verifyAndMark(rawMessage, messageId, domMessage))
          .catch(err => Logger.err(err));
        } else {
          addMarking(domMessage, savedResult);
        }
      });
    });
  });

  // eslint-disable-next-line no-unused-vars
  window.onunload = function(e) {
    DbHandler.closeConnection();
    return false;
  };
});

function addMarking(message, result) {
  const markedClass = `smime-mark-${result.mailId}`;
  const messageAttachmentIconDescriptor = {
    iconUrl: chrome.runtime.getURL(`img/${result.code.toLowerCase()}.png`),
    iconClass: markedClass,
    tooltip: result.message
  };

  if (document.getElementsByClassName(markedClass).length > 0) {
    Logger.log(`Mail id ${result.mailId} already marked`);
  } else {
    message.addAttachmentIcon(messageAttachmentIconDescriptor);
  }
}

function verifyAndMark(rawMessage, mailId, domMessage) {
  try {
    verifyMessageSignature(rawMessage).then(result => {
      result.mailId = mailId;

      Logger.log(`Reached conclusive result in S/MIME verification of mail id ${mailId}. Will attempt to save it.`);
      Logger.log(result);

      DbHandler.saveResult(result); // Can run this async, does not affect marking.

      addMarking(domMessage, result);
    });
  }
  catch (ex) {
    Logger.err(`S/MIME verification failed due to uncaught exception for mail id ${mailId}. Will not save result.`);
    Logger.err(ex);
  }
}
