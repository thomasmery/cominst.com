/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';

import ContactForm from './components/ContactForm';

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


    ReactDOM.render(
      <ContactForm />,
      document.getElementById('contact-form-container')
    );

    const toggleMobileMenu = function() {
        const $header = document.querySelector('body > header');
        const toggleClass = 'mobile-menu-hidden';
        if($header.classList.contains(toggleClass)) {
            $header.classList.remove(toggleClass);
        }
        else {
            $header.classList.add(toggleClass);
        }
    }

    // mobile menu toggle
    const $menuToggleButtonOpen = document.querySelector('.mobile-menu-button-open');
    const $menuToggleButtonClose = document.querySelector('.mobile-menu-button-close');
    $menuToggleButtonOpen.addEventListener('click', toggleMobileMenu);
    $menuToggleButtonClose.addEventListener('click', toggleMobileMenu);
});
