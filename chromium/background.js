const script = document.createElement("script");
script.src = chrome.extension.getURL("override.js");
(document.head || document.documentElement).appendChild(script);
