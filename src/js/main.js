
jk = {};

jk.weddingDate = new Date(2015, 5, 27, 16, 0, 0, 0);

jk.scrollPixelsPerSecond = 2000;
jk.maxScrollTime = 2000;
jk.initialGalleryLoadCount = 2;

jk.icons = [
    'flaticon-balloon11',
    'flaticon-bell53',
    'flaticon-bouquet1',
    'flaticon-bow9',
    'flaticon-cake20',
    'flaticon-camera97',
    'flaticon-champagne7',
    'flaticon-chicken18',
    'flaticon-chicken19',
    'flaticon-gift69',
    'flaticon-heart310',
    'flaticon-heart311',
    'flaticon-heart312',
    'flaticon-heart313',
    'flaticon-hearts10',
    'flaticon-jewel2',
    'flaticon-passion',
    'flaticon-ring25',
    'flaticon-rings3',
    'flaticon-rose14'
];

jk.setup = function() {

    jk.$window = $(window);
    jk.$body = $('body');
    jk.$bg = $('.bg');
    jk.$toggle = $('button.navbar-toggle');
    jk.$gallery = $('#gallery');

    jk.setupEggs();
    jk.setupIcons();
	jk.populateNavs();
	jk.collapseNavOnClick();
	jk.affixSideNav();
	jk.fixSideNavAffixWidth();
    jk.setupAccordion();
	jk.startCounter();
    jk.setupGallery();
	jk.setupParallax();
	jk.setupDemo();
    $('.sidebar a, .navbar a, a.smooth').click(jk.smoothScroll);
    $(document.forms.rsvp).submit(jk.rsvp);
    $(document.forms.sign).submit(jk.signGuestBook);
    $(document.forms._xclick).submit(jk.honeymoon);
    $('#askus').click(jk.askus);
    jk.readGuestBook();
    jk.resizeHandler();
};

jk.setupAccordion = function() {
    $('#accordion>.panel').each(function(i, panel) {
        var $panel = $(panel);
        $panel.addClass('panel-jk-secondary');

        var $title = $panel.children('.panel-title').first().remove();
        var $body = $panel.children('.panel-body').first().remove();

        $panel.append(
            '<div class="panel-heading" role="tab">' +
                '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '"' + (i > 0 ? ' class="collapsed"' : '') + '>' +
                    '<h4 class="panel-title">' +
                        $title.html() +
                        '<span class="status"></span>' +
                    '</h4>' +
                '</a>' +
            '</div>'
        );

        $panel.append(
            '<div id="collapse' + i + '" class="panel-collapse collapse' + (i === 0 ? ' in' : '') + '" role="tabpanel">' +
                '<div class="panel-body">' +
                    $body.html() +
                '</div>' +
            '</div>'
        );
    });
};

jk.setupIcons = function() {
    //$('h1.page-header').prepend('<span class="' + jk.icons[0] + '"></span>');
    $('h1.page-header [class^=flaticon-]').click(jk.iconClickHandler);
};

jk.iconClickHandler = function() {
    var iconIndex = jk.icons.indexOf(this.className) + 1;
    if(iconIndex >= jk.icons.length) {
        iconIndex = 0;
    }
    this.className = jk.icons[iconIndex];
};

jk.setupEggs = function() {
    document.querySelector('.brand').onclick = function(){
        game.toggle(jk.$body);
    };
};

/**
 *
 * @param {string} orig
 */
jk.reverse = function(orig) {
    return orig.split('').reverse().join('');
};

jk.askus = function() {
    game.gainLife();
    window.location.href = jk.reverse('noitseuq02%a02%evah02%I=tcejbuS?moc.deirramtegkj@snoitseuq:otliam');
    return false;
};

jk.readGuestBook = function() {
    var posting = $.post( 'submit.php', 'action=read');

    posting.done(function( jsonString ) {
        var data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            data = {result: 'json error', 'error': jsonString};
        }

        if( data.result == 'success') {
            jk.populateGuestBook(data.data);
        } else {
            console.error('read error', data.error);
        }
    });

    posting.fail(function() {
        document.forms.sign.submit.innerHTML = 'Error';
    });
};

jk.populateGuestBook = function(messages) {
    var guestBook = document.getElementById('guestBookMessages');
    util.removeChildren(guestBook);

    messages.forEach(function(entry) {

        var msg = document.createElement('div');
        msg.className = 'panel panel-msg';

        var heading = document.createElement('div');
        msg.appendChild(heading);
        heading.className = 'panel-heading';
        heading.appendChild(jk.buildSpan('message-name', entry['name']));
        heading.appendChild(jk.buildSpan('badge pull-right', entry['date']));

        var body = document.createElement('div');
        msg.appendChild(body);
        body.className = 'panel-body';
        body.appendChild(jk.buildSpan('message-body', entry['message']));

        guestBook.appendChild(msg);
    });
};

jk.buildSpan = function(className, text) {
    var span = document.createElement('span');
    span.className = className;
    span.innerHTML = text;
    return span;
};

jk.honeymoon = function() {
    game.gainLife();
    $(this).append('<input type="hidden" name="business" value="' + jk.reverse('moc.deirramtegkj@noomyenoh') + '">');
    return true;
};

jk.signGuestBook = function(event) {
    game.gainLife();
    event.preventDefault(); // Stop form from submitting normally
    var posting = $.post( 'submit.php', $(this).serialize());
    util.disableForm(this);
    this.submit.innerHTML = 'sending...';

    posting.done(function( jsonString ) {
        var data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            data = {result: 'json error', 'error': jsonString};
        }
        var button = document.forms.sign.submit;
        if( data.result == 'success') {
            util.enableForm(document.forms.sign);
            button.innerHTML = 'Sign';
            document.forms.sign.reset();
            jk.readGuestBook();
            $('#signPanel').find('.panel-heading a').click();
        } else {
            button.innerHTML = 'Failure. Try again?';
            util.setBtnType(button, 'danger');
            util.enableForm(document.forms.sign);
            console.error('sign error', data.error);
        }
    });

    posting.fail(function() {
        document.forms.sign.submit.innerHTML = 'Error';
    });
};

jk.rsvp = function(event) {
    game.gainLife();
    event.preventDefault(); // Stop form from submitting normally
    var posting = $.post( 'submit.php', $(this).serialize());
    util.disableForm(this);
    this.submit.innerHTML = 'sending...';

    posting.done(function( jsonString ) {
        var data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            data = {result: 'json error', 'error': jsonString};
        }
        var button = document.forms.rsvp.submit;
        if( data.result == 'success') {
            button.innerHTML = 'Thanks for letting us know!';
            util.setBtnType(button, 'success');
        } else {
            button.innerHTML = 'Failure. Try again?';
            util.setBtnType(button, 'danger');
            util.enableForm(document.forms.rsvp);
            console.error('rsvp error', data.error);
        }
    });

    posting.fail(function() {
        document.forms.rsvp.submit.innerHTML = 'Error';
    });
};

jk.populateNavs = function() {
	var side = document.getElementById('sideList');
	var top = document.getElementById('topList');
	var sections = document.querySelectorAll('.section > .page-header');
	for( var i = 0; i < sections.length; i++) {
    	side.appendChild(jk.buildNavItem(sections[i].id, sections[i].textContent));
    	top.appendChild(jk.buildNavItem(sections[i].id, sections[i].textContent));
	}
};

jk.buildNavItem = function(href, html) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    li.appendChild(a);
    a.href = '#' + href;
    a.innerHTML = html;
    return li;
};

jk.isTopMenuVisible = function() {
    return jk.$toggle.is(':visible');
};

jk.collapseNavOnClick = function() {
	$('#topList').children('li').children('a').on('click', function() {//$('#topList>li>a')
		if( jk.isTopMenuVisible()) {
			jk.$toggle.click();
		}
	});
};

jk.affixSideNav = function() {
    $('#sideNav').affix({
		offset: {
			top: function () {
				// Calc how far to scroll before the top will hit where it should stop
				return (this.top = $('#banner').height());
			},
			bottom: function () {
				// Calc how far to scroll before the bottom will hit where it should stop
				return (this.bottom = $('.footer').outerHeight(true));
			}
		}
	});
};

jk.fixSideNavAffixWidth = function() {
	// Fix width issue
	$('[data-clampedwidth]').each(function () {
	    var elem = $(this);
	    var parentPanel = elem.data('clampedwidth');
	    var resizeFn = function () {
	        var sideBarNavWidth = $(parentPanel).width();// - parseInt(elem.css('paddingLeft')) - parseInt(elem.css('paddingRight')) - parseInt(elem.css('marginLeft')) - parseInt(elem.css('marginRight')) - parseInt(elem.css('borderLeftWidth')) - parseInt(elem.css('borderRightWidth'));
	        elem.css('width', sideBarNavWidth);
	    };

	    resizeFn();
	    jk.$window.resize(resizeFn);
	});
};

jk.startCounter = function() {
	//jk.weddingDate = countdownTimer.createFutureDate(0, 1, 0, 6);
	var labels = document.querySelectorAll('.counter-label td');
	var data = document.querySelectorAll('.counter-data td');
	var progress = document.querySelector('.progress-bar');
	var target = document.querySelector('.target-date td');
	countdownTimer.initialize(jk.weddingDate, target, labels, data, progress, true);
};

jk.setupParallax = function() {
    if(jk.isTopMenuVisible()) {
        // undo parallax for mobile since it's dodgy and can't really be seen
        jk.$bg.css({position : 'absolute', top : '0px'});
        jk.speedDivisor = 1;
    } else {
        jk.speedDivisor = jk.$bg.data('speed-divisor');
        if( !jk.speedDivisor || jk.speedDivisor < 0) {
            jk.speedDivisor = 1;
        }
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
        jk.$window.scroll( function() {
            window.requestAnimationFrame(jk.scrollHandler);
        });
    }
    jk.$window.resize(jk.resizeHandler);
    $('.panel a').mouseup(function(){window.setTimeout(jk.resizeHandler, 1000);});
    jk.startupResizeCount = 0;
    jk.resizeHandler();
    for( var delay = 0; delay < 10000; delay += 1000) {
        window.setTimeout(jk.resizeHandler, delay);
    }
};

jk.resizeHandler = function() {
    var bodyHeight = jk.$body.height();
    var windowHeight = jk.$window.height();
    var $topNav = $('.navbar-fixed-top');
    if( $topNav.is(':visible')) {
        windowHeight -= $topNav.height();
    }
	jk.$bg.height(1 + windowHeight + ((bodyHeight - windowHeight) / jk.speedDivisor));
    if( jk.startupResizeCount < 50) {
        if(jk.lastHeight === bodyHeight) {
            jk.startupResizeCount++;
        }
        jk.lastHeight = bodyHeight;
        window.setTimeout(jk.resizeHandler, 50);
    }
    jk.resizeGallery(windowHeight);
};

jk.scrollHandler = function() {
	var scrolled = jk.$window.scrollTop();
    var translateY = -Math.round(scrolled / jk.speedDivisor);
    if( jk.lastTranslateY !== translateY) {
        jk.lastTranslateY = translateY;
        jk.$bg.css('transform', 'translateY(' + translateY + 'px)');
    }
};

jk.setupDemo = function() {
    if( document.getElementById('demo')) {
        var demos = document.querySelector('#bgpanel .panel-body');
        for( var i = 0; i < bg.filenames.length; i++) {
            var outer = document.createElement('div');
            outer.className = 'col-md-2';
            var inner = document.createElement('div');
            inner.className = 'center-block';

            var img = document.createElement('img');
            img.src = 'images/tiles/' + bg.filenames[i];
            img.onclick = jk.changeBackgroundImage;
            img.title = bg.filenames[i];

            inner.appendChild(img);
            outer.appendChild(inner);
            demos.appendChild(outer);
        }

        var bgimg = util.getCookie('bgimg');
        if( bgimg) {
            jk.$bg.css('backgroundImage', "url('" + bgimg + "')");
        } else {
            jk.$bg.css('backgroundImage', "url('images/tiles/" + bg.filenames[0] + "')");
        }

        $('#speedbutton').click(jk.switchSpeed);
        $('#speedinput').val(jk.speedDivisor);
    } else {
        jk.$bg.css('backgroundImage', "url('images/tiles/dark--floorboard-wood-background-texture-025.jpg')");
    }
};

jk.switchSpeed = function() {
	var newSpeed = $('#speedinput').val();
	if( !isNaN(newSpeed)) {
		jk.speedDivisor = newSpeed;
		jk.resizeHandler();
	}
	return false;
};

jk.changeBackgroundImage = function(e) {
    jk.$bg.css('backgroundImage', "url('" + e.target.src + "')");
	util.setCookie('bgimg', e.target.src);
};

jk.smoothScroll = function() {
    this.blur();
    game.loseLife();
    var target;
    var top;
	var selector = this.href.substring(this.href.indexOf("#"));
	var $body = $('body, html');
	if( selector === "#") {
        //target = body;
        top = 0;
    } else {
		target = $(selector);
        top = target.offset().top;
	}
    var diff = Math.abs(top - jk.$window.scrollTop());
	var time = 1000 * diff / jk.scrollPixelsPerSecond;
	if( time > jk.maxScrollTime) {
		time = jk.maxScrollTime;
	}

	$body.stop(true);
	$body.animate({
		scrollTop: top
	}, time);

	return false;
};

jk.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

jk.setupGallery = function() {

    var carousel = document.querySelector('.carousel-inner');
    $('#gallery').on('slid.bs.carousel', function (e) {
        if( !e.relatedTarget.resized) {
            e.relatedTarget.resized = true;
            jk.resizeHandler();
        }
    });
    jk.shuffle(gallery.images);

    var buildGalleyImage = function(i, active, load) {
        var galleryImage = gallery.images[i];
        var item = document.createElement('div');
        item.className = 'item';
        if(active) {
            item.className += ' active';
        }

        var img = document.createElement('img');
        item.appendChild(img);
        img.src = 'images/gallery/' + galleryImage.name;
        img.originalWidth = galleryImage.width;
        img.originalHeight = galleryImage.height;
        $(img).load(load);

        if( galleryImage.caption) {
            var caption = document.createElement('div');
            item.appendChild(caption);
            caption.className = 'carousel-caption';
            caption.innerHTML = galleryImage.caption;
        }
        carousel.appendChild(item);
    };

    var loadHandler = function myself() {
        jk.resizeHandler();
        if( jk.nextImageIndex < gallery.images.length) {
            buildGalleyImage(jk.nextImageIndex++, false, myself);
        }
    };

    var loadAtStart = Math.min(gallery.images.length, jk.initialGalleryLoadCount);

    for(jk.nextImageIndex = 0; jk.nextImageIndex < loadAtStart; jk.nextImageIndex++) {
        buildGalleyImage(jk.nextImageIndex, jk.nextImageIndex === 0, null);
    }

    // dynamically load the rest of the images
    loadHandler();
};

jk.resizeGallery = function(windowHeight) {
    windowHeight -= 20;
    var galleryWidth = jk.$gallery.width();
    var maxHeight = Math.min(Math.floor(galleryWidth * gallery.maxRatio), windowHeight);
    var maxPx = maxHeight + 'px';
    jk.$gallery.height(maxPx);
    jk.$gallery.find('img').each(function(index, el) {
        var height = galleryWidth * el.originalHeight / el.originalWidth;
        if( height > el.originalHeight) {
            height = el.originalHeight;
        }
        if( height > maxHeight) {
            height = maxHeight;
        }
        $(el).css({
            'max-height' : maxPx,
            'margin-top' : Math.floor(Math.max(0, (maxHeight - height) / 2)) + 'px'
        });
    });
};

// start when data is loaded, pics might not be
$(document).ready(jk.setup);