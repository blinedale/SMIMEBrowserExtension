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

export const emailWithValidSignatureAndExpiredCertificate =
  `Return-Path: <alessandro.avagliano@rocket-internet.de>
Received: from [10.32.61.146] ([89.27.170.16])
        by smtp.gmail.com with ESMTPSA id q140sm1571810wmd.3.2017.09.19.06.56.32
        (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);
        Tue, 19 Sep 2017 06:56:32 -0700 (PDT)
From: Alessandro Avagliano <alessandro.avagliano@rocket-internet.de>
Content-Type: multipart/signed;
 boundary="Apple-Mail=_8DB6DB39-91D6-49A9-8D73-6939D4E2BACD";
 protocol="application/pkcs7-signature"; micalg=sha1
Mime-Version: 1.0 (Mac OS X Mail 10.3 \\(3273\\))
Date: Tue, 19 Sep 2017 15:56:31 +0200
Subject: Test s/mime
Message-Id: <790C9AB0-3176-4C17-BE68-16FFB8032DBE@rocket-internet.de>
To: =?utf-8?Q?Eric_Nordeb=C3=A4ck?= <eric.nordebaeck@rocket-internet.com>
X-Mailer: Apple Mail (2.3273)


--Apple-Mail=_8DB6DB39-91D6-49A9-8D73-6939D4E2BACD
Content-Type: multipart/alternative;
	boundary="Apple-Mail=_8F99B4DC-478A-4E38-9EF2-C99BBAF685A1"


--Apple-Mail=_8F99B4DC-478A-4E38-9EF2-C99BBAF685A1
Content-Transfer-Encoding: quoted-printable
Content-Type: text/plain;
	charset=utf-8

test


=E2=80=94
Alessandro Avagliano
Director Security, CISSP




=20
Rocket Internet SE
Charlottenstra=C3=9Fe 4 | 10969 Berlin | Germany
Skype: avagliano.alessandro
Mobile: +49 162 2122331
Email: alessandro.avagliano@rocket-internet.de=20
=20
Management Board: Oliver Samwer (CEO), Peter Kimpel, Alexander Kudlich=20=

Chairman of the Supervisory Board: Prof. Dr. Marcus Englert
Registration Court: Amtsgericht Charlottenburg, Registration No.: HRB =
165662 B


--Apple-Mail=_8F99B4DC-478A-4E38-9EF2-C99BBAF685A1
Content-Type: multipart/related;
	type="text/html";
	boundary="Apple-Mail=_D32E4217-4D9C-44DD-847D-B30A2F1F1249"


--Apple-Mail=_D32E4217-4D9C-44DD-847D-B30A2F1F1249
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html;
	charset=utf-8

<html><head><meta http-equiv=3D"Content-Type" content=3D"text/html =
charset=3Dutf-8"></head><body style=3D"word-wrap: break-word; =
-webkit-nbsp-mode: space; -webkit-line-break: =
after-white-space;">test<div class=3D""><br class=3D""></div><div =
class=3D""><br class=3D""><div class=3D"">=E2=80=94<br =
class=3D"">Alessandro Avagliano<br class=3D"">Director Security, =
CISSP<br class=3D""><br class=3D""><span><img apple-inline=3D"yes" =
id=3D"F5E17EDC-ABC2-4374-B681-33B3265DD792" =
src=3D"cid:187F50F0-8E27-4BEC-B196-43F8DC137BF9@rkt.global" =
class=3D""></span><br class=3D""><br class=3D""><br class=3D"">&nbsp;<br =
class=3D"">Rocket Internet SE<br class=3D"">Charlottenstra=C3=9Fe 4 | =
10969 Berlin | Germany<br class=3D"">Skype: avagliano.alessandro<br =
class=3D"">Mobile: +49 162 2122331<br class=3D"">Email: <a =
href=3D"mailto:alessandro.avagliano@rocket-internet.de" =
class=3D"">alessandro.avagliano@rocket-internet.de</a>&nbsp;<br =
class=3D"">&nbsp;<br class=3D"">Management Board: Oliver Samwer (CEO), =
Peter Kimpel, Alexander Kudlich&nbsp;<br class=3D"">Chairman of the =
Supervisory Board: Prof. Dr. Marcus Englert<br class=3D"">Registration =
Court: Amtsgericht Charlottenburg, Registration No.: HRB 165662 =
B</div><br class=3D""></div></body></html>=

--Apple-Mail=_D32E4217-4D9C-44DD-847D-B30A2F1F1249
Content-Transfer-Encoding: base64
Content-Disposition: inline;
	filename=image001.png
Content-Type: image/png;
	x-unix-mode=0666;
	name="image001.png"
Content-Id: <187F50F0-8E27-4BEC-B196-43F8DC137BF9@rkt.global>

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
--Apple-Mail=_D32E4217-4D9C-44DD-847D-B30A2F1F1249--

--Apple-Mail=_8F99B4DC-478A-4E38-9EF2-C99BBAF685A1--

--Apple-Mail=_8DB6DB39-91D6-49A9-8D73-6939D4E2BACD
Content-Disposition: attachment;
	filename=smime.p7s
Content-Type: application/pkcs7-signature;
	name=smime.p7s
Content-Transfer-Encoding: base64

MIAGCSqGSIb3DQEHAqCAMIACAQExCzAJBgUrDgMCGgUAMIAGCSqGSIb3DQEHAQAAoIIKHTCCBK8w
ggOXoAMCAQICEQDgI8sVEoNTia1hbnpUZ2shMA0GCSqGSIb3DQEBCwUAMG8xCzAJBgNVBAYTAlNF
MRQwEgYDVQQKEwtBZGRUcnVzdCBBQjEmMCQGA1UECxMdQWRkVHJ1c3QgRXh0ZXJuYWwgVFRQIE5l
dHdvcmsxIjAgBgNVBAMTGUFkZFRydXN0IEV4dGVybmFsIENBIFJvb3QwHhcNMTQxMjIyMDAwMDAw
WhcNMjAwNTMwMTA0ODM4WjCBmzELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hl
c3RlcjEQMA4GA1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxQTA/BgNV
BAMTOENPTU9ETyBTSEEtMjU2IENsaWVudCBBdXRoZW50aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWls
IENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAibEN2npTGU5wUh28VqYGJre4SeCW
51Gr8fBaE0kVo7SMG2C8elFCp3mMpCLfF2FOkdV2IwoU00oCf7YdCYBupQQ92bq7Fv6hh6kuQ1JD
FnyvMlDIpk9a6QjYz5MlnHuI6DBk5qT4VoD9KiQUMxeZrETlaYujRgZLwjPU6UCfBrCxrJNAubUI
kzqcKlOjENs9IGE8VQOO2U52JQIhKfqjfHF2T+7hX4Hp+1SA28N7NVK3hN4iPSwwLTF/Wb1SN7Az
aS1D6/rWpfGXd2dRjNnuJ+u8pQc4doykqTj/34z1A6xJvsr3c5k6DzKrnJU6Ez0ORjpXdGFQvsZA
P8vk4p+iIQIDAQABo4IBFzCCARMwHwYDVR0jBBgwFoAUrb2YejS0Jvf6xCZU7wO94CTLVBowHQYD
VR0OBBYEFJJha4LhoqCqT+xn8cKj97SAAMHsMA4GA1UdDwEB/wQEAwIBhjASBgNVHRMBAf8ECDAG
AQH/AgEAMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDARBgNVHSAECjAIMAYGBFUdIAAw
RAYDVR0fBD0wOzA5oDegNYYzaHR0cDovL2NybC51c2VydHJ1c3QuY29tL0FkZFRydXN0RXh0ZXJu
YWxDQVJvb3QuY3JsMDUGCCsGAQUFBwEBBCkwJzAlBggrBgEFBQcwAYYZaHR0cDovL29jc3AudXNl
cnRydXN0LmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAGypurFXBOquIxdjtzVXzqmthK8AJECOZD8Vm
am+x9bS1d14PAmEA330F/hKzpICAAPz7HVtqcgIKQbwFusFY1SbC6tVNhPv+gpjPWBvjImOcUvi7
BTarfVil3qs7Y+Xa1XPv7OD7e+Kj//BCI5zKto1NPuRLGAOyqC3U2LtCS5BphRDbpjc06HvgARCl
nMo6x59PiDRuimXQGoq7qdzKyjbR9PzCZCk1r9axp3ER0gNDsY8+muyeMlP0dpLKhjQHuSzK5hxK
2JkNwYbikJL7WkJqIyEQ6WXH9dW7fuqMhSACYurROgcsWcWZM/I4ieW26RZ6H3kU9koQGib6fIr7
mzCCBWYwggROoAMCAQICEQCTz2lPkEGVshRmWxCQDmzRMA0GCSqGSIb3DQEBCwUAMIGbMQswCQYD
VQQGEwJHQjEbMBkGA1UECBMSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYDVQQHEwdTYWxmb3JkMRow
GAYDVQQKExFDT01PRE8gQ0EgTGltaXRlZDFBMD8GA1UEAxM4Q09NT0RPIFNIQS0yNTYgQ2xpZW50
IEF1dGhlbnRpY2F0aW9uIGFuZCBTZWN1cmUgRW1haWwgQ0EwHhcNMTYxMjAyMDAwMDAwWhcNMTcx
MjAyMjM1OTU5WjA4MTYwNAYJKoZIhvcNAQkBFidhbGVzc2FuZHJvLmF2YWdsaWFub0Byb2NrZXQt
aW50ZXJuZXQuZGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2GDq2on4Jy44w504X
4qvPddb4zIetNfa1dx3TcWTHGcGf7+hTTVcenQbHW2C5TPcY/3Y/A0YrF6V6pNEPU7EW91faGH/b
7nz+B404GK9xEdkhhK1GNzodC2iiFFROKV+mgwuQkJca9Cpi127/Ax23pavAdv1P/HKqiYeGeRCh
fBKsJWaFCnAvTPx+2MSAj6rMt3DfH0/n38dzazIZuI50Xnd4eAnz6jhnEdai8MFiQpQ61rKuueSz
xXj+MX/ykeLWlXjI9SHDiL8UONTl/VgM8tPHp7ZXSp20q3/dT7m/M7D2UTrPNT0HbRf/pdaAkgYk
eriMcgQsKr7BI4vTaRHhAgMBAAGjggIFMIICATAfBgNVHSMEGDAWgBSSYWuC4aKgqk/sZ/HCo/e0
gADB7DAdBgNVHQ4EFgQU6k2AsCDcpeLLe5KQ3Ou9ToomDb8wDgYDVR0PAQH/BAQDAgWgMAwGA1Ud
EwEB/wQCMAAwIAYDVR0lBBkwFwYIKwYBBQUHAwQGCysGAQQBsjEBAwUCMBEGCWCGSAGG+EIBAQQE
AwIFIDBGBgNVHSAEPzA9MDsGDCsGAQQBsjEBAgEBATArMCkGCCsGAQUFBwIBFh1odHRwczovL3Nl
Y3VyZS5jb21vZG8ubmV0L0NQUzBdBgNVHR8EVjBUMFKgUKBOhkxodHRwOi8vY3JsLmNvbW9kb2Nh
LmNvbS9DT01PRE9TSEEyNTZDbGllbnRBdXRoZW50aWNhdGlvbmFuZFNlY3VyZUVtYWlsQ0EuY3Js
MIGQBggrBgEFBQcBAQSBgzCBgDBYBggrBgEFBQcwAoZMaHR0cDovL2NydC5jb21vZG9jYS5jb20v
Q09NT0RPU0hBMjU2Q2xpZW50QXV0aGVudGljYXRpb25hbmRTZWN1cmVFbWFpbENBLmNydDAkBggr
BgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2RvY2EuY29tMDIGA1UdEQQrMCmBJ2FsZXNzYW5kcm8u
YXZhZ2xpYW5vQHJvY2tldC1pbnRlcm5ldC5kZTANBgkqhkiG9w0BAQsFAAOCAQEAZMhbdsZWiTjw
H8tfW0e3h0hJRrbWp6Q7oFsn2ZkeSyVWyoSNtptZXUMLGVMjneKHt+uNoL3IbQpouK9Lvfl3Hmxo
fKAN4SreKYSqhE104yUY4HEIc5LDD/Y49K57Qsu3gLACRXnBSF5Dt4NFaLThp7FoaohiD4SXdGGC
/cVwzK/rdjWmCuZtTp9qSclYoyh/tOj0b1snVAv3Mu7CSGfVrlw4mrVTEK2exGqwe+X+hIWYPHZ4
eUPSKNCoNAA0POXXEul5+UHc2LrC50CPOeK0Fn1RROth09lVNl6hmJ6pT4PkChSSNWc5+6dd4AK1
g6mdBwJv7ym0mD8dZIuYMUW+tzGCA8YwggPCAgEBMIGxMIGbMQswCQYDVQQGEwJHQjEbMBkGA1UE
CBMSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYDVQQHEwdTYWxmb3JkMRowGAYDVQQKExFDT01PRE8g
Q0EgTGltaXRlZDFBMD8GA1UEAxM4Q09NT0RPIFNIQS0yNTYgQ2xpZW50IEF1dGhlbnRpY2F0aW9u
IGFuZCBTZWN1cmUgRW1haWwgQ0ECEQCTz2lPkEGVshRmWxCQDmzRMAkGBSsOAwIaBQCgggHpMBgG
CSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE3MDkxOTEzNTYzMlowIwYJ
KoZIhvcNAQkEMRYEFH6uxs4oOSG4eZ4josIxVJv7dB4uMIHCBgkrBgEEAYI3EAQxgbQwgbEwgZsx
CzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZv
cmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMUEwPwYDVQQDEzhDT01PRE8gU0hBLTI1NiBD
bGllbnQgQXV0aGVudGljYXRpb24gYW5kIFNlY3VyZSBFbWFpbCBDQQIRAJPPaU+QQZWyFGZbEJAO
bNEwgcQGCyqGSIb3DQEJEAILMYG0oIGxMIGbMQswCQYDVQQGEwJHQjEbMBkGA1UECBMSR3JlYXRl
ciBNYW5jaGVzdGVyMRAwDgYDVQQHEwdTYWxmb3JkMRowGAYDVQQKExFDT01PRE8gQ0EgTGltaXRl
ZDFBMD8GA1UEAxM4Q09NT0RPIFNIQS0yNTYgQ2xpZW50IEF1dGhlbnRpY2F0aW9uIGFuZCBTZWN1
cmUgRW1haWwgQ0ECEQCTz2lPkEGVshRmWxCQDmzRMA0GCSqGSIb3DQEBAQUABIIBAGkrXOOnBGfT
r+UuCC3tA5vd8Kfk+3xRqmaIDupSfhbotSrIFiZDACIpWIbYe8XRCTlV1EDwNKqkPdHIbg7bnLr9
d7/17oOIJ0jm4f2i5Z3CjwyrF7wgEehgzlABhGwUBQe+DgaJuCG9CqbByRoaxB2w7QnJgOKbX013
eYyAnvVZ9MmrvzAyH3Q0iMqT32OAu+4vbne2wviwqdTmmjYLf30auNsgCVmYU8A6tEF97hJ9LXFp
kSwrpAcKCfoNFWO2rUTQjjUmSGDEcVUgkku4LWS5Wx0fR3UfVY302jm/kxqwAcEo0FHh0jjacCQG
/VQ6GVh/8cf099LJpgNHYSd9vmoAAAAAAAA=
--Apple-Mail=_8DB6DB39-91D6-49A9-8D73-6939D4E2BACD--`;

export const emailWithValidEverything = 
`Return-Path: <eric.nordebaeck@rocket-internet.com>
Received: from ?IPv6:2001:67c:27ac:440::1:5f01? ([2001:67c:27ac:440::1:5f01])
        by smtp.gmail.com with ESMTPSA id d5sm16815309edj.65.2017.11.28.02.39.17
        for <alessandro.avagliano@rocket-internet.de>
        (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);
        Tue, 28 Nov 2017 02:39:17 -0800 (PST)
To: alessandro.avagliano@rocket-internet.de
From: =?UTF-8?Q?Eric_Nordeb=c3=a4ck?= <eric.nordebaeck@rocket-internet.com>
Subject: signed with s/mime!
Message-ID: <b8a3d85e-8368-6327-4b07-6507e46158e5@rocket-internet.com>
Date: Tue, 28 Nov 2017 11:39:16 +0100
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101
 Thunderbird/52.4.0
MIME-Version: 1.0
Content-Type: multipart/signed; protocol="application/pkcs7-signature"; micalg=sha-256; boundary="------------ms060704060804060802090206"

This is a cryptographically signed message in MIME format.

--------------ms060704060804060802090206
Content-Type: text/plain; charset=utf-8; format=flowed
Content-Transfer-Encoding: quoted-printable
Content-Language: en-US

Buongiorno



--------------ms060704060804060802090206
Content-Type: application/pkcs7-signature; name="smime.p7s"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="smime.p7s"
Content-Description: S/MIME Cryptographic Signature

MIAGCSqGSIb3DQEHAqCAMIACAQExDzANBglghkgBZQMEAgEFADCABgkqhkiG9w0BBwEAAKCC
C0AwggVSMIIEOqADAgECAhEAwLMShHGY3WvfV3u2UgwQJDANBgkqhkiG9w0BAQsFADCBlzEL
MAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UEBxMHU2Fs
Zm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxPTA7BgNVBAMTNENPTU9ETyBSU0Eg
Q2xpZW50IEF1dGhlbnRpY2F0aW9uIGFuZCBTZWN1cmUgRW1haWwgQ0EwHhcNMTcwOTI4MDAw
MDAwWhcNMTgwOTI4MjM1OTU5WjA0MTIwMAYJKoZIhvcNAQkBFiNlcmljLm5vcmRlYmFlY2tA
cm9ja2V0LWludGVybmV0LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALa3
lMnfIGu9iGoPgfKSvF81Bg7UHF0dRILy5mPFIJXtzUb13wv0uLJ9hliFYiAqkWkvkz7zlIh0
GFL7PajPMDUPb5sMGoSb9ivVsWLm8lbuVRth2uyC6gDuLI2/sZPrwc2Q28xIYEjE69K48kqz
3iVYIaaKQU2HmK0neyN+LRTf+h6hPXRE6UzyBYdbNRbPYZIj35hLj84q3yPk42/MK47i5zo1
YMD7+t9/9NBUds7wrHbhh+q5NIhSUqQHvX6Z/tPMmvvGHN6ucCAmVJotAcJiImgFT9uY5aaG
aR+OUGXvrmLOX82IyIvqS4wvG0XMQh2FR6XznT+hvYGCP7THGC0CAwEAAaOCAfkwggH1MB8G
A1UdIwQYMBaAFIKvbIz4xf6WYXzoHz0rcUhexIvAMB0GA1UdDgQWBBQ+t/HdxAGAtF0j8fgs
zcPmem3sMDAOBgNVHQ8BAf8EBAMCBaAwDAYDVR0TAQH/BAIwADAgBgNVHSUEGTAXBggrBgEF
BQcDBAYLKwYBBAGyMQEDBQIwEQYJYIZIAYb4QgEBBAQDAgUgMEYGA1UdIAQ/MD0wOwYMKwYB
BAGyMQECAQEBMCswKQYIKwYBBQUHAgEWHWh0dHBzOi8vc2VjdXJlLmNvbW9kby5uZXQvQ1BT
MFoGA1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwuY29tb2RvY2EuY29tL0NPTU9ET1JTQUNs
aWVudEF1dGhlbnRpY2F0aW9uYW5kU2VjdXJlRW1haWxDQS5jcmwwgYsGCCsGAQUFBwEBBH8w
fTBVBggrBgEFBQcwAoZJaHR0cDovL2NydC5jb21vZG9jYS5jb20vQ09NT0RPUlNBQ2xpZW50
QXV0aGVudGljYXRpb25hbmRTZWN1cmVFbWFpbENBLmNydDAkBggrBgEFBQcwAYYYaHR0cDov
L29jc3AuY29tb2RvY2EuY29tMC4GA1UdEQQnMCWBI2VyaWMubm9yZGViYWVja0Byb2NrZXQt
aW50ZXJuZXQuY29tMA0GCSqGSIb3DQEBCwUAA4IBAQBVUlGo3P4bE7RBNkzAoEoY9E9bTkEF
RxM+N/mIYJZYZbYumlnpK9CaG7h4qPPCH1BD6rBNramovPO5eypBh/BaEEh3p8nCOwv4h5r7
ZhGuJkYj2zeUaGVpFTysQqXaIPcK+eM3hWGST5wxt1VGwrl6AzOS2p2k/WKxzpPPxYAddYkT
HYpQcvgdpBo5/CpYkKbONUekKuGwRQqIWWgEVjKKqp8xfZgO7SgB7LzddjUc3OIEKn8N6Ve5
PlSV4l8HIRnwR6rv6sGilnTAxChcvNXyAY01DBjH7XLdhKvquLa3B5FYqliHOTWe/Fr3YyDX
H425+aTSg3pbl1a2JWbtVEX0MIIF5jCCA86gAwIBAgIQapvhODv/K2ufAdXZuKdSVjANBgkq
hkiG9w0BAQwFADCBhTELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3Rl
cjEQMA4GA1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxKzApBgNV
BAMTIkNPTU9ETyBSU0EgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMTMwMTEwMDAwMDAw
WhcNMjgwMTA5MjM1OTU5WjCBlzELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFu
Y2hlc3RlcjEQMA4GA1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQx
PTA7BgNVBAMTNENPTU9ETyBSU0EgQ2xpZW50IEF1dGhlbnRpY2F0aW9uIGFuZCBTZWN1cmUg
RW1haWwgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC+s55XrCh2dUAWxzgD
mNPGGHYhUPMleQtMtaDRfTpYPpynMS6n9jR22YRq2tA9NEjk6vW7rN/5sYFLIP1of3l0NKZ6
fLWfF2VgJ5cijKYy/qlAckY1wgOkUMgzKlWlVJGyK+UlNEQ1/5ErCsHq9x9aU/x1KwTdF/LC
rT03Rl/FwFrf1XTCwa2QZYL55AqLPikFlgqOtzk06kb2qvGlnHJvijjI03BOrNpo+kZGpcHs
gyO1/u1OZTaOo8wvEU17VVeP1cHWse9tGKTDyUGg2hJZjrqck39UIm/nKbpDSZ0JsMoIw/Jt
OOg0JC56VzQgBo7ictReTQE5LFLG3yQK+xS1AgMBAAGjggE8MIIBODAfBgNVHSMEGDAWgBS7
r34CPfqm8TyEjq3uOJjs2TIy1DAdBgNVHQ4EFgQUgq9sjPjF/pZhfOgfPStxSF7Ei8AwDgYD
VR0PAQH/BAQDAgGGMBIGA1UdEwEB/wQIMAYBAf8CAQAwEQYDVR0gBAowCDAGBgRVHSAAMEwG
A1UdHwRFMEMwQaA/oD2GO2h0dHA6Ly9jcmwuY29tb2RvY2EuY29tL0NPTU9ET1JTQUNlcnRp
ZmljYXRpb25BdXRob3JpdHkuY3JsMHEGCCsGAQUFBwEBBGUwYzA7BggrBgEFBQcwAoYvaHR0
cDovL2NydC5jb21vZG9jYS5jb20vQ09NT0RPUlNBQWRkVHJ1c3RDQS5jcnQwJAYIKwYBBQUH
MAGGGGh0dHA6Ly9vY3NwLmNvbW9kb2NhLmNvbTANBgkqhkiG9w0BAQwFAAOCAgEAeFyygSg0
TzzuX1bOn5dW7I+iaxf28/ZJCAbU2C81zd9A/tNx4+jsQgwRGiHjZrAYayZrrm78hOx7aEpk
fNPQIHGG6Fvq3EzWf/Lvx7/hk6zSPwIal9v5IkDcZoFD7f3iT7PdkHJY9B51csvU50rxpEg1
OyOT8fk2zvvPBuM4qQNqbGWlnhMpIMwpWZT89RY0wpJO+2V6eXEGGHsROs3njeP9DqqqAJaB
a4wBeKOdGCWn1/Jp2oY6dyNmNppI4ZNMUH4Tam85S1j6E95u4+1Nuru84OrMIzqvISE2HN/5
6ebTOWlcrurffade2022O/tUU1gb4jfWCcyvB8czm12FgX/y/lRjmDbEA08QJNB2729Y+io1
IYO3ztveBdvUCIYZojTq/OCR6MvnzS6X72HP0PRLRTiOSEmIDsS5N5w/8IW1Hva5hEFy6fDA
fd9yI+O+IMMAj1KcL/Zo9jzJ16HO5m60ttl1Enk8MQkz/W3JlHaeI5iKFn4UJu1/cP2YHXYP
iWf2JyBzsLBrGk1II+3yL8aorYew6CQvdVifC3HtwlSam9V1niiCfOBe2C12TdKGu05LWIA3
ZkFcWJGaNXOZ6Ggyh/TqvXG5v7zmEVDNXFnHn9tFpMpOUvxhcsjycBtH0dZ0WrNw6gH+HF8T
IhCnH3+zzWuDN0Rk6h9KVkfKehIxggQ4MIIENAIBATCBrTCBlzELMAkGA1UEBhMCR0IxGzAZ
BgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UEBxMHU2FsZm9yZDEaMBgGA1UEChMR
Q09NT0RPIENBIExpbWl0ZWQxPTA7BgNVBAMTNENPTU9ETyBSU0EgQ2xpZW50IEF1dGhlbnRp
Y2F0aW9uIGFuZCBTZWN1cmUgRW1haWwgQ0ECEQDAsxKEcZjda99Xe7ZSDBAkMA0GCWCGSAFl
AwQCAQUAoIICWzAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0x
NzExMjgxMDM5MTZaMC8GCSqGSIb3DQEJBDEiBCB0/9LWR7AKqgVSROU7oUoG8lTdl/e/ALPj
oN71y3Ja6TBsBgkqhkiG9w0BCQ8xXzBdMAsGCWCGSAFlAwQBKjALBglghkgBZQMEAQIwCgYI
KoZIhvcNAwcwDgYIKoZIhvcNAwICAgCAMA0GCCqGSIb3DQMCAgFAMAcGBSsOAwIHMA0GCCqG
SIb3DQMCAgEoMIG+BgkrBgEEAYI3EAQxgbAwga0wgZcxCzAJBgNVBAYTAkdCMRswGQYDVQQI
ExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9E
TyBDQSBMaW1pdGVkMT0wOwYDVQQDEzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50aWNhdGlv
biBhbmQgU2VjdXJlIEVtYWlsIENBAhEAwLMShHGY3WvfV3u2UgwQJDCBwAYLKoZIhvcNAQkQ
AgsxgbCgga0wgZcxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIx
EDAOBgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMT0wOwYDVQQD
EzRDT01PRE8gUlNBIENsaWVudCBBdXRoZW50aWNhdGlvbiBhbmQgU2VjdXJlIEVtYWlsIENB
AhEAwLMShHGY3WvfV3u2UgwQJDANBgkqhkiG9w0BAQEFAASCAQCnK2U4lIhDI17CpT6V85Cy
gkV/Bqca+0EoJ7L7NzE+pGAH0Y8vgsZw9qxB00nZ/SywTTfSoBMNoA7IXdTQqr5IveePWBF/
uaMX0+/Do+saYclExZ1vZDrs4NngIyJbeQIWC1j2lg7UE6r20Kr1K5+2a7BdYACrp/owEQ4A
zZavBHZRybt3oPhdwBhfNM7uJoJQIjYMZOYAKqotg2GTKxYjEPgkHwSC6jtRvXJcCjYYZOEb
/gu9n+WGcuGJnBOdi8vy7wcAEl5I8wYz1eALtn72S2Bq+7Hqp+2Vh59BZOMk3CRY0iZH/fja
hqT3uGu4QCym7vcn2S7KEQ2WLLL16p2ZAAAAAAAA
--------------ms060704060804060802090206--
`