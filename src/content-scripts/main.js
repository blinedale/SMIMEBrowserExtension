import $ from 'jquery';
import * as gmailjs from 'gmail-js';

import {verifyMessageSignature} from '../modules/smimeModel';
import constants from '../config/constants';
import { getDb, getSavedResult, saveResult } from "../modules/dbHandler";

const SCAN_LOOP_INTERVAL = 2500;
let gmail = null;
let db = null;

function init() {
  console.log('Rocket S/MIME Browser Extension loaded!');

  gmail = new gmailjs.Gmail();
  getDb().then(
    dbConnector => {
      db = dbConnector;
    }
  );

  scanLoop();
  window.setInterval(function() {
    scanLoop();
  }, SCAN_LOOP_INTERVAL);

  window.onunload = function(e){
    if (db) {
      console.log('Closing database connection.');
      db.close();
    }
    return false;
  };
}

$(document).ready(init);

function grabThreadId() {
  var matched = window.location.hash.match(/[A-Za-z0-9]+$/);
  if (matched) {
    return matched[0];
  }

  return null;
}

function scanLoop() {
  var result = /^https:\/\/mail\.google\.com\/mail\/.+inbox\/([a-z0-9]+)$/.exec(window.location.href);

  if (result && result.length > 1) {
    console.log(window.location.href);
    const threadId = grabThreadId();


    if (alreadyRanVerification()) {
      console.log('Already verified');
      return;
    }

    setChecking();

    // for now assuming thread id is mail id

    // Check if we already verified this id

    // Normally, we'd fetch the ids of all visible emails in this thread and then foreach getSavedResult.

    getSavedResult(db, threadId)
      .then(
        savedResult => {

          if (!savedResult) {

            console.log('Got no saved result');
            // Have no saved result. Let's fetch for this email and save the verification result.

            // Get source
            gmail.get.email_source_async(null,
              (fullRawEmail => verifyAndMark(fullRawEmail, threadId)),
              (err => console.error(err)),
              true // prefer binary
            );

            return;
          }

          console.log('We have verification results, let us mark them in the UI.');

          // Do marking
          mark(savedResult);
      });
  } else {
    console.log('found no email to verify');
  }
}

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

  if (result.code === constants.smimeVerificationResultCodes.FRAUD_WARNING_FROM_ADDRESS ||
    result.code === constants.smimeVerificationResultCodes.FRAUD_WARNING_CONTENT_VERIFICATION) {
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
  return document.getElementsByClassName('gD')[0];
}