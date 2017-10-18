import * as gmailjs from 'gmail-js';

import {verifyMessageSignature} from './smimeModel';
import DbHandler from './dbHandler';
import MarkingService from "./markingService";
import Logger from './logger';

class SmimeMessageHandler {
  constructor() {
    this.gmail = new gmailjs.Gmail();
  }

  handle(domMessage, messageId) {
    DbHandler.getSavedResult(messageId).then(resultObject => {
      if (resultObject) {
        // Found something in the database for this messageId. Let's mark and we're done.
        MarkingService.markResult(domMessage, resultObject);
        return;
      }

      // No saved result for this messageId. Let's fetch message source and verify it.
      this.gmail.get.email_source_async(messageId,
        (rawMessage => this.verifyAndMark(rawMessage, messageId, domMessage)),
        (err => Logger.err(err)),
        true
      );
    });
  }

  verifyAndMark(rawMessage, mailId, domMessage) {
    try {
      verifyMessageSignature(rawMessage, mailId).then(result => {
        Logger.log(`Reached conclusive result in S/MIME verification of mail id ${mailId}. Will attempt to save it.`);
        Logger.log(result);

        DbHandler.saveResult(result); // Can run this async, does not affect marking.

        MarkingService.markResult(domMessage, result);
      });
    }
    catch (ex) {
      Logger.err(`S/MIME verification failed due to uncaught exception for mail id ${mailId}. Will not save result.`);
      Logger.err(ex);
    }
  }
}

export default new SmimeMessageHandler();
