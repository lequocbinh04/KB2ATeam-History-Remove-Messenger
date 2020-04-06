chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.reset)
      window.location.reload();
  return true;
  });