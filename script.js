function hideElement(element){
  if(element){
    element.style.display = "none";
  }
}

var observer = new WebKitMutationObserver(function() {
  var time = document.querySelector('diva-time');
  hideElement(time);

  var progressBar = document.querySelector('diva-range-slider.ng-star-inserted')?.parentElement;
  hideElement(progressBar);
});

observer.observe(document, {
  childList: true,
  subtree: true
});
