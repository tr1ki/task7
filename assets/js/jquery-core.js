// jQuery core bootstrapper: wires up all jQuery features on DOM ready

$(document).ready(function(){
    console.log("jQuery is ready!");

    if (typeof initializeSearchAndAutocomplete === 'function') initializeSearchAndAutocomplete();
    if (typeof initializeSearchHighlighting === 'function') initializeSearchHighlighting();
    if (typeof initializeScrollProgressBar === 'function') initializeScrollProgressBar();
    if (typeof initializeNumberCounter === 'function') initializeNumberCounter();
    if (typeof initializeNotificationSystem === 'function') initializeNotificationSystem();
    if (typeof initializeFormLoadingSpinner === 'function') initializeFormLoadingSpinner();
    if (typeof initializeCopyToClipboard === 'function') initializeCopyToClipboard();
    if (typeof initializeLazyLoading === 'function') initializeLazyLoading();
});


