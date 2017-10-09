import $ from 'jquery';

const SCAN_LOOP_INTERVAL = 2500;

function init() {
  console.log('Extension loaded!');

  scanLoop();
  window.setInterval(function() {
    scanLoop();
  }, SCAN_LOOP_INTERVAL);
}

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
    console.log(grabThreadId());
  } else {
    console.log('found no email to verify');
  }
}

$(document).ready(init);