import $ from 'jquery';
import * as gmailjs from 'gmail-js';

import {verifyMessageSignature} from '../modules/smimeModel';
import constants from '../config/constants';
import { getDb, getSavedResult, saveResult } from "../modules/dbHandler";

let gmail = null;
let db = null;
let currentMessageId = 0;

function addMarking(message, type) {
  let messageAttachmentIconDescriptor = null;
  switch (type) {
    case constants.smimeVerificationResultCodes.UNKNOWN_VERIFICATION_ERROR:
      messageAttachmentIconDescriptor = {
        iconUrl: 'https://raw.githubusercontent.com/rocket-internet-berlin/RocketSMIMEBrowserExtension/thread-handling/src/img/verified.png?token=AK-NuuUnh04mTV3EBwMtaQjf9mZ7RNCgks5Z6J_SwA%3D%3D',
        tooltip: constants.smimeVerificationResultCodes.UNKNOWN_VERIFICATION_ERROR
      };
      break;
    case constants.smimeVerificationResultCodes.VERIFICATION_OK:
      messageAttachmentIconDescriptor = {
        iconUrl: 'https://raw.githubusercontent.com/rocket-internet-berlin/RocketSMIMEBrowserExtension/thread-handling/src/img/verified.png?token=AK-NuuUnh04mTV3EBwMtaQjf9mZ7RNCgks5Z6J_SwA%3D%3D',
        tooltip: constants.smimeVerificationResultCodes.VERIFICATION_OK
      };
      break;
  }
  message.addAttachmentIcon(messageAttachmentIconDescriptor);
}

InboxSDK.load(constants.inboxSDK.API_VERSION, constants.inboxSDK.API_KEY).then(function(sdk){
  sdk.Conversations.registerMessageViewHandler(function () {
    sdk.Conversations.registerThreadViewHandler(function (threadView) {
      $.each(threadView.getMessageViewsAll(), function (key, message) {
        if (message.isLoaded()) {
          message.getMessageIDAsync().then(messageId => {
            currentMessageId = key;

            // S/MIME verification
            if (alreadyRanVerification()) {
              console.log('Already verified');
              return;
            }

            setChecking();

            getSavedResult(db, messageId)
              .then(
                savedResult => {
                  if (!savedResult) {
                    console.log('Got no saved result');
                    // Have no saved result. Let's fetch for this email and save the verification result.

                    // Get source
                    gmail.get.email_source_async(messageId,
                      (fullRawEmail => verifyAndMark(fullRawEmail, messageId)),
                      (err => console.error(err)),
                      true // prefer binary
                    );

                    return;
                  }

                  console.log('We have verification results, let us mark them in the UI.');

                  // Do marking
                  mark(savedResult);
                });
          });
        }
      });
    });

  });
});

function init() {
  console.log('Rocket S/MIME Browser Extension loaded!');

  gmail = new gmailjs.Gmail();
  getDb().then(
    dbConnector => {
      db = dbConnector;
    }
  );

  window.onunload = function(e){
    if (db) {
      console.log('Closing database connection.');
      db.close();
    }
    return false;
  };
}

$(document).ready(init);

function verifyAndMark(msg, mailId) {
  verifyMessageSignature(msg)
    .then(
      result => {

        result.mailId = mailId;

        saveResult(db, result); // Can run this async, does not affect marking.

        console.log(`S/MIME verification SUCCESS`);
        console.log(result);

        mark(result);
      }
    )
    .catch(err => {
      console.error(`S/MIME verification failed with code ${err.code}. Will not save result.`);
      console.error(err);
    });
}

function mark(result) {

  if (result.success) {
    setVerified('some dude');
    return;
  }

  if (result.code === constants.smimeVerificationResultCodes.FRAUD_WARNING) {
    setFraudRisk();
    return;
  }

  setVerificationFailed();
}

function setVerified(name) {
  const nameElement = getNameElement();
  nameElement.innerHTML = `${name} - S/MIME verification: OK for from address!`;
}

function setChecking() {
  const nameElement = getNameElement();
  nameElement.innerHTML += ` - S/MIME verification: Working...`;
}

function setVerificationFailed() {
  const nameElement = getNameElement();
  nameElement.innerHTML += ' Failed';
}

function setFraudRisk() {
  const nameElement = getNameElement();
  nameElement.innerHTML += ' FLAGGED FOR POSSIBLE FRAUD';
}

function alreadyRanVerification() {
  const nameElement = getNameElement();
  return nameElement.innerHTML.includes(' S/MIME verification: ');
}

function getNameElement() {
  return document.getElementsByClassName('gD')[currentMessageId];
}