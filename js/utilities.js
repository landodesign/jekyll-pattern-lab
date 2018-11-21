//Browser related
/*
 This function check either it is touch device or not
 and return true if it's touch device
 */
function is_touch_device() {
    var isTouchDevice = false;
    if ("ontouchstart" in window || navigator.msMaxTouchPoints) {
        isTouchDevice = true;
    }
    return isTouchDevice;
    //this code is not supported in all browsers
    /*try {
     document.createEvent("TouchEvent");
     return true;
     } catch (e) {
     return false;
     }*/
}

/*
 This function check either it is IE Mobile
 and return true if it is
 */
function is_ie_mobile() {
    return navigator.userAgent.match(/iemobile/i);
}

/*
 This function returns the screen width of browser.
 */
function get_screen_width() {
    var screenWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
    return screenWidth
}

/*
 This function check either it is iOS device or not
 and return true if it's iOS device
 */
function is_iOS_device() {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
}

/*
 This function check either it is iOS device or not
 and return true if it's iOS device
 */
function is_iPad_device() {
    var regExp = new RegExp("iPad", "i");
    return navigator.userAgent.match(regExp) == "iPad";
}

/*
 This function check either the page is loaded in browser
 or in within iFrame on the page
 */
function is_page_iframed() {
    if (window.frameElement) {
        // loaded in frame
        return true;
    }
    else {
        // not in frame
        return false;
    }
}

/*
 This function check either the page is loaded default or
 loaded after a Post Back
 return true, if its a Post Back
 */
function isPostBack() {
    return document.referrer.indexOf(document.location.href) > -1;
}


//Content related
/*
 This function check href attribute for anchors to find out either
 its linked to a page that is not in current domain.
 */
function updateExternalLinks() {
    var currentDomain = document.location.protocol + '//' + document.location.hostname;
    $('a[href^="http"]:not([href*="' + currentDomain + '"])').each(function () {
        $(this).attr("target", "_blank");
        $(this).addClass("external-link");
        $(this).prepend("<span class=\"sr-only\">Opens in new window</span>");
    });
}

/*
 This function makes a phone number link on mobile devices but not on iOS.
 */
function linkPhoneNumbers(hook) {
    if (!is_iOS_device()) {
        $(hook).each(function () {
            var html = $(this).html();
            //remove all white spaces from html
            var cleanedNum = html.replace(/ /g, "");
            cleanedNum = cleanedNum.replace("+", "");
            cleanedNum = cleanedNum.replace("(", "");
            cleanedNum = cleanedNum.replace(")", "");
            var ariaLabel = $(this).attr('aria-label');
            var ariaLabelHtml = "";
            if (ariaLabel != undefined) {
                ariaLabelHtml = ' aria-label="' + ariaLabel + '" ';
            }
            $(this).wrap('<a href="tel:' + cleanedNum + '"' + ariaLabelHtml + ' class="wrapped-phone">' + html + '</a>');
            $(this).remove();
        });
    }
}

/*
 This function makes a phone number a normal text on desktop view.
 */
function unWrapLinkedPhoneNumbers(hook) {
    $(hook).each(function () {
        var phoneNumber = $(this).text();
        var ariaLabel = $(this).attr('aria-label');
        var ariaLabelHtml = "";
        if (ariaLabel != undefined) {
            ariaLabelHtml = ' aria-label="' + ariaLabel + '" ';
        }
        $(this).wrap('<span' + ariaLabelHtml + ' class="phone">' + phoneNumber + '</span>');
        $(this).remove();
    });
}

/*
 * Play/Pause events from carousel
 */
function bindPlayPauseEventsForCarousel() {
    $('.play-control').click(function () {
        var carouselId = $(this).attr('href');
        $(carouselId).carousel('cycle');
        $(carouselId).carousel('next');
        $(this).addClass('active');
        $(".pause-control[href='" + carouselId + "']").removeClass('active');
        return false;
    });
    $('.pause-control').click(function () {
        var carouselId = $(this).attr('href');
        $(carouselId).carousel('pause');
        $(this).addClass('active');
        $(".play-control[href='" + carouselId + "']").removeClass('active');
        return false;
    });
}

/*
 * Bind Swipe left/right events for carousel
 */
function bindSwipeEventsForCarousel() {
    if ($('.carousel').length && is_touch_device()) {
        downloadJS("js/hammer.min.js", function () {
            $('.carousel').hammer().on('swipeleft', function () {
                /*var obj = (e.target ? e.target : e.srcElement);
                 var carouselId = $(obj).parents('.carousel').attr('id');
                 alert('swipe left id: '+carouselId);*/
                $(this).carousel('next');
            });
            $('.carousel').hammer().on('swiperight', function () {
                /*var obj = (e.target ? e.target : e.srcElement);
                 var carouselId = $(obj).parents('.carousel').attr('id');
                 alert('swipe right id: '+carouselId);*/
                $(this).carousel('prev');
            });
        });
    }
}

/*
 * Bind left/right key down events for carousel
 */
function bindEventsForCarousel(hook, bindOptions) {
    if ($('.carousel').length) {
        //pause slider when anchor is in focus
        $('.carousel .carousel-inner .item a').focus(function () {
            var carouselId = $(this).parents('.carousel').attr('id');
            $("#" + carouselId).carousel('pause');
        }).blur(function () {
            var carouselId = $(this).parents('.carousel').attr('id');
            $("#" + carouselId).carousel('cycle');
        });

        //bind keyboard arrow keys event
        $(document).keydown(function (e) {
            var obj = (e.target ? e.target : e.srcElement);
            var carouselId = $(obj).parents('.carousel').attr('id');
            if (e.which == 37) {
                $("#" + carouselId).carousel('prev');
            }
            if (e.which == 39) {
                $("#" + carouselId).carousel('next');
            }
        });
        if (hook != undefined && bindOptions != undefined) {
            $(hook).carousel(bindOptions);
        } else {
            $('.carousel').carousel({
                interval: 30000,
                pause: 'hover'
            });
        }
    }
}

/*
 * Show center portion of the background image
 * resetFirst: pass true then reset before start calculating differences
 * resetOnly: pass true if you want to reset only
 */

function centeredBackground(hook, resetFirst, resetOnly) {
    if ($(hook).length) {
        if (resetOnly) {
            $(hook + ' img').removeAttr('style');
            return;
        }
        if (resetFirst) {
            $(hook + ' img').removeAttr('style');
        }
        var win = get_screen_width();

        $(hook + ' img').each(function () {

            var bgw = $(this).width();

            if (win < bgw) {
                var setm = (win - bgw) / 2;
                $(this).css('margin-left', setm);
            }
            else {
                var setm = "0 auto";
                $(this).css('margin', setm);
            }
        });
        $(hook + '.loading').removeClass('loading');
    }
}

//Others
/*
 This function takes a string and then remove white space,
 special characters
 */
function slugifyString(str) {
    var trimmed = $.trim(str);
    var slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return slug.toLowerCase();
}

/*
 * This function will be use to make a gray image of any type i.e *.png,*.jpg
 * Take the src attribute of image tag as parameter
 */
function grayScaleImage(src) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imgObj = new Image();
    imgObj.src = src;
    canvas.width = imgObj.width;
    canvas.height = imgObj.height;
    ctx.drawImage(imgObj, 0, 0);
    var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg;
            imgPixels.data[i + 1] = avg;
            imgPixels.data[i + 2] = avg;
        }
    }
    ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
}