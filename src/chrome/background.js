console.log('yo dawg');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.crlDistPoint) {

      const xhr = new XMLHttpRequest(request.crlDistPoint);

      xhr.open('GET', request.crlDistPoint, false);
      xhr.send(null);
      console.log('Fetched CRL');
      console.log(xhr.responseText);

      sendResponse({rawCrlBag: xhr.responseText});
    }
  }
);
