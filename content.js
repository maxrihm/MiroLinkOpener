function injectScript(scriptName) {
  const scriptElement = document.createElement('script');
  scriptElement.src = chrome.runtime.getURL(scriptName);
  (document.head || document.documentElement).appendChild(scriptElement);
}

function injectStylesheet() {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = chrome.runtime.getURL('styles.css');
  document.head.appendChild(linkElement);
}

function injectResources() {
  injectScript('miro-actions.js');
  injectScript('menu.js');
  injectStylesheet();
}

injectResources();
