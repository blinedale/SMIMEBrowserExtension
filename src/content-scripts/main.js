import $ from 'jquery';
import * as gmailjs from 'gmail-js';

import {verifyMessageSignature} from '../modules/smimeModel';
import constants from '../config/constants';
import DbHandler from "../modules/dbHandler";

let gmail = null;

InboxSDK.load(constants.inboxSDK.API_VERSION, constants.inboxSDK.API_KEY).then(function(sdk){
  sdk.Conversations.registerMessageViewHandler(function (domMessage) {
    domMessage.getMessageIDAsync().then(messageId => {
      DbHandler.getSavedResult(messageId)
        .then(
          savedResult => {
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
});

function init() {
  console.log('Rocket S/MIME Browser Extension loaded!');

  gmail = new gmailjs.Gmail();

  window.onunload = function(e){
    console.log('Closing database connection.');
    DbHandler.closeConnection();
    return false;
  };
}

$(document).ready(init);

function addMarking(message, result) {
  let markedClass = 'smime-mark-' + result.mailId;
  let messageAttachmentIconDescriptor = {
    iconUrl: chrome.runtime.getURL('img/' + result.code.toLowerCase() + '.png'),
    iconClass: markedClass,
    tooltip: result.message
  };

  if(document.getElementsByClassName(markedClass).length) {
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
