import smimeVerificationResultCodes from '../constants/smimeVerificationResultCodes';

class MarkingService {
  markResult(domMessage, result) {
    if (result.code === smimeVerificationResultCodes.CANNOT_VERIFY) {
      // No marking for CANNOT_VERIFY
      return;
    }

    const iconUrl = chrome.runtime.getURL(this.getIconPath(result));
    const additionalInfoText = this.getSignerInfoText(result);

    if (this.isInbox()) { // inbox mode activated
      this.markForInbox(domMessage, result, iconUrl, additionalInfoText);
    } else { // gmail mode activated
      this.markForGmail(domMessage, result, iconUrl, additionalInfoText);
    }
  }

  markForInbox(domMessage, result, iconUrl, additionalInfoText) {
    domMessage.addAttachmentCardView({
      title: result.message,
      description: result.message,
      previewUrl: iconUrl,
      previewThumbnailUrl: iconUrl,
      failoverPreviewIconUrl: iconUrl,
      previewOnClick: e => {
        e.preventDefault();
      },
      fileIconImageUrl: iconUrl,
      buttons: [],
      foldColor: '#55988D',
      mimeType: null
    });
    const attachmentCards = document.getElementsByClassName('inboxsdk__attachment_card_hover_overlay');
    if (attachmentCards.length) {
      Array.from(attachmentCards).forEach(card => {
        card.parentNode.style.display = "none";
      });

      const index = this.getClosestMatchingElement(attachmentCards[0], '.s2')
      .firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
      const el = document.createElement('span');
      el.innerHTML = additionalInfoText;
      el.setAttribute('class', 'smime-sender-inbox');
      index.parentNode.insertBefore(el, index);
      index.parentNode.insertBefore(this.createCustomIcon(iconUrl, result.message), index);
    }
  }

  markForGmail(domMessage, result, iconUrl, additionalInfoText) {
    const markedClassName = `smime-mark-${result.mailId}`;

    const messageAttachmentIconDescriptor = {
      iconUrl,
      iconClass: markedClassName,
      tooltip: result.message
    };

    domMessage.addAttachmentIcon(messageAttachmentIconDescriptor);

    this.addAdditionalInfoText(markedClassName, additionalInfoText);
  }

  createCustomIcon(iconUrl, message) {
    const el = document.createElement('img');
    el.setAttribute('src', iconUrl);
    el.setAttribute('title', message);

    return el;
  }

  isInbox() {
    const result = /^https:\/\/inbox\.google\.com\/([a-z0-9/?=&]+)?$/.exec(window.location.href);
    if (result != null && result.length) {
      return true;
    }
    return false;
  }

  addAdditionalInfoText(markedClassName, infoText) {
    const el = document.createElement('span');
    const container = document.getElementsByClassName(markedClassName);

    if (container.length > 0) {
      const index = container[0];
      el.innerHTML = infoText;
      el.setAttribute('class', 'smime-sender-gmail');
      index.parentNode.insertBefore(el, index);
    }
  }

  getSignerInfoText(result) {
    let infoText = result.signer; // For smimeVerificationResultCodes.VERIFICATION_OK

    if (result.code === smimeVerificationResultCodes.FRAUD_WARNING) {
      infoText = 'Fraud warning!';
    }

    return infoText;
  }

  getIconPath(result) {
    return `img/${result.code.toLowerCase()}.png`;
  }

  getClosestMatchingElement(elem, selector) {
    if (!Element.prototype.matches) { // Element.matches() polyfill
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          const matches = (this.document || this.ownerDocument).querySelectorAll(s);
          let i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {
            return i > -1;
          }
        };
    }

    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) {
        return elem;
      }
    }
    return null;
  }
}

export default MarkingService;
