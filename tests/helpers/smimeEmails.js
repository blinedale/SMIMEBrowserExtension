export const emailWithAsn1CompliantButInvalidSignature =
    `Content-Type: multipart/signed; protocol="application/pkcs7-signature";
 micalg=sha-256;
 boundary="----sinikael-?=_1-15083366905990.007444371297662622"
From: Test Dude <eric.nordebaeck@rocket-internet.com>
To: testperson@test.com
Subject: s/mime test
Date: Wed, 18 Oct 2017 14:24:50 +0000
Message-Id: <1508336690682-5bfa3e6f-3bccd001-7c7323b5@rocket-internet.com>
MIME-Version: 1.0

------sinikael-?=_1-15083366905990.007444371297662622
Content-Type: multipart/alternative;
 boundary="----sinikael-?=_2-15083366905990.007444371297662622"

------sinikael-?=_2-15083366905990.007444371297662622
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

test email! cool stuff
------sinikael-?=_2-15083366905990.007444371297662622
Content-Type: multipart/related; type="text/html";
 boundary="----sinikael-?=_4-15083366905990.007444371297662622"

------sinikael-?=_4-15083366905990.007444371297662622
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

<html><body>some html content</body></html>
------sinikael-?=_4-15083366905990.007444371297662622--

------sinikael-?=_2-15083366905990.007444371297662622--

------sinikael-?=_1-15083366905990.007444371297662622
Content-Type: application/pkcs7-signature; name=smime.p7s
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename=smime.p7s

A4IBAQBRJSdtHIuMTxC7iuscG8OZ26WBYVg0EfSOY93/TE7pHjO1JOzw0hHsm5OzmT90iYf8vaL2
yqTlgr2meIa/Wnes0AGLhqpeFqFoctSsNOpLxvjy8jCNt58RrqRfJOFxA+uHr9uBlUQ9pIE/lqxx
kE8wDQacW9TgqxIalyROutLpuh8sfDfjkoO/TQ/ZnxRdGil0IjUY1bVgHbjIep+witnZo68fJKNF
v/XyRxIAH0dPvXjHevLNfoeBEdYOAh1xZTEr/4+0j1YQYQW7at8Ua1kjPEOeHtQCEI05GbgTO4Ln
9NtBsNR6Hf2Fs6HiP8VaCHHy0veIXDgNU5qZuxEVQjAF
------sinikael-?=_1-15083366905990.007444371297662622--`;

export const emailWithValidSignatureAndIncorrectFromAddress =
    `Received: from 1063653472007
	named unknown
	by gmailapi.google.com
	with HTTPREST;
	Mon, 16 Oct 2017 08:52:16 -0700
Content-Type: multipart/signed; protocol="application/pkcs7-signature";
 micalg=sha-256;
 boundary="----sinikael-?=_1-15081691367520.5115814348686745"
From: sometestdude@test.com
To: someothertestdude@test.com
Subject: s/mime test - self-signed final test
Date: Mon, 16 Oct 2017 08:52:16 -0700
Message-Id: <CACGq00mpRHa__7X0i8GXjrYGt40xdMC7TXjckxquiD0Cz81=Ww@mail.gmail.com>
MIME-Version: 1.0

------sinikael-?=_1-15081691367520.5115814348686745
Content-Type: multipart/alternative;
 boundary="----sinikael-?=_2-15081691367520.5115814348686745"

------sinikael-?=_2-15081691367520.5115814348686745
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

test email! cool stuff
------sinikael-?=_2-15081691367520.5115814348686745
Content-Type: multipart/related; type="text/html";
 boundary="----sinikael-?=_4-15081691367520.5115814348686745"

------sinikael-?=_4-15081691367520.5115814348686745
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

<html><body>test html email with<br>line break and <b>bold text</b>. =
Revolutionary.</body></html>
------sinikael-?=_4-15081691367520.5115814348686745--

------sinikael-?=_2-15081691367520.5115814348686745--

------sinikael-?=_1-15081691367520.5115814348686745
Content-Type: application/pkcs7-signature; name=smime.p7s
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename=smime.p7s

MIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADALBgkqhkiG9w0BBwGgggVWMIIF
UjCCBDqgAwIBAgIRAMCzEoRxmN1r31d7tlIMECQwDQYJKoZIhvcNAQELBQAwgZcxCzAJBgNVBAYT
AkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNV
BAoTEUNPTU9ETyBDQSBMaW1pdGVkMT0wOwYDVQQDEzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50
aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWlsIENBMB4XDTE3MDkyODAwMDAwMFoXDTE4MDkyODIzNTk1
OVowNDEyMDAGCSqGSIb3DQEJARYjZXJpYy5ub3JkZWJhZWNrQHJvY2tldC1pbnRlcm5ldC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2t5TJ3yBrvYhqD4HykrxfNQYO1BxdHUSC
8uZjxSCV7c1G9d8L9LiyfYZYhWIgKpFpL5M+85SIdBhS+z2ozzA1D2+bDBqEm/Yr1bFi5vJW7lUb
YdrsguoA7iyNv7GT68HNkNvMSGBIxOvSuPJKs94lWCGmikFNh5itJ3sjfi0U3/oeoT10ROlM8gWH
WzUWz2GSI9+YS4/OKt8j5ONvzCuO4uc6NWDA+/rff/TQVHbO8Kx24YfquTSIUlKkB71+mf7TzJr7
xhzernAgJlSaLQHCYiJoBU/bmOWmhmkfjlBl765izl/NiMiL6kuMLxtFzEIdhUel850/ob2Bgj+0
xxgtAgMBAAGjggH5MIIB9TAfBgNVHSMEGDAWgBSCr2yM+MX+lmF86B89K3FIXsSLwDAdBgNVHQ4E
FgQUPrfx3cQBgLRdI/H4LM3D5npt7DAwDgYDVR0PAQH/BAQDAgWgMAwGA1UdEwEB/wQCMAAwIAYD
VR0lBBkwFwYIKwYBBQUHAwQGCysGAQQBsjEBAwUCMBEGCWCGSAGG+EIBAQQEAwIFIDBGBgNVHSAE
PzA9MDsGDCsGAQQBsjEBAgEBATArMCkGCCsGAQUFBwIBFh1odHRwczovL3NlY3VyZS5jb21vZG8u
bmV0L0NQUzBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3JsLmNvbW9kb2NhLmNvbS9DT01PRE9S
U0FDbGllbnRBdXRoZW50aWNhdGlvbmFuZFNlY3VyZUVtYWlsQ0EuY3JsMIGLBggrBgEFBQcBAQR/
MH0wVQYIKwYBBQUHMAKGSWh0dHA6Ly9jcnQuY29tb2RvY2EuY29tL0NPTU9ET1JTQUNsaWVudEF1
dGhlbnRpY2F0aW9uYW5kU2VjdXJlRW1haWxDQS5jcnQwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3Nw
LmNvbW9kb2NhLmNvbTAuBgNVHREEJzAlgSNlcmljLm5vcmRlYmFlY2tAcm9ja2V0LWludGVybmV0
LmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAVVJRqNz+GxO0QTZMwKBKGPRPW05BBUcTPjf5iGCWWGW2
LppZ6SvQmhu4eKjzwh9QQ+qwTa2pqLzzuXsqQYfwWhBId6fJwjsL+Iea+2YRriZGI9s3lGhlaRU8
rEKl2iD3CvnjN4Vhkk+cMbdVRsK5egMzktqdpP1isc6Tz8WAHXWJEx2KUHL4HaQaOfwqWJCmzjVH
pCrhsEUKiFloBFYyiqqfMX2YDu0oAey83XY1HNziBCp/DelXuT5UleJfByEZ8Eeq7+rBopZ0wMQo
XLzV8gGNNQwYx+1y3YSr6ri2tweRWKpYhzk1nvxa92Mg1x+Nufmk0oN6W5dWtiVm7VRF9DGCAdcw
ggHTAgEBMIGtMIGXMQswCQYDVQQGEwJHQjEbMBkGA1UECBMSR3JlYXRlciBNYW5jaGVzdGVyMRAw
DgYDVQQHEwdTYWxmb3JkMRowGAYDVQQKExFDT01PRE8gQ0EgTGltaXRlZDE9MDsGA1UEAxM0Q09N
T0RPIFJTQSBDbGllbnQgQXV0aGVudGljYXRpb24gYW5kIFNlY3VyZSBFbWFpbCBDQQIRAMCzEoRx
mN1r31d7tlIMECQwDQYJYIZIAWUDBAIBBQAwCwYJKoZIhvcNAQELBIIBAIS20hDM8bBud2FNDKNi
zlFNTxML7HyX1Ekn0O5TSina7UmAn8j8mJwaVuUgOx2ApYKER6FkGAekmPJEHytYQ7tqcgM2e7pt
D2hBPgAykAPLOYM0h8GIpZbhRP0Syu+N/EgN8NjU01xhS9N9UOYRfbyF4i87hTyJHGqZwkMRHUZE
iGWJchTwdY1X5yCloFgfHwFimKwaL+VvFI9gdefU+f1PXL/vrj0r6PgODq4sO/czsL+3z5axDVwN
VUG6HJMB8FFEFEEYNWVTsFXcmuj6q0C8J0giO89Nd/5SVAArAQ7U4l7lDsLf7uF/8vaHdvHOGvrL
l134U0lqZxEHDzBfpL8AAAAAAAA=
------sinikael-?=_1-15081691367520.5115814348686745--`;


export const emailWithValidSignatureAndManipulatedMessage =
    `Received: from 1063653472007
	named unknown
	by gmailapi.google.com
	with HTTPREST;
	Mon, 16 Oct 2017 08:52:16 -0700
Content-Type: multipart/signed; protocol="application/pkcs7-signature";
 micalg=sha-256;
 boundary="----sinikael-?=_1-15081691367520.5115814348686745"
From: testdude@test.com
To: someothertestdude@test.com
Subject: s/mime test - self-signed final test
Date: Mon, 16 Oct 2017 08:52:16 -0700
Message-Id: <CACGq00mpRHa__7X0i8GXjrYGt40xdMC7TXjckxquiD0Cz81=Ww@mail.gmail.com>
MIME-Version: 1.0

------sinikael-?=_1-15081691367520.5115814348686745
Content-Type: multipart/alternative;
 boundary="----sinikael-?=_2-15081691367520.5115814348686745"

------sinikael-?=_2-15081691367520.5115814348686745
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: quoted-printable

test email! cool stuff! but it's been manipulated!
------sinikael-?=_2-15081691367520.5115814348686745
Content-Type: multipart/related; type="text/html";
 boundary="----sinikael-?=_4-15081691367520.5115814348686745"

------sinikael-?=_4-15081691367520.5115814348686745
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: quoted-printable

<html><body>test html email with<br>line break and <b>bold text</b>. =
Revolutionary. And edited by an impostor!</body></html>
------sinikael-?=_4-15081691367520.5115814348686745--

------sinikael-?=_2-15081691367520.5115814348686745--

------sinikael-?=_1-15081691367520.5115814348686745
Content-Type: application/pkcs7-signature; name=smime.p7s
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename=smime.p7s

MIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADALBgkqhkiG9w0BBwGgggVWMIIF
UjCCBDqgAwIBAgIRAMCzEoRxmN1r31d7tlIMECQwDQYJKoZIhvcNAQELBQAwgZcxCzAJBgNVBAYT
AkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNV
BAoTEUNPTU9ETyBDQSBMaW1pdGVkMT0wOwYDVQQDEzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50
aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWlsIENBMB4XDTE3MDkyODAwMDAwMFoXDTE4MDkyODIzNTk1
OVowNDEyMDAGCSqGSIb3DQEJARYjZXJpYy5ub3JkZWJhZWNrQHJvY2tldC1pbnRlcm5ldC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2t5TJ3yBrvYhqD4HykrxfNQYO1BxdHUSC
8uZjxSCV7c1G9d8L9LiyfYZYhWIgKpFpL5M+85SIdBhS+z2ozzA1D2+bDBqEm/Yr1bFi5vJW7lUb
YdrsguoA7iyNv7GT68HNkNvMSGBIxOvSuPJKs94lWCGmikFNh5itJ3sjfi0U3/oeoT10ROlM8gWH
WzUWz2GSI9+YS4/OKt8j5ONvzCuO4uc6NWDA+/rff/TQVHbO8Kx24YfquTSIUlKkB71+mf7TzJr7
xhzernAgJlSaLQHCYiJoBU/bmOWmhmkfjlBl765izl/NiMiL6kuMLxtFzEIdhUel850/ob2Bgj+0
xxgtAgMBAAGjggH5MIIB9TAfBgNVHSMEGDAWgBSCr2yM+MX+lmF86B89K3FIXsSLwDAdBgNVHQ4E
FgQUPrfx3cQBgLRdI/H4LM3D5npt7DAwDgYDVR0PAQH/BAQDAgWgMAwGA1UdEwEB/wQCMAAwIAYD
VR0lBBkwFwYIKwYBBQUHAwQGCysGAQQBsjEBAwUCMBEGCWCGSAGG+EIBAQQEAwIFIDBGBgNVHSAE
PzA9MDsGDCsGAQQBsjEBAgEBATArMCkGCCsGAQUFBwIBFh1odHRwczovL3NlY3VyZS5jb21vZG8u
bmV0L0NQUzBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3JsLmNvbW9kb2NhLmNvbS9DT01PRE9S
U0FDbGllbnRBdXRoZW50aWNhdGlvbmFuZFNlY3VyZUVtYWlsQ0EuY3JsMIGLBggrBgEFBQcBAQR/
MH0wVQYIKwYBBQUHMAKGSWh0dHA6Ly9jcnQuY29tb2RvY2EuY29tL0NPTU9ET1JTQUNsaWVudEF1
dGhlbnRpY2F0aW9uYW5kU2VjdXJlRW1haWxDQS5jcnQwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3Nw
LmNvbW9kb2NhLmNvbTAuBgNVHREEJzAlgSNlcmljLm5vcmRlYmFlY2tAcm9ja2V0LWludGVybmV0
LmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAVVJRqNz+GxO0QTZMwKBKGPRPW05BBUcTPjf5iGCWWGW2
LppZ6SvQmhu4eKjzwh9QQ+qwTa2pqLzzuXsqQYfwWhBId6fJwjsL+Iea+2YRriZGI9s3lGhlaRU8
rEKl2iD3CvnjN4Vhkk+cMbdVRsK5egMzktqdpP1isc6Tz8WAHXWJEx2KUHL4HaQaOfwqWJCmzjVH
pCrhsEUKiFloBFYyiqqfMX2YDu0oAey83XY1HNziBCp/DelXuT5UleJfByEZ8Eeq7+rBopZ0wMQo
XLzV8gGNNQwYx+1y3YSr6ri2tweRWKpYhzk1nvxa92Mg1x+Nufmk0oN6W5dWtiVm7VRF9DGCAdcw
ggHTAgEBMIGtMIGXMQswCQYDVQQGEwJHQjEbMBkGA1UECBMSR3JlYXRlciBNYW5jaGVzdGVyMRAw
DgYDVQQHEwdTYWxmb3JkMRowGAYDVQQKExFDT01PRE8gQ0EgTGltaXRlZDE9MDsGA1UEAxM0Q09N
T0RPIFJTQSBDbGllbnQgQXV0aGVudGljYXRpb24gYW5kIFNlY3VyZSBFbWFpbCBDQQIRAMCzEoRx
mN1r31d7tlIMECQwDQYJYIZIAWUDBAIBBQAwCwYJKoZIhvcNAQELBIIBAIS20hDM8bBud2FNDKNi
zlFNTxML7HyX1Ekn0O5TSina7UmAn8j8mJwaVuUgOx2ApYKER6FkGAekmPJEHytYQ7tqcgM2e7pt
D2hBPgAykAPLOYM0h8GIpZbhRP0Syu+N/EgN8NjU01xhS9N9UOYRfbyF4i87hTyJHGqZwkMRHUZE
iGWJchTwdY1X5yCloFgfHwFimKwaL+VvFI9gdefU+f1PXL/vrj0r6PgODq4sO/czsL+3z5axDVwN
VUG6HJMB8FFEFEEYNWVTsFXcmuj6q0C8J0giO89Nd/5SVAArAQ7U4l7lDsLf7uF/8vaHdvHOGvrL
l134U0lqZxEHDzBfpL8AAAAAAAA=
------sinikael-?=_1-15081691367520.5115814348686745--`;
