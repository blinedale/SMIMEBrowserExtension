import {Certificate} from "pkijs";
import {stringToArrayBuffer} from "pvutils";
import * as asn1js from "asn1js";

class CertificateParser {
  constructor(base64lib) {
    this.base64lib = base64lib;
  }

  /**
   * @param {string} rawPEMtext
   * @returns {Certificate}
   */
  parseCertificate(rawPEMtext) {
    const cleanedPEMdata = rawPEMtext.replace(/((')?-----(BEGIN|END)( NEW)? CERTIFICATE-----(')?|\n)/g, "").replace(/\n/g, "\r\n");

    const certificateBuffer = stringToArrayBuffer(this.base64lib.atob(cleanedPEMdata));

    const asn1ParsedCertificate = asn1js.fromBER(certificateBuffer);

    if (asn1ParsedCertificate.offset === (-1)) {
      console.error("S/MIME error: Cert could not be parsed by the ASN.1 library.");
      return null;
    }

    return new Certificate({schema: asn1ParsedCertificate.result});
  }
}

export default CertificateParser;
