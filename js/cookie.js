function getCookie(c_name) {                                // load the cookie data into memory
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) { // set the cookie when the users accepts the policy
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; path=/";
}

function checkCookie(cookie_name, elementId) {
    // Check if the cookie is set.
    var cookieValue = getCookie(cookie_name);// Call the getCookie function and load it's content into the variable 'CP_msg'
    //works only when element id is passed
    if (elementId != undefined && elementId != null && elementId != "") {
        $('#' + elementId + '.show+footer').removeAttr('style');
        if (cookieValue != null && cookieValue != "") {
            // If the cookie is set, hide the message.
            $('#' + elementId).removeClass('show').attr("aria-hidden", "true");
            $('#' + elementId + '+footer').removeAttr('style');
        }
        else {
            // If it's not set, show the message
            $('#' + elementId).addClass('show').attr("aria-hidden", "false");
            $('#' + elementId + '.show+footer').removeAttr('style');
            $('#' + elementId + '.show+footer').css('margin-bottom', $('#' + elementId).outerHeight());
        }
    }
    return cookieValue;
}

function deleteCookie(c_name, regex) {
    if (regex) {
        // Get an array of cookies
        var arrSplit = document.cookie.split(";");
        for (var i = 0; i < arrSplit.length; i++) {
            var cookie = arrSplit[i].trim();
            var cookieName = cookie.split("=")[0];
            // If the prefix of the cookie's name matches the one specified, remove it
            if (cookieName.indexOf(c_name) === 0) {
                // Remove the cookie
                document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        }
    } else {
        document.cookie = c_name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

function screen_change_cookie() {
    checkCookie("CP_msg", "cookie");
}
checkCookie("CP_msg", "cookie");