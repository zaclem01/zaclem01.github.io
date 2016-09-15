const $ = require('jquery');
const slick = require('./slick.js');
const d3 = require('d3');

const $siteNav = $('.siteNav');
let lastScroll = 0;
let timedNavHide;

// Hiding functionality for Nav
// Only hide on non-mobile screens
$(window).on('scroll', function() {
    if ($(this).width() > 660) {
        let thisScroll = $(this).scrollTop();
        // Always show Nav when at the top of the page
        if (thisScroll < 100) {
            clearTimeout(timedNavHide);
            $siteNav.show();
            console.log('showing nav: at top')
        // Hide Nav on scroll down
        } else if (thisScroll > lastScroll) {
            $siteNav.slideUp('fast');
            console.log('hiding nav on scroll')
        // Show Nav on scroll up, but hide again after 2 seconds
        } else {
            $siteNav.slideDown('fast');
            console.log('showing nav on scroll')
            clearTimeout(timedNavHide);
            timedNavHide = setTimeout(hideNav, 2000);
        }
        lastScroll = thisScroll;
    // Hide menu if open on mobile scroll
    } else {
        if ($siteNav.hasClass('js-responsive')) {
            $siteNav.removeClass('js-responsive');
        }
    }
});

// Don't hide the Nav while hovering over
$siteNav.on('mouseenter', function() {
    clearTimeout(timedNavHide);
});

// If not at top, hide the Nav again on mouse out
$siteNav.on('mouseleave', function() {
    let thisScroll = $(this).scrollTop();
    if (thisScroll > 100) {
        timedNavHide = setTimeout(hideNav, 2000);
    }
});

const hideNav = () => $siteNav.slideUp('fast');

$('.siteNav_menuBtn').on('click', function() {
    $siteNav.toggleClass('js-responsive');
});

$('.work_content').slick({
    arrows: true,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    adaptiveHeight: true,
    responsive: [
        {
            breakpoint: 420,
            settings: {
                slidesToShow: 1
            }
        }
    ]
});