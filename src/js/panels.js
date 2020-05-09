'use strict';
// Using CommonJS pattern to add dependency relationships. 
// Using browserify as pre-processor
const _ = require('underscore');
const $ = require('jquery');
// BanyonLabs namespace to avoid object name clashing
let BanyonLabs = {};

BanyonLabs.panels = document.querySelector('.panels');
BanyonLabs.selectors = document.querySelector('[data-nav="main"]');
BanyonLabs.cumulativeHeight = 0;
BanyonLabs.pages = [];

BanyonLabs.scrollPanel = function () {
    // Determine how far the scrollbar is from the top
    let scrollTop = $(window).scrollTop();
    // Arbritrary threshold calculation for determining when panel is in view
    let inView = _.find(BanyonLabs.pages, function (panel) {
        if ((panel.cumulative * 0.95) > scrollTop && scrollTop < (panel.cumulative * 1.05)) {
            return true;
        }
        return false;
    });
    // Animation for social media and banyon logo. Again arbritrary threshold calculation for animation triggering
    if (scrollTop > $(window).height() * 0.25) {
        $('.social-media').addClass('animate-size');
        $('.banyon-logo').addClass('slide-right');
    } else {
        $('.social-media').removeClass('animate-size');
        $('.banyon-logo').removeClass('slide-right');
    }
    BanyonLabs.toggleSelector(BanyonLabs.selectors, BanyonLabs.selectors.children[BanyonLabs.pages.indexOf(inView)], 'scroll');
    
    // DEBUG ONLY
    // let scrollHeight = $(document).height();
    // let clientHeight = $(window).height();
    // console.log(inView);
    // $('#test').text('Client: ' + clientHeight + ' | ' + scrollTop + ' / ' + scrollHeight + ' | ' );
};
BanyonLabs.toggleSelector = function(parent, current, eventType) {
    // Remove selected class from panel selectors
    _.each(parent.children, function (element) {
        $(element).removeClass('selected');
    });
    // Differentiate between when panel is clicked or scroll into view
    if (eventType === 'click') {
        // Retrieve index for panel in view
        let currentIndex = _.findIndex(parent.children, function (panel) {
            if (panel.attributes['data-title'].textContent === current.attributes['data-title'].textContent) {
                return true;
            }
            return false;
        });
        // Scroll to panel clicked
        switch (currentIndex) {
            case 0:
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                break;
            case BanyonLabs.pages.length - 1:
                $('html, body').animate({
                    scrollTop: $(document).height()
                }, 500);
                    break;
            default:
                $('html, body').animate({
                    scrollTop: BanyonLabs.pages[currentIndex - 1].cumulative
                }, 500);
                break;
        }
        // Add selected class to current panel
        $(current).addClass('selected');

    } else {
        // Add selected class to current panel
        $(current).addClass('selected');
    }
};

$(window).on('scroll', BanyonLabs.scrollPanel);

_.each(BanyonLabs.panels.children, function (element) {
    // The idea here is to determine the total height for all previous panels. 
    // Thus giving an exact "top" number for every panel
    BanyonLabs.cumulativeHeight += element.clientHeight;
    // Store panel information. 
    BanyonLabs.pages.push({
        name: element.textContent,
        cumulative: BanyonLabs.cumulativeHeight
    });
});

_.each(BanyonLabs.selectors.children, function (element) {
    // Registering new click events for selectors
    element.addEventListener('click', function (e) {
        e.preventDefault();
        let currentSelector = e.currentTarget;
        BanyonLabs.toggleSelector(currentSelector.parentElement, currentSelector, 'click');
    });
});