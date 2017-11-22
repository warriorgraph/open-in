'use strict';

var config = {
  button: 0,
  altKey: true,
  ctrlKey: false,
  shiftKey: true,
  metaKey: false,
  enabled: false,
  hosts: []
};

chrome.storage.local.get(config, prefs => config = prefs);
chrome.storage.onChanged.addListener(e => {
  Object.keys(e).forEach(n => {
    config[n] = e[n].newValue;
  });
});

document.addEventListener('click', e => {
  const redirect = url => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    chrome.runtime.sendMessage({
      cmd: 'open-in',
      url
    });
    return false;
  };
  // hostname on left-click
  if (e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && config.hosts.length) {
    const a = e.target.closest('a');
    if (a) {
      const host = a.hostname;
      if (host) {
        if (config.hosts.some(h => h.endsWith(host) || host.endsWith(h))) {
          return redirect(a.href);
        }
      }
    }
  }
  // click + modifier
  if (
    config.enabled &&
    e.button === config.button &&
    e.altKey === config.altKey &&
    e.ctrlKey === config.ctrlKey &&
    e.metaKey === config.metaKey &&
    e.shiftKey === config.shiftKey
  ) {
    const a = e.target.closest('a');
    if (a && a.href) {
      return redirect(a.href);
    }
  }
});
