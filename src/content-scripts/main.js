import $ from 'jquery';
import * as gmailjs from 'gmail-js';

import {verifyMessageSignature} from '../modules/smimeModel';
import constants from '../config/constants';

const SCAN_LOOP_INTERVAL = 2500;
let gmail = null;

function init() {
  console.log('Extension loaded!');

  gmail = new gmailjs.Gmail();

  scanLoop();
  window.setInterval(function() {
    scanLoop();
  }, SCAN_LOOP_INTERVAL);
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

    gmail.get.email_source_async(null,
      (fullRawEmail => verifySmime(fullRawEmail)),
      (err => console.error(err)),
      true // prefer binary
    );

  } else {
    console.log('found no email to verify');
  }
}

function verifySmime(msg) {
  verifyMessageSignature(msg)
    .then(
      result => {
        console.log(`S/MIME verification SUCCESS`);
        console.log(result);

        setVerified(result.fromName, result.signerEmail);
      }
    )
    .catch(err => {

      // TODO: this type of logic should go into the marking module later
      if (err.code === constants.smimeVerificationResultCodes.FRAUD_WARNING_FROM_ADDRESS ||
        err.code === constants.smimeVerificationResultCodes.FRAUD_WARNING_CONTENT_VERIFICATION) {
        setFraudRisk();
      } else {
        setVerificationFailed();
      }

      console.error(`S/MIME verification failed ${err.code}`);
      console.error(err);
    });
}

function setVerified(name, email) {
  const nameElement = getNameElement();
  nameElement.innerHTML = `${name} - S/MIME verification: OK for ${email}!`;
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