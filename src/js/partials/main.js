"use strict";

var arContactUs = {
    x: null,
    y: null,
    countdown: null,
    secs: 26,
    drag: false,
    ajaxUrl: null,
    reCaptcha: false,
    reCaptchaAction: 'callbackRequest',
    reCaptchaKey: null,
    errorMessage: 'Connection error. Please try again.',
    init: function(){
        $('#arcontactus-widget .arcontactus-message-button').on('mousedown', function(e) {
            arContactUs.x = e.pageX;
            arContactUs.y = e.pageY;
        }).on('mouseup', function(e) {
            if (e.pageX === arContactUs.x && e.pageY === arContactUs.y) {
                if (!$('#arcontactus-widget .callback-countdown-block').hasClass('display-flex')) {
                    $('#arcontactus-widget .messangers-block, #arcontactus-widget .arcontactus-close').toggleClass('show-messageners-block');
                    $('#arcontactus-widget .icons, #arcontactus-widget .static').toggleClass('hide');
                    $('#arcontactus-widget .pulsation').toggleClass('stop');
                }
                e.preventDefault();
            }
        });
        $(document).on('click', function(e) {
            if (!$(e.target).is('#arcontactus-widget, #arcontactus-widget *')) {
                if ($('#arcontactus-widget .messangers-block').hasClass('show-messageners-block')) {
                    $('#arcontactus-widget .messangers-block, #arcontactus-widget .arcontactus-close').toggleClass('show-messageners-block');
                    $('#arcontactus-widget .icons, #arcontactus-widget .static').toggleClass('hide');
                    $('#arcontactus-widget .pulsation').toggleClass('stop');
                }
            }
        });
        if (arContactUs.drag){
            $("#arcontactus-widget").draggable();
        }
        $('#widget-form').on('submit', function(event) {
            event.preventDefault();
            if (arContactUs.secs){
                arContactUs.callBackCountDownMethod();
            }
            $('.callback-countdown-block-phone').addClass('ar-loading');
            if (arContactUs.reCaptcha) {
                grecaptcha.execute(arContactUs.reCaptchaKey, {
                    action: arContactUs.reCaptchaAction
                }).then(function(token) {
                    $('#ar-g-token').val(token);
                    arContactUs.sendCallbackRequest();
                });
            }else{
                arContactUs.sendCallbackRequest();
            }
        });
        $('#arcontactus-widget .call-back').on('click', function() {
            $('#arcontactus-widget').toggleClass('opened');
            $('#arcontactus-widget .messangers-block, #arcontactus-widget .arcontactus-close').toggleClass('show-messageners-block');
            $('#arcontactus-widget .pulsation').toggleClass('stop');
            $('#arcontactus-widget .callback-countdown-block, ' +
                '#arcontactus-widget .callback-countdown-block-phone, ' +
                '#arcontactus-widget .callback-state').toggleClass('display-flex');
        });
        $('#arcontactus-widget .callback-countdown-block-close').on('click', function() {
            if (arContactUs.countdown != null) {
                clearInterval(arContactUs.countdown);
                arContactUs.countdown = null;
            }
            $('.callback-countdown-block, .callback-state, .callback-countdown-block > .display-flex').removeClass('display-flex');
            $('#arcontactus-widget').removeClass('opened');
            $('#arcontactus-widget .icons, #arcontactus-widget .static').toggleClass('hide');
        });
        $('#arcontactus-widget').addClass('active');
    },
    sendCallbackRequest: function(){
        $.ajax({
            url: arContactUs.ajaxUrl,
            type: "POST",
            dataType: 'json',
            data: $('#widget-form').serialize(),
            success: function(data) {
                $('.callback-countdown-block-phone').removeClass('ar-loading');
                if (data.success) {
                    if (!arContactUs.secs){
                        $('.callback-countdown-block-sorry, .callback-countdown-block-phone').toggleClass('display-flex');
                    }
                } else {
                    if (data.errors){
                        var errors = data.errors.join("\n\r");
                        alert(errors);
                    }else{
                        alert(arContactUs.errorMessage);
                    }
                }
            },
            error: function(){
                $('.callback-countdown-block-phone').removeClass('ar-loading');
                alert(arContactUs.errorMessage);
            }
        });
    },
    callBackCountDownMethod: function() {
        var secs = arContactUs.secs;
        var ms = 60;
        $('.callback-countdown-block-phone, .callback-countdown-block-timer').toggleClass('display-flex');
        arContactUs.countdown = setInterval(function() {
            ms = ms - 1;
            var fsecs = secs;
            var fms = ms;
            if (secs < 10) {
                fsecs = "0" + secs;
            }
            if (ms < 10) {
                fms = "0" + ms;
            }
            var format = fsecs + ":" + fms;
            $('.callback-countdown-block-timer_timer').html(format);
            if (ms === 0 && secs === 0) {
                clearInterval(arContactUs.countdown);
                arContactUs.countdown = null;
                $('.callback-countdown-block-sorry, .callback-countdown-block-timer').toggleClass('display-flex');
            }
            if (ms === 0) {
                ms = 60;
                secs = secs - 1;
            }
        }, 20);
    }
};
window.addEventListener('load', function(){
    arContactUs.drag = true;
    arContactUs.ajaxUrl = 'server.php'; 
    arContactUs.secs = 0;
    arContactUs.reCaptcha = 1;
    arContactUs.reCaptchaKey = '6Ld43FoUAAAAAAqgG_8B8lDVa7I6lAMxFCrwKc1Q';
    arContactUs.errorMessage = 'Connection error. Please refresh the page and try again.';
    arContactUs.init();
});