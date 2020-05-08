'use strict';

let cumulativeHeight = 0;
let selectors = document.querySelector('[data-nav="main"]');
let panels = document.querySelector('.panels');

let Panels = [];

$(window).on('scroll', scrollPanel);

_.each(panels.children, function (element) {
    cumulativeHeight += element.clientHeight;

    Panels.push({
        name: element.textContent,
        cumulative: cumulativeHeight
    });
});

_.each(selectors.children, function (element) {
    // $('<div/>', {
    //     'class': 'test',
    //     text: element.attributes['data-title'].textContent
    // }).appendTo(element);

    element.addEventListener('click', function (e) {
        e.preventDefault();
        toggleSelected(e.currentTarget.parentElement, e.currentTarget, 'click');
    });
});

function toggleSelected(parent, current, eventType) {
    _.each(parent.children, function (element) {
        $(element).removeClass('selected');
    });

    if (eventType === 'click') {
        let currentIndex = _.findIndex(parent.children, function (panel) {
            if (panel.attributes['data-title'].textContent === current.attributes['data-title'].textContent) {
                return true;
            }
            return false;
        });

        if (currentIndex === 0) {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        } else {
            $('html, body').animate({
                scrollTop: Panels[currentIndex - 1].cumulative
            }, 500);
        }
    }

    $(current).addClass('selected');
}

function scrollPanel() {
    let scrollTop = $(window).scrollTop();
    
    let inView = _.find(Panels, function (panel) {
        if ((panel.cumulative * 0.95) > scrollTop && scrollTop < (panel.cumulative * 1.05)) {
            return true;
        }
        return false;
    });
    
    if (scrollTop > $(window).height() * 0.25) {
        $('.social-media').addClass('animate-size');
        $('.banyon-logo').addClass('slide-right');
    } else {
        $('.social-media').removeClass('animate-size');
        $('.banyon-logo').removeClass('slide-right');
    }
    
    toggleSelected(selectors, selectors.children[Panels.indexOf(inView)], 'scroll');
    
    // DEBUG ONLY
    let scrollHeight = $(document).height();
    let clientHeight = $(window).height();
    console.log(inView);
    $('#test').text('Client: ' + clientHeight + ' | ' + scrollTop + ' / ' + scrollHeight + ' | ' + inView.name);
}

// $('<div/>', {
//     id: 'panelName',
//     'class': 'test'
// }).appendTo(selectors);

// $(selectors.children).on('mouseover', function (e) {
//     let element = e.currentTarget;
//     let title = element.attributes['data-title'].textContent;


//     $('#panelName').animate({
//         top: e.clientY
//     }, '500');

//     $('#panelName').text(title);
// });

// $(selectors.children).on('mouseleave', function () {
//     $('#panelName').text('');
// });

