class Config {
  constructor() {
    const urlToFetch = chrome.runtime.getURL('config.json');
    const xhr = new XMLHttpRequest(urlToFetch);
    xhr.overrideMimeType('text/plain'); // Needed for Firefox, otherwise it tries to parse the response as XML.
    xhr.open('GET', urlToFetch, false); // Need to call synchronously or it's too slow
    xhr.send(null);
    this.config = JSON.parse(xhr.responseText);
  }

  get(section) {
    return this.config[section];
  }
}

export default Config;
