import smimeVerificationResultCodes from '../constants/smimeVerificationResultCodes';

class MarkingService {
  constructor(tooltipService) {
    this.tooltip = tooltipService;
  }

  markResult(domMessage, result) {
    if (result.code === smimeVerificationResultCodes.CANNOT_VERIFY) {
      // No marking for CANNOT_VERIFY
      return;
    }

    const iconUrl = chrome.runtime.getURL(this.getIconPath(result));
    const infoText = this.getInfoText(result);

    if (this.isInbox()) { // inbox mode activated
      this.markForInbox(domMessage, result, iconUrl, infoText);
    } else { // gmail mode activated
      this.markForGmail(domMessage, result, iconUrl, infoText);
    }
    this.tooltip.addTooltip(result.message);
    this.overwriteGoogleWarning();
  }

  markForInbox(domMessage, result, iconUrl, infoText) {
    // From body element, find the header.
    // Last child of header is the date element.
    // Insert our stuff as children of header before the date element.

    const bodyElement = domMessage.getBodyElement();

    const bodyParent = bodyElement.parentElement;

    const headerElement = bodyParent.firstElementChild;

    const headerDateElement = headerElement.lastElementChild;

    const el = document.createElement('span');
    el.innerHTML = infoText;
    el.setAttribute('class', 'smime-sender-inbox');
    headerElement.insertBefore(el, headerDateElement);
    headerElement.insertBefore(this.createCustomIcon(iconUrl, result.message), headerDateElement);
  }

  markForGmail(domMessage, result, iconUrl, infoText) {
    const markedClassName = `smime-mark-${result.mailId}`;
    const iconClass = `${markedClassName} tooltip`;

    const messageAttachmentIconDescriptor = {
      iconUrl,
      iconClass
    };

    domMessage.addAttachmentIcon(messageAttachmentIconDescriptor);

    this.addInfoText(markedClassName, infoText, result.message);
  }

  overwriteGoogleWarning() {
    const trigger = document.querySelector("div[role='menuitem'] img");

    trigger.addEventListener('click', () => {
      const message = 'We can validate this signature just fine. Hugs from Rocket Internet SE.';
      const triggerText = `The signature uses an unsupported algorithm. The digital signature is not valid.`;
      const elem = document.querySelector('td.gL');

      if (elem == null) {
        return false;
      }

      const container = elem.querySelector('span.gI');

      if (container.innerHTML.indexOf(triggerText) != -1) {
        const name = container.firstChild;
        const email = container.children[1];
        const text = container.innerText;
        const newMessage = document.createTextNode(`${message}`);
        const oldMessage = document.createElement('strike');

        oldMessage.appendChild(document.createTextNode(` ${text} `));

        container.innerHTML = '';
        container.appendChild(name);
        container.appendChild(document.createTextNode(` `));
        container.appendChild(email);
        container.appendChild(document.createElement('br'));
        container.appendChild(oldMessage);
        container.appendChild(document.createElement('br'));
        container.appendChild(newMessage);
      }
    });
  }

  createCustomIcon(iconUrl, message) {
    const el = document.createElement('img');
    el.setAttribute('src', iconUrl);
    el.setAttribute('title', message);

    return el;
  }

  isInbox() {
    const result = /^https:\/\/inbox\.google\.com\/.+$/.exec(window.location.href);
    return result && result.length;
  }

  addInfoText(markedClassName, infoText, message) {
    const el = document.createElement('span');
    const container = document.getElementsByClassName(markedClassName);

    if (container.length > 0) {
      const index = container[0];
      el.innerHTML = infoText;
      el.setAttribute('class', 'smime-sender-gmail tooltip');
      el.setAttribute('title', message);
      index.parentNode.insertBefore(el, index);
    }
  }

  getInfoText(result) {
    // CANNOT_VERIFY does not trigger marking and does not need its own info text.
    switch (result.code) {
      case smimeVerificationResultCodes.FRAUD_WARNING:
        return 'Caution!';
      case smimeVerificationResultCodes.VERIFICATION_OK:
        return result.signer;
      default:
        return '';
    }
  }

  getIconPath(result) {
    return `img/${result.code.toLowerCase()}.png`;
  }
}

export default MarkingService;
