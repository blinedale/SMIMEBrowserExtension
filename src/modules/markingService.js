import smimeVerificationResultCodes from '../constants/smimeVerificationResultCodes';

class MarkingService {
  markResult(domMessage, result) {
    if (result.code === smimeVerificationResultCodes.CANNOT_VERIFY) {
      // No marking for CANNOT_VERIFY
      return;
    }

    const markedClassName = `smime-mark-${result.mailId}`;
    const iconUrl = chrome.runtime.getURL(this.getIconPath(result));

    const messageAttachmentIconDescriptor = {
      iconUrl,
      iconClass: markedClassName,
      tooltip: result.message
    };

    domMessage.addAttachmentIcon(messageAttachmentIconDescriptor);

    const additionalInfoText = this.getSignerInfoText(result);
    this.addAdditionalInfoText(markedClassName, additionalInfoText);
  }

  addAdditionalInfoText(markedClassName, infoText) {
    const el = document.createElement('span');
    const container = document.getElementsByClassName(markedClassName);

    if (container.length > 0) {
      const index = container[0];
      el.innerHTML = infoText;
      el.setAttribute('class', 'smime-sender-email');
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
}

export default new MarkingService();
