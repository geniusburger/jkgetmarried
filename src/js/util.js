
//////////////////////////////////////////////////////////////////////////////////
////////     Utilities
//////////////////////////////////////////////////////////////////////////////////

var util = {};

/**
 * Retrieve a cookie from the browser.
 * @param  {string} name The name of the cookie to retrieve.
 * @return {string} Value of the cookie or null if not found.
 */ 
util.getCookie = function(name) {
    var name = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
};

/**
 * Set a cookie in the browser.
 * @param {string} name The name of the cookie to set.
 * @param {string} value The value fo the cookie to set.
 */
util.setCookie = function(name, value) {
    document.cookie = name + "=" + value;
};

/**
 * Remove all child nodes.
 * @param  {object} parent The node to remove all children from.
 */
util.removeChildren = function(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

util.getNumberWithCommas = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

util.disableForm = function(form) {
    util.setFormDisabled(form, true);
};

util.enableForm = function(form) {
    util.setFormDisabled(form, false);
};

util.setFormDisabled = function(form, disabled) {
    var elements = form.elements;
    for (var i = 0, len = elements.length; i < len; ++i) {
        elements[i].disabled = disabled;
    }
    var $btns = $(form).find('.btn-group .btn').prop('disabled',disabled);
    if( disabled) {
        $btns.addClass('disabled');
    } else {
        $btns.removeClass('disabled');
    }
};

util.setBtnType = function(btn, type) {
    if(btn.classList.contains('btn')) {
        btn.classList.remove('btn-default');
        btn.classList.remove('btn-primary');
        btn.classList.remove('btn-success');
        btn.classList.remove('btn-info');
        btn.classList.remove('btn-warning');
        btn.classList.remove('btn-danger');
        btn.classList.remove('btn-link');

        btn.classList.add('btn-' + type);
    }
}

util.isOverflowed = function(element){
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}