import smimeVerificationResultCodes from "../constants/smimeVerificationResultCodes";

class TooltipService {
  constructor(config) {
    this.config = config;
  }

  addTooltip(result) {
    let messageTheme = this.config.themeError;
    if (result.code === smimeVerificationResultCodes.VERIFICATION_OK) {
      messageTheme = this.config.themeSuccess;
    }
    let tooltipMultiple = false;

    $('.inboxsdk__message_attachment_icon').attr('title', result.message);
    if ($(this.config.selector).hasClass('tooltipstered')) {
      tooltipMultiple = true;
    }

    this.tooltip = $(this.config.selector).tooltipster({
      animation: this.config.animation,
      theme: messageTheme,
      trigger: this.config.trigger,
      multiple: tooltipMultiple
    });
  }
}

export default TooltipService;
