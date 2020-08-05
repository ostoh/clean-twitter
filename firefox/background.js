const script = document.createElement("script");
script.src = browser.runtime.getURL("override.js");
(document.head || document.documentElement).appendChild(script);
