import smimeVerificationResultCodes from '../constants/smimeVerificationResultCodes';

class MarkingService {
  /**
   * @param {TooltipService} tooltipService 
   * @param {Object} translations 
   */
  constructor(tooltipService, translations) {
    this.tooltip = tooltipService;
    this.translations = translations;
  }

  markResult(domMessage, result) {
    if (result.code === smimeVerificationResultCodes.CANNOT_VERIFY) {
      // No marking for CANNOT_VERIFY
      return;
    }

    const iconUrl = chrome.runtime.getURL(this.getIconPath(result));
    const infoText = this.getInfoText(result);
    const translatedMessage = this.translations[result.message];

    if (this.isInbox()) { // inbox mode activated
      this.markForInbox(domMessage, translatedMessage, iconUrl, infoText);
    } else { // gmail mode activated
      this.markForGmail(domMessage, translatedMessage, iconUrl, infoText, result.mailId);
    }
    this.tooltip.addTooltip(result.code, translatedMessage);
  }

  markForInbox(domMessage, translatedMessage, iconUrl, infoText) {
    // From body element, find the header.
    // Last child of header is the date element.
    // Insert our stuff as children of header before the date element.

    const bodyElement = domMessage.getBodyElement();

    const bodyParent = bodyElement.parentElement;

    const headerElement = bodyParent.firstElementChild;

    const headerDateElement = headerElement.lastElementChild;

    const el = document.createElement('span');
    el.innerHTML = infoText;
    el.setAttribute('class', 'smime-sender-inbox tooltip');
    el.setAttribute('title', translatedMessage);
    headerElement.insertBefore(el, headerDateElement);
    headerElement.insertBefore(this.createCustomIcon(iconUrl, translatedMessage), headerDateElement);
  }

  markForGmail(domMessage, translatedMessage, iconUrl, infoText, mailId) {
    const markedClassName = `smime-mark-${mailId}`;
    const iconClass = `${markedClassName} tooltip`;

    const messageAttachmentIconDescriptor = {
      iconUrl,
      iconClass
    };

    domMessage.addAttachmentIcon(messageAttachmentIconDescriptor);

    this.addInfoText(markedClassName, infoText, translatedMessage);
  }

  createCustomIcon(iconUrl, message) {
    const el = document.createElement('img');
    el.setAttribute('src', iconUrl);
    el.setAttribute('title', message);
    el.setAttribute('class', 'tooltip');

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
