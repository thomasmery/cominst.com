/* eslint-disable */
window.dataLayer = window.dataLayer || [];
function gtag() {
    window.dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', window.adwordsData.adwords_ID);

/* Event snippet for Conversion contact conversion page
In your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button. */
function gtag_report_conversion(url) {
  /* var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };

  gtag('event', 'conversion', {
      'send_to': `${window.adwordsData.adwords_ID}/mYKWCOmYw30QvpurnQM`,
      'event_callback': callback,
  }); */


  console.log('gtag_report_conversion');

  return false;
}

// we want to be able to execute code only when DOM is loaded
function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// DOM loaded callback
ready(function() {
    // we want all the links used to send a message
    const emailLinks = document.querySelectorAll('a[href*="secretariat@cominst.com"]');
    [...emailLinks].forEach((el) => {
        // report conversion each time the link is clicked
        el.addEventListener('click', () => {
            gtag_report_conversion();
        });
    });
});