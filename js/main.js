var myScroll = "";
function page_ready_default() {
    //Remove empty p tags
    $('p,div:not(#mobileThumbs,#desktopThumbs)').each(function () {
        var $this = $(this);
        if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
            $this.remove();
    });

    convertLinks();

    $('#learnMoreModal').on('show.bs.modal', function (e) {
        html = '<button type="button" class="close" data-dismiss="modal" aria-label="Close">Close</button>';
        $.get($('#learnMoreBtn').attr('data-href'), function (data) {
            html += data;
            $('#learnMoreModal .modal-body').html(html);
            
            if(myScroll === ""){
                myScroll = new IScroll('#modalScroll', {
                    mouseWheel: true,
                    scrollbars: true
                });
            }
            setTimeout(function () {
                myScroll.refresh()
            },500);
        });
    });
    var myScrollTerms = "";
    $('#terms-and-conditions').on('show.bs.modal', function (e) {
        if (myScrollTerms === "") {
            myScrollTerms = new IScroll('#modalScroll', {
                mouseWheel: true,
                scrollbars: true
            });
        }
        setTimeout(function () {
            myScrollTerms.refresh()
        }, 500);
    });
    $('.spotlight .spot-content ul li, .spotlight .spot-content ol li,.product-lg ul li,.product-lg ol li, .accordion .panel-body ul li').wrapInner('<span></span>');

    $('[id^=videoModal]').on('show.bs.modal', function (e) {
        var videoUrl = $('[data-target="#' + this.id + '"]').attr('data-video-url');
        if (videoUrl !=undefined && videoUrl.indexOf("autoplay") === -1) {
            videoUrl += "?autoplay=1";
        }
        $('#' + this.id + ' iframe').attr('src', videoUrl).show();
    }).on('hidden.bs.modal', function (e) {
        $('#' + this.id + ' iframe').removeAttr('src').hide();
    });

    $('a.skip-content').click(function () {
        if ($('main').length) {
            $('html, body').stop().animate({scrollTop: $('main').offset().top}, 500);
        }
        return false;
    });
    $('.steps li:first-of-type a, .steps li:last-of-type a,.carousel-control').click(function () {
        var attr = $(this).attr('data-slide');
        if (typeof attr === "undefined") {
            return false;
        }
    });
    $('.steps li:first-of-type a').addClass('disabled');
    $('.steps li:last-of-type a').addClass('active');
    $('.steps li:last-of-type a span:first-of-type').removeClass('svg-slider-arrow-right-disabled').addClass('svg-slider-arrow-right-enabled');
    $('#slidingcontent').on('slid.bs.carousel', function () {
        $('#slidingcontent .steps li').removeClass('active');
        lastSlideNumber = parseInt($('#slidingcontent .item:last-of-type').attr('data-slide-num'));
        slideNumber = parseInt($('#slidingcontent .item.active').attr('data-slide-num'));
        if (slideNumber === 0) {
            $('.steps li:first-of-type a').removeAttr('data-slide').addClass('disabled');
            $('.steps li:first-of-type a span:first-of-type').removeClass('svg-slider-arrow-left-enabled').addClass('svg-slider-arrow-left-disabled');
        } else {
            $('.steps li:first-of-type a').attr('data-slide', 'prev').removeClass('disabled');
            $('.steps li:first-of-type a span:first-of-type').removeClass('svg-slider-arrow-left-disabled').addClass('svg-slider-arrow-left-enabled');
        }
        if (slideNumber === lastSlideNumber) {
            $('.steps li:last-of-type a').removeAttr('data-slide').addClass('disabled');
            $('.steps li:last-of-type a span:first-of-type').removeClass('svg-slider-arrow-right-enabled').addClass('svg-slider-arrow-right-disabled');
        } else {
            $('.steps li:last-of-type a').attr('data-slide', 'next').removeClass('disabled');
            $('.steps li:last-of-type a span:first-of-type').removeClass('svg-slider-arrow-right-disabled').addClass('svg-slider-arrow-right-enabled');
        }
        $('#slidingcontent .steps li[data-slide-to="'+slideNumber+'"]').addClass('active');
    });

    // Hide empty installation details

    $('#cookieBtn').click(function () {
        //defined in cookie.js
        setCookie("CP_msg", 1, 365);
        checkCookie("CP_msg", "cookie");
        return false;
    });
    updateStandardContent('.standard-content', '16by9', 'table-striped');
    // External links function
    updateExternalLinks();
}
function screen_change_default() {
    if (myScroll !== "") {
        myScroll.refresh();
    }
    if (mobile) {
        linkPhoneNumbers('.phone');
    } else if (desktop) {
        unWrapLinkedPhoneNumbers('.wrapped-phone')
    }
    //all the functions that need called in enquire from individual plugins will go here
    if (desktop) {
        $(".dt-tel-link").attr('aria-hidden', 'false');
        $(".mb-tel-link").attr('aria-hidden', 'true');
    }
    if (mobile) {
        $(".dt-tel-link").attr('aria-hidden', 'true');
        $(".mb-tel-link").attr('aria-hidden', 'false');
    }
}
function updateStandardContent(hook, videoclass, tableclass) {
    if (isLiveSite) {
        $(hook + ' table').each(function () {
            $(this).addClass('table ' + tableclass);
            $(this).wrap('<div class="table-wrapper"></div>');
        });

        $(hook + ' ol:not(.pagination) li, ' + hook + ' ul:not(.pagination) li').each(function () {
            $(this).contents().wrap('<span></span>');
        });
        $(hook + ' ol:not(.pagination), ' + hook + ' ul:not(.pagination)').addClass('wrapped');

        $(hook + ' iframe').addClass('embed-responsive-item').wrap('<div class="embed-responsive embed-responsive-' + videoclass + '"></div>');
    }
}
function convertLinks() {
    $("a[href^='tel']").each(function () {
        var phonenumber = $(this).text();
        $(this).attr("href").replace('tel:', '');
        var newlink = '<span class="hidden-xs dt-tel-link">' + phonenumber + '</span>';
        $(this).addClass("visible-xs mb-tel-link");
        $(this).after(newlink);
    });
    if (desktop) {
        $(".dt-tel-link").attr('aria-hidden', 'false');
        $(".mb-tel-link").attr('aria-hidden', 'true');
    }
    if (mobile) {
        $(".dt-tel-link").attr('aria-hidden', 'true');
        $(".mb-tel-link").attr('aria-hidden', 'false');
    }
}

$(document).ready(function(){
  $("#search").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#customers li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
		
$(".info").hide();

$(".btn-popover").click(function(e){
    e.preventDefault();
	$(this).siblings(".info").fadeToggle(200);
	//$(".info").slideToggle();
});
	
});
