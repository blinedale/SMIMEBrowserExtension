class Marking {
  prepare(message, result) {
    this.message = message;
    this.result = result;
    this.markedClass = `smime-mark-${this.result.mailId}`;
    this.iconUrl = chrome.runtime.getURL(`img/${this.result.code.toLowerCase()}.png`);
    return this;
  }

  withAttachmentIcon() {
    const messageAttachmentIconDescriptor = {
      iconUrl: this.iconUrl,
      iconClass: this.markedClass,
      tooltip: this.result.message
    };

    this.message.addAttachmentIcon(messageAttachmentIconDescriptor);

    if (this.result.signer) {
      this.addSigner();
    }

    return this;
  }

  addSigner() {
    const el = document.createElement('span');
    const container = document.getElementsByClassName(this.markedClass);

    if (container.length > 0) {
      const index = container[0];
      el.innerHTML = this.result.signer;
      el.setAttribute('class', 'smime-sender-email');
      index.parentNode.insertBefore(el, index);
    }
  }

  withAttachmentCard() {
    this.message.addAttachmentCardView({
      title: this.result.message,
      description: this.result.message,
      previewUrl: this.iconUrl,
      previewThumbnailUrl: this.iconUrl,
      failoverPreviewIconUrl: this.iconUrl,
      previewOnClick: e => {
        e.preventDefault();
      },
      fileIconImageUrl: this.iconUrl,
      buttons: [],
      foldColor: '#55988D',
      mimeType: null
    });
    return this;
  }
}

export default new Marking();
