# RocketSMIMEBrowserExtension

A simple browser extension that verifies emails signed with S/MIME signatures in Gmail and Google Inbox. Made by Eric Nordebäck and Sergiu Tomşa for Rocket Internet SE.

Currently supporting the desktop versions of Gmail and Google Inbox in Chrome.  

## Build commands
```yarn``` to install deps.

```grunt``` to build for local development.

```grunt prod``` to build and pack a production version zip.

```grunt watch``` to watch source files and rebuild as necessary.

So far, the only difference between the local dev and prod versions is that the prod version has logging turned off.

Install your local dev version in Chrome as per usual by going to chrome://extensions and activating developer mode. Then click "Load unpacked extension" and pick the build/chrome folder of this project.

## How it works

After install, you'll see a new document icon with a padlock in the top right. The extension is only active when accessing Gmail or Google Inbox. 

As a user, you don't need to do anything - everything happens behind the scenes. Whenever you open an email, the extension will fetch the full source code of that email and run it through our verification system to check if it...

1. ...is a valid S/MIME message
2. ...has a valid signature
3. ...the signature matches the message content
4. ...the 'From' address matches the signer's email in the certificate

- An email failing step 1 will not be processed further and will not be marked in the UI in any way.
- Passing step 1 but failing step 2, 3, or 4 will result in the email being marked with an angry red x plus a message stating 'Fraud warning!'.
- Passing all the steps will result in the email being marked with a green check mark plus the email address contained in the cryptographic signature.

Marking is done in the upper right of each email. Note that any email in a thread has to be opened completely to trigger a verification; we do not verify emails that are collapsed or hidden in previous thread history.

Verification results are stored in the local IndexedDB in the browser so we do not have to re-run verification once a certain email is re-opened.

Note that we currently do not check if a certificate has been revoked during verification. This means that emails signed with revoked certificates will show up as valid if everything else checks out.

## Road map

- Checking if a certificate is revoked during verification
- Firefox build
- Possibly releasing this project as open source
- Upload to Chrome Web Store

## Credits

### Image assets

- [Checked free icon](https://www.flaticon.com/free-icon/checked_179372) made by [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha).
- [Cancel free icon](https://www.flaticon.com/free-icon/cancel_179429) made by [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha).
- [File free icon](https://www.flaticon.com/free-icon/file_137661) made by [Smashicons](https://www.flaticon.com/authors/smashicons).

All icons listed are available at [Flaticon](https://www.flaticon.com) and are licensed under [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/).

### Code

- The functionality to fetch the full email source code was re-used from [gmail.js](https://github.com/KartikTalwar/gmail.js) under their [MIT License](https://github.com/KartikTalwar/gmail.js/blob/master/LICENSE.md) (Copyright (c) 2014 Kartik Talwar).
- The base library for catching events and manipulating the UI in Gmail and Inbox is [InboxSDK](https://www.inboxsdk.com/) which we are using as per their [terms and conditions](https://www.inboxsdk.com/terms). 
  