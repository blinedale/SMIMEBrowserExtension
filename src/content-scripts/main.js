import * as gmailjs from 'gmail-js';

import {verifyMessageSignature} from '../modules/smimeModel';
import constants from '../config/constants';
import DbHandler from "../modules/dbHandler";

let gmail = null;

// eslint-disable-next-line no-undef
InboxSDK.load(constants.inboxSDK.API_VERSION, constants.inboxSDK.API_KEY).then(sdk => {
  gmail = new gmailjs.Gmail();

  sdk.Conversations.registerMessageViewHandler(domMessage => {
    domMessage.getMessageIDAsync().then(messageId => {
      DbHandler.getSavedResult(messageId).then(savedResult => {
        if (!savedResult) {
          gmail.get.email_source_async(messageId,
            (rawMessage => verifyAndMark(rawMessage, messageId, domMessage)),
            (err => console.error(err)),
            true
          );
        } else {
          addMarking(domMessage, savedResult);
        }
      });
    });
  });

  // eslint-disable-next-line no-unused-vars
  window.onunload = function(e) {
    console.log('Closing database connection.');
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
    console.log('already marked');
  } else {
    message.addAttachmentIcon(messageAttachmentIconDescriptor);
  }
}

function verifyAndMark(rawMessage, mailId, domMessage) {
  try {
    verifyMessageSignature(rawMessage).then(
      result => {
        result.mailId = mailId;

        DbHandler.saveResult(result); // Can run this async, does not affect marking.

        console.log(`Reached conclusive result in S/MIME verification.`);
        console.log(result);

        addMarking(domMessage, result);
      }
    );
  }
  catch (ex) {
    console.error(`S/MIME verification failed due to uncaught exception. Will not save result.`);
    console.error(ex);
  }
}
