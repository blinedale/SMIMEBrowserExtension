import {base64lib, smimeMessageHandler, configService, loggerService} from '../modules/content-scripts';

const inboxSDKConfig = configService.get('inboxSDK');
const inboxSDKApiVersion = inboxSDKConfig.API_VERSION;
const inboxSDKApiKey = base64lib.decode(inboxSDKConfig.API_KEY);

// eslint-disable-next-line no-undef
InboxSDK.load(inboxSDKApiVersion, inboxSDKApiKey)
.then(sdk => {
  sdk.Conversations.registerMessageViewHandler(domMessage => {
    domMessage.getMessageIDAsync().then(messageId => {
      smimeMessageHandler.handle(domMessage, messageId);
    });
  });
})
.catch(error => {
  // This currently happens for Firefox as InboxSDK uses some WebKit specific code.
  loggerService.err('Could not load InboxSDK.');
  loggerService.err(error);
});
