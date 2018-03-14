const translations = {
  en: {
    messageIsValid: `The signature is valid for the sender and the message content has not been tampered with.`,
    fromEmailDoesNotMatchSignature: `The "From" email address does not match the signature's email address.`,
    cannotVerifyOrigin: `The signature's certificate is not from a trusted origin. Be wary of message content.`,
    verificationFailed: `Signature verification failed. Be wary of message content.`,
    certificateExpired: `The signature's certificate has expired. Be wary of message content.`,
    invalidSignature: `Invalid digital signature. Be wary of message content.`,
    messageNotSigned: `Message is not digitally signed.`
  }
};

export default translations;
