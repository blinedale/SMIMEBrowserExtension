import * as Base64lib from 'js-base64';

import {smimeMessageHandler, configService} from '../modules';

const base64 = Base64lib.Base64;

const inboxSDKConfig = configService.get('inboxSDK');
const inboxSDKApiVersion = inboxSDKConfig.API_VERSION;
const inboxSDKApiKey = base64.decode(inboxSDKConfig.API_KEY);

// eslint-disable-next-line no-undef
InboxSDK.load(inboxSDKApiVersion, inboxSDKApiKey).then(sdk => {
  sdk.Conversations.registerMessageViewHandler(domMessage => {
    domMessage.getMessageIDAsync().then(messageId => {
      smimeMessageHandler.handle(domMessage, messageId);
    });
  });
});
