# RocketSMIMEBrowserExtension

A simple browser extension that verifies emails signed with S/MIME signatures in Gmail and Google Inbox. Made by Eric Nordebäck and Sergiu Tomşa for Rocket Internet SE.

Currently supporting the desktop versions of Gmail and Google Inbox in Chrome.  

## Build commands
```yarn``` to install deps.

```grunt``` to build for local development.

```grunt prod``` to build and pack a production version zip.

```grunt watch``` to watch source files and rebuild as necessary.

So far, the only difference between the local dev and prod versions is that the prod version has logging turned off.

## Getting started

- Clone the repo.
- Copy ```config/config.json.dist``` to ```config/config.json``` and add your own API key for InboxSDK.
- For now, let's assume you do not want to perform revocation checks via a backend script, so let's leave ```requireRevocationCheck``` on ```false```. More details on this later.
- Copy ```src/chrome/manifest.json.dist``` to ```src/chrome/manifest.json```.
- Run ```yarn && grunt```.
- Go to chrome://extensions and activate developer mode.
- Click "Load unpacked" and pick the build/chrome folder of this project to load the extension. 

## How it works

After install, you'll see a new document icon with a padlock in the top right. The extension is only active when accessing Gmail or Google Inbox. 

As a user, you don't need to do anything - everything happens behind the scenes. Whenever you open an email, the extension will fetch the full source code of that email and run it through our verification system to check if it...

1. ...is a valid S/MIME message
2. ...has a valid signature
3. ...no included certificates are expired/ not valid yet
4. ...the signature matches the message content
5. ...the 'From' address matches the signer's email in the certificate

- An email failing step 1 will not be processed further and will not be marked in the UI in any way.
- Passing step 1 but failing step 2, 3, 4, or 5 will result in the email being marked with an angry red x plus a message stating 'Fraud warning!'.
- Passing all the steps will result in the email being marked with a green check mark plus the email address contained in the cryptographic signature.

Marking is done in the upper right of each email. Note that any email in a thread has to be opened completely to trigger a verification; we do not verify emails that are collapsed or hidden in previous thread history.

Verification results are stored in the local IndexedDB in the browser so we do not have to re-run verification once a certain email is re-opened.

Note that we currently do not check if a certificate has been revoked during verification. This means that emails signed with revoked certificates will show up as valid if everything else checks out.

## Trusted certificate authorities

The set of trusted certificate authorities is fetched from [Mozilla](https://wiki.mozilla.org/CA/Included_Certificates). We parse the raw PEM data into PKI.js Certificate objects on boot. 

During verification, we check the entire chain of certificates up to the root certificate - this must be a trusted CA or the verification fails.  

## Road map

- Checking if a certificate is revoked during verification
- Working Firefox build (current Firefox version is broken due to incompatibility with InboxSDK)
- Possibly releasing this project as open source

## Credits

### Image assets

- [Checked free icon](https://www.flaticon.com/free-icon/checked_179372) made by [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha).
- [Cancel free icon](https://www.flaticon.com/free-icon/cancel_179429) made by [Pixel Buddha](https://www.flaticon.com/authors/pixel-buddha).
- [File free icon](https://www.flaticon.com/free-icon/file_137661) made by [Smashicons](https://www.flaticon.com/authors/smashicons).

All icons listed are available at [Flaticon](https://www.flaticon.com) and are licensed under [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/).

### Code

- The functionality to fetch the full email source code was re-used from [gmail.js](https://github.com/KartikTalwar/gmail.js) under their [MIT License](https://github.com/KartikTalwar/gmail.js/blob/master/LICENSE.md) (Copyright (c) 2014 Kartik Talwar).
- The base library for catching events and manipulating the UI in Gmail and Inbox is [InboxSDK](https://www.inboxsdk.com/) which we are using as per their [terms and conditions](https://www.inboxsdk.com/terms). 

### Setting up OCSP request on AWS Lambda 
1. Create new Lambda function inside AWS Console; choose a name, Python 3.6 runtime and create a new custom role (we will deal with permissions later)
2. Edit the code inline; update the lambda_function.py with the code from [here](https://raw.githubusercontent.com/rocket-internet-berlin/RocketSMIMEBrowserExtension/cebcf5743d9470b95b1792c062b181982cf17938/lambda_function.py?token=AK-NukachpWN8eD3TsV5DYZLGslN6i-yks5avhR-wA%3D%3D) and also create a new file called ocsp_request.py, code [here](https://raw.githubusercontent.com/rocket-internet-berlin/RocketSMIMEBrowserExtension/cebcf5743d9470b95b1792c062b181982cf17938/ocsp_request.py?token=AK-NukGJg29vgFe5RGjpja09m77e8bsiks5avhSSwA%3D%3D); make sure to save in both places (inline editor, CTRL+S and lambda management console, top right Save button)
3. Near the Save button there is a `select test event` dropdown; go there and configure a new test event; give it a name and save a json with the following structure
    ```json
    {
      "signature": "MIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADCABgkqhkiG9w0BBwEAAKCCCx0wggUvMIIEF6ADAgECAhAkGmSWUYBRBqqP3G0PXsTwMA0GCSqGSIb3DQEBCwUAMIGXMQswCQYDVQQGEwJHQjEbMBkGA1UECBMSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYDVQQHEwdTYWxmb3JkMRowGAYDVQQKExFDT01PRE8gQ0EgTGltaXRlZDE9MDsGA1UEAxM0Q09NT0RPIFJTQSBDbGllbnQgQXV0aGVudGljYXRpb24gYW5kIFNlY3VyZSBFbWFpbCBDQTAeFw0xNzA5MjgwMDAwMDBaFw0xODA5MjgyMzU5NTlaMCMxITAfBgkqhkiG9w0BCQEWEnRzZXJnaXVtQGdtYWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALP9Dtz8d28sSJoi6Sk6GmedDVmGkCBX1xEAcgg1zC58k3Tr9nHJrOohdp8vcKQjymWmgOyq+ODIH6i4jKlnMBXh1Iou0N9Nc1xnoDeIx+hDZD1f7eDXmijx6nkNHoWhJLf2HhDYaDoLMc2f1PPhLy5eBOcwhkAqqe4vEIT/i/VUYHCUr27cS/D42DF/9PbqUma4TAMlUfWG7yEOSqwwWnLqTQGfHtJjGoWA0yMAuLZZVAlNE8PfhmNVaRX4J/T2x96PC644gk3a7RdQAd/wyeR5MUAtuhYZPRh3LTStSRr+bhpg7mvu8z09Ntlkx1dQL/Mr7yVUSLBskDvKHG3//4UCAwEAAaOCAegwggHkMB8GA1UdIwQYMBaAFIKvbIz4xf6WYXzoHz0rcUhexIvAMB0GA1UdDgQWBBTBr9LEw2OzHf/v+0I7uP4PHHs+QTAOBgNVHQ8BAf8EBAMCBaAwDAYDVR0TAQH/BAIwADAgBgNVHSUEGTAXBggrBgEFBQcDBAYLKwYBBAGyMQEDBQIwEQYJYIZIAYb4QgEBBAQDAgUgMEYGA1UdIAQ/MD0wOwYMKwYBBAGyMQECAQEBMCswKQYIKwYBBQUHAgEWHWh0dHBzOi8vc2VjdXJlLmNvbW9kby5uZXQvQ1BTMFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwuY29tb2RvY2EuY29tL0NPTU9ET1JTQUNsaWVudEF1dGhlbnRpY2F0aW9uYW5kU2VjdXJlRW1haWxDQS5jcmwwgYsGCCsGAQUFBwEBBH8wfTBVBggrBgEFBQcwAoZJaHR0cDovL2NydC5jb21vZG9jYS5jb20vQ09NT0RPUlNBQ2xpZW50QXV0aGVudGljYXRpb25hbmRTZWN1cmVFbWFpbENBLmNydDAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2RvY2EuY29tMB0GA1UdEQQWMBSBEnRzZXJnaXVtQGdtYWlsLmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAIS1RJjLo5uyn0I/ZkmpCiNh+Y8XWqTBpiZ+xpHI2rv0raP58ohm3kRd3rYkfKh0h6dzvnVG7d+1OA54UBNprnXH3r2CKuS/cQn6vOT9bVmwxQBGV80dLbC8xGvhtFynqr7Mv5prH+9MHEbxhSSC6JXGuLMrk9JK0aRbFxYrCCCBDcTckonmIxcsEjjGouz2HXRpaMlTUl6tKqUaDZm0Z90ww3kgedqGr3tEjtsqvNBjxhSmVO9YAodq2AgSc9NDSHLoymtKi16bXgP4Zw5YLq6W0/D1uzpkauAwvpGDQP4RWe6q5KDDR6CTcVqa01wOZh+1kMEDqKSMLplkyNMlNIjCCBeYwggPOoAMCAQICEGqb4Tg7/ytrnwHV2binUlYwDQYJKoZIhvcNAQEMBQAwgYUxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMSswKQYDVQQDEyJDT01PRE8gUlNBIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTEzMDExMDAwMDAwMFoXDTI4MDEwOTIzNTk1OVowgZcxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMT0wOwYDVQQDEzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWlsIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvrOeV6wodnVAFsc4A5jTxhh2IVDzJXkLTLWg0X06WD6cpzEup/Y0dtmEatrQPTRI5Or1u6zf+bGBSyD9aH95dDSmeny1nxdlYCeXIoymMv6pQHJGNcIDpFDIMypVpVSRsivlJTRENf+RKwrB6vcfWlP8dSsE3Rfywq09N0ZfxcBa39V0wsGtkGWC+eQKiz4pBZYKjrc5NOpG9qrxpZxyb4o4yNNwTqzaaPpGRqXB7IMjtf7tTmU2jqPMLxFNe1VXj9XB1rHvbRikw8lBoNoSWY66nJN/VCJv5ym6Q0mdCbDKCMPybTjoNCQuelc0IAaO4nLUXk0BOSxSxt8kCvsUtQIDAQABo4IBPDCCATgwHwYDVR0jBBgwFoAUu69+Aj36pvE8hI6t7jiY7NkyMtQwHQYDVR0OBBYEFIKvbIz4xf6WYXzoHz0rcUhexIvAMA4GA1UdDwEB/wQEAwIBhjASBgNVHRMBAf8ECDAGAQH/AgEAMBEGA1UdIAQKMAgwBgYEVR0gADBMBgNVHR8ERTBDMEGgP6A9hjtodHRwOi8vY3JsLmNvbW9kb2NhLmNvbS9DT01PRE9SU0FDZXJ0aWZpY2F0aW9uQXV0aG9yaXR5LmNybDBxBggrBgEFBQcBAQRlMGMwOwYIKwYBBQUHMAKGL2h0dHA6Ly9jcnQuY29tb2RvY2EuY29tL0NPTU9ET1JTQUFkZFRydXN0Q0EuY3J0MCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5jb21vZG9jYS5jb20wDQYJKoZIhvcNAQEMBQADggIBAHhcsoEoNE887l9Wzp+XVuyPomsX9vP2SQgG1NgvNc3fQP7TcePo7EIMERoh42awGGsma65u/ITse2hKZHzT0CBxhuhb6txM1n/y78e/4ZOs0j8CGpfb+SJA3GaBQ+394k+z3ZByWPQedXLL1OdK8aRINTsjk/H5Ns77zwbjOKkDamxlpZ4TKSDMKVmU/PUWNMKSTvtlenlxBhh7ETrN543j/Q6qqgCWgWuMAXijnRglp9fyadqGOncjZjaaSOGTTFB+E2pvOUtY+hPebuPtTbq7vODqzCM6ryEhNhzf+enm0zlpXK7q332nXttNtjv7VFNYG+I31gnMrwfHM5tdhYF/8v5UY5g2xANPECTQdu9vWPoqNSGDt87b3gXb1AiGGaI06vzgkejL580ul+9hz9D0S0U4jkhJiA7EuTecP/CFtR72uYRBcunwwH3fciPjviDDAI9SnC/2aPY8ydehzuZutLbZdRJ5PDEJM/1tyZR2niOYihZ+FCbtf3D9mB12D4ln9icgc7CwaxpNSCPt8i/GqK2HsOgkL3VYnwtx7cJUmpvVdZ4ognzgXtgtdk3ShrtOS1iAN2ZBXFiRmjVzmehoMof06r1xub+85hFQzVxZx5/bRaTKTlL8YXLI8nAbR9HWdFqzcOoB/hxfEyIQpx9/s81rgzdEZOofSlZHynoSMYIENTCCBDECAQEwgawwgZcxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMT0wOwYDVQQDEzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWlsIENBAhAkGmSWUYBRBqqP3G0PXsTwMA0GCWCGSAFlAwQCAQUAoIICWTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNzEwMjAwOTE3NTdaMC8GCSqGSIb3DQEJBDEiBCDX43vlgh5qXweqqG1Wc6zxFbY3leSH2OlJtBbhLLMC9zBsBgkqhkiG9w0BCQ8xXzBdMAsGCWCGSAFlAwQBKjALBglghkgBZQMEAQIwCgYIKoZIhvcNAwcwDgYIKoZIhvcNAwICAgCAMA0GCCqGSIb3DQMCAgFAMAcGBSsOAwIHMA0GCCqGSIb3DQMCAgEoMIG9BgkrBgEEAYI3EAQxga8wgawwgZcxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMT0wOwYDVQQDEzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWlsIENBAhAkGmSWUYBRBqqP3G0PXsTwMIG/BgsqhkiG9w0BCRACCzGBr6CBrDCBlzELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxPTA7BgNVBAMTNENPTU9ETyBSU0EgQ2xpZW50IEF1dGhlbnRpY2F0aW9uIGFuZCBTZWN1cmUgRW1haWwgQ0ECECQaZJZRgFEGqo/cbQ9exPAwDQYJKoZIhvcNAQEBBQAEggEArUjvKU087tMRCs/8uPRU/kacRvyChst9c3HwNQUV5Ff3Bm0sAHgn6108tw+GpcxbO8rt2BOMslM70veYwjMjloLVLybum13HYI5sxSz0CqQP6Q9znYv60T0lL1Mdg5gQ33RwDMziBfK982QaSTmdvMnBIC5690lrc1iJKWefoC3642JhOq22e4yeTEVMCKjfOsM8fRkJ6T1CHdMk/IE3BQHq0Q3LQ45qeuP7eYaUU/oirLtIiI6OMW9Ky5da6IJ8jsEOFq6guViBZgxfXPFuLmfYh+HxMdgDcjHoYbM3IdpG39gfEPd+wS6rUHb6464W0XJ1cj/vlvzCOGw0HaKljgAAAAAAAA=="
    }
    ```
4. Save everything and click on Test; you should get a response like this:
    ```json
    {
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": {
        "Content-Type": "application/json"
      },
      "body": "{\"client_certificate_serial_number\": \"241A649651805106AA8FDC6D0F5EC4F0\", \"ocsp_result\": [\"Can't get connection fd\", \"Error querying OCSP responder\", \"\"]}"
    }
    ```
5. Everything is set up properly; we're getting this response because we're not allowed to make OCSP requests from a Lambda function; also, the response is formatted to fit the needs of API Gateway which we will be setting up shortly
6. Go to Configuration > Designer (middle of the Lambda Management Console page) and add the API Gateway trigger
7. Go to Configure triggers and create a new API; give it a name and a stage name and make it open
8. Go to Services > API Gateway and configure the endpoint needed to reach the lambda function
9. In the Actions tab we need to delete the ANY method and create a new POST method
10. Keep the default Integration type (Lambda function), select your Lambda function from the autocomplete input in the form and save
11. Click on Test, put the json signature from above in the Request Body and click on the Test button bellow; you should get the same response as from the Lambda function
12. From the Actions we will deploy our API; for this we need to create a new Stage
13. Now we should have a Invoke URL but the get the specific endpoint we need to select the POST method from the Stages area
14. Test the invoke URL in Postman by creating a new POST request; in the Body section select raw and paste the json signature
15. Everything should be set up properly at this point 