/* eslint-disable */
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
    setTimeout(function() { 
        window.scrollTo(0,0);
    }
    , 200);
});