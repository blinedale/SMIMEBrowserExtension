class GmailSource {
  /**
   * Method heavily inspired by https://github.com/KartikTalwar/gmail.js by way of MIT License through Kartik Talwar.
   * @param messageId
   * @param preferBinary
   * @returns {Promise}
   */
  getRawMessage(messageId, preferBinary) {
    const timeStamp = Date.now();
    const url = `https://mail.google.com/mail${window.location.pathname}?view=att&th=${messageId}&attid=0&disp=comp&safe=1&zw&cacheCounter=${timeStamp}`;

    let responseType = "text";
    if (preferBinary) {
      responseType = "arraybuffer";
    }

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.withCredentials = true;
      request.open("GET", url, true);
      request.responseType = responseType;

      request.onreadystatechange = () => {
        if (request.readyState !== XMLHttpRequest.DONE) {
          return;
        }

        if (request.status >= 200 && request.status <= 302) {
          const result = request.response;
          if (result) {
            if (preferBinary) {
              const byteArray = new Uint8Array(result);
              resolve(byteArray);
            } else {
              resolve(result);
            }
          }
        }
      };
      request.onerror = ev => {
        console.log(ev);
        reject(ev);
      };

      request.send();
    });
  }
}

export default new GmailSource();
