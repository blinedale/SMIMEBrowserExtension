const smimeSpecificationConstants = {
  signatureNodeContentTypeValues: ["application/x-pkcs7-signature", "application/pkcs7-signature"],
  rootNodeContentTypeValue: "multipart/signed",
  rootNodeContentTypeProtocol: "application/pkcs7-signature",
  rootNodeContentTypeMessageIntegrityCheckAlgorithms: ["md5", "sha1", "sha-1", "sha-224", "sha-256", "sha-384", "sha-512", "unknown"],
  certificateTypeForSignerEmail: "1.2.840.113549.1.9.1",
  expirationDateMarginHours: 12,
};

export default smimeSpecificationConstants;
