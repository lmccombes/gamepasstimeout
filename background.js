const toggleEnabledStatus = () => {
  chrome.storage.local.get(['enabled'], (result) => {
    const oldVal = result.enabled;
    const newVal = !oldVal;
    chrome.storage.local.set({'enabled': newVal}, () => {});
  });
};

const doEnable = () => {
  chrome.action.setBadgeText({text: 'on'});
  chrome.action.setBadgeBackgroundColor({color: 'green'});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {enable: true}, function(response) {
    });
  });
};

const doDisable = () => {
  chrome.action.setBadgeText({text: 'off'});
  chrome.action.setBadgeBackgroundColor({color: 'gray'});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {enable: false}, function(response) {
    });
  });
};

const doEnableOrDisable = (enabled) => {
  if(enabled){
    doEnable();
  } else {
    doDisable();
  }
};

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
    const enabled = Boolean(changes.enabled?.newValue);
    doEnableOrDisable(enabled);
  }
});

const initialise = () => {
  chrome.storage.local.get(['enabled'], (result) => {
    doEnableOrDisable(result.enabled);
  });
};

chrome.runtime.onInstalled.addListener(() => {
  initialise();
});

chrome.runtime.onStartup.addListener(() => {
  initialise();
});

chrome.action.onClicked.addListener((tab) => {
  toggleEnabledStatus();
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.query === "isEnabled") {
      chrome.storage.local.get(['enabled'], (result) => {
        sendResponse({enabled: result.enabled});
      });
    }
    return true;
  }
);
