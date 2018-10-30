var browserType = {}

// Opera 8.0+
browserType.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
browserType.isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
browserType.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

// Internet Explorer 6-11
browserType.isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
browserType.isEdge = !browserType.isIE && !!window.StyleMedia;

// Chrome 1+
browserType.isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
browserType.isBlink = (browserType.isChrome || browserType.isOpera) && !!window.CSS;