(function(window) {
    window.env = window.env || {};

    // Environment variables
    // This is not working may be require same implementation.
    window["env"]["SiteKey"] = "${SITE_KEY}";
  })(this);
  