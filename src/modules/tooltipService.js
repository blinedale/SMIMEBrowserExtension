class TooltipService {
  constructor(config) {
    this.config = config;
  }

  addTooltip(message) {
    $('.inboxsdk__message_attachment_icon').attr('title', message);
    this.tooltip = $(this.config.selector).tooltipster({
      animation: this.config.animation,
      theme: this.config.theme,
      trigger: this.config.trigger
    });
  }
}

export default TooltipService;
