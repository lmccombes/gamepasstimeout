function hideElement(element){
  if(element){
    element.classList.add("progress-elements-to-hide");
  }
}

function showElement(element){
  if(element){
    element.classList.remove("progress-elements-to-hide");
  }
}

const hideProgressElements = () => {
  const time = document.querySelector('diva-time');
  hideElement(time);

  const progressBar = document.querySelector('diva-range-slider.ng-star-inserted')?.parentElement;
  hideElement(progressBar);
};

var hideObserver = new WebKitMutationObserver(hideProgressElements);

const showProgressElements = () => {
  const time = document.querySelector('diva-time');
  showElement(time);

  const progressBar = document.querySelector('diva-range-slider.ng-star-inserted')?.parentElement;
  showElement(progressBar);
};

const showObserver = new WebKitMutationObserver(showProgressElements);

const disableExtension = () => {
  hideObserver.disconnect();
  showProgressElements();
  showObserver.observe(document, {
    childList: true,
    subtree: true
  });
};

const enableExtension = () => {
  showObserver.disconnect();
  hideProgressElements();
  hideObserver.observe(document, {
    childList: true,
    subtree: true
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.enable) {
      enableExtension();
    } else {
      disableExtension();
    }
  }
);

chrome.runtime.sendMessage({query: "isEnabled"}, function(response) {
  console.log("response: ", response);
  if(response.enabled){
    enableExtension();
  } else {
    disableExtension();
  }
});
