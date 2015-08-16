
eg = {};

eg.GALLERY_ROOT = '/public_html/images/gallery/';

eg.setup = function() {
    log.setup();
    $('#scan').click(eg.scan);
    $('#refresh').click(eg.refresh).click();
    $('#wrapper, #popup').click(eg.hide);
};

log = {
    setup : function() {
        log.controls = [document.getElementById('scan'), document.getElementById('refresh')];
        log.status = document.getElementById('status');
        log.progress = document.getElementById('progress');
        log.clear();
    },

    info : function(text) {
        log.status.innerHTML = text;
        log.status.className = '';
        log.progress.style.display = 'none';
        log.setDisabled(false);
    },

    error : function(text) {
        log.status.innerHTML = text;
        log.status.className = 'error';
        log.progress.style.display = 'none';
        log.setDisabled(false);
    },

    success : function(text) {
        log.status.innerHTML = text;
        log.status.className = 'success';
        log.progress.style.display = 'none';
        log.setDisabled(false);
    },

    clear : function() {
        log.status.innerHTML = '';
        log.progress.style.display = 'none';
        log.setDisabled(false);
    },

    wait : function() {
        log.status.innerHTML = '';
        log.progress.style.display = '';
        log.setDisabled(true);
    },

    setDisabled : function(disabled) {
        log.controls.forEach(function(button) {
            button.disabled = disabled;
        });
    }
};

eg.hideNew = function() {
    $(this).closest('.tile').find('.save').click();
};

eg.refresh = function() {
    var post = $.post( '/src/gallery/editGallery.php', 'action=read');

    log.wait();
    post.done(function( jsonString ) {
        var data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error('failed to parse read response', e);
            log.error('failed to parse read response');
            data = {result: 'json error', 'error': jsonString};
            if(e.message === 'Unexpected token <') {
                document.getElementById('images').innerHTML = jsonString;
            }
        }

        if( data.result == 'success') {
            log.success(data.data.length + ' images');
            eg.populateImages(data.data);
        } else {
            console.error('read error', data.error);
            log.error('read error');
        }
    });

    post.fail(function() {
        console.error('refresh post error');
        log.error('refresh post error');
    });
};

eg.scan = function() {
    var post = $.post( '/src/gallery/editGallery.php', 'action=scan');

    log.wait();
    post.done(function( jsonString ) {
        var data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error('failed to parse scan response', e);
            log.error('failed to parse scan response');
            data = {result: 'json error', 'error': jsonString};
            if(e.message === 'Unexpected token <') {
                document.getElementById('images').innerHTML = jsonString;
            }
        }

        if( data.result == 'success') {
            log.success('added ' + data.data['added'] + ' - deleted ' + data.data['deleted'] + ' - cleaned ' + data.data['cleaned']);
        } else {
            console.error('scan error', data.error);
            log.error('scan error');
        }
    });

    post.fail(function() {
        console.error('scan post error');
        log.error('scan post error');
    });
};

eg.populateImages = function(images) {
    var parent = document.getElementById('images');
    util.removeChildren(parent);

    images.forEach(function(el) {
        var col = document.createElement('div');
        parent.appendChild(col);
        col.className = 'col-md-2';

        var form = document.createElement('form');
        col.appendChild(form);
        form.originallyShown = '' + el.show;

        var tile = document.createElement('div');
        form.appendChild(tile);
        tile.className = 'tile';
        if( el.isNew) {
            tile.className += ' new';
        }

        var newIndicator = document.createElement('div');
        tile.appendChild(newIndicator);
        newIndicator.className = 'indicator';
        newIndicator.innerHTML = 'NEW';
        newIndicator.onclick = eg.hideNew;

        var header = document.createElement('p');
        tile.appendChild(header);
        header.innerHTML = el.name;
        if( util.isOverflowed(header)) {
            header.title = el.name;
        }

        var hiddenName = document.createElement('input');
        tile.appendChild(hiddenName);
        hiddenName.type = 'hidden';
        hiddenName.name = 'name';
        hiddenName.value = el.name;

        var btnGroup = document.createElement('div');
        tile.appendChild(btnGroup);
        btnGroup.className = 'btn-group btn-group-sm';
        btnGroup.setAttribute('data-toggle', 'buttons');
        btnGroup.appendChild(eg.buildRadioButton('Show', 'true' , 'btn-show',  el.show));
        btnGroup.appendChild(eg.buildRadioButton('Hide', 'false', 'btn-hide', !el.show));

        var img = document.createElement('img');
        tile.appendChild(img);
        img.src = eg.GALLERY_ROOT + el.name;
        img.name = el.name;
        img.className = 'img-thumbnail';
        img.onclick = eg.zoom;

        var caption = document.createElement('textarea');
        tile.appendChild(caption);
        caption.rows = 3;
        caption.name = 'caption';
        caption.value = el.caption;
        caption.originalValue = el.caption == null ? '' : el.caption;
        caption.onchange = eg.onChange;
        caption.onkeyup = eg.onChange;

        var save = document.createElement('button');
        tile.appendChild(save);
        save.type = 'button';
        save.name = 'save';
        save.className = 'save btn btn-danger';
        save.style.display = 'none';
        save.innerHTML = 'Save';
        save.onclick = eg.save;
    });
};

eg.buildRadioButton = function(text, value, className, active) {
    var label = document.createElement('label');
    label.className = 'btn ' + className;
    label.onclick = eg.onChange;

    var input = document.createElement('input');
    label.appendChild(input);
    input.type = 'radio';
    input.name = 'show';
    input.value = value;

    if( active) {
        label.className += ' active';
        input.checked = true;
    }

    label.appendChild(document.createTextNode(text));

    return label;
};

eg.zoom = function() {
    var wrapper = document.getElementById('wrapper');
    var title = document.getElementById('title');
    var zoom = document.getElementById('zoom');
    var img = document.getElementById('img');
    var header = document.getElementById('header');
    var footer = document.getElementById('footer');
    var $window = $(window);
    var form = $(this).closest('form').get(0);

    var padding = 10;
    var maxHeight = $window.height() - (padding + padding);
    var maxWidth = $window.width() - (padding + padding);
    img.src = this.src;
    img.style.maxHeight = maxHeight + 'px';
    img.style.maxWidth = maxWidth+ 'px';
    wrapper.style.visibility = 'hidden';
    var originalHeight = img.height;
    document.getElementById('popup').style.display = '';
    var width = $(img).width();
    var height = $(img).height();
    wrapper.style.top = (padding + ((maxHeight - height) / 2)) + 'px';
    wrapper.style.left = (padding + ((maxWidth - width) / 2)) + 'px';

    header.style.width = width + 'px';
    footer.style.width = width + 'px';
    footer.innerHTML = form.caption.value;
    zoom.innerHTML = ((height / originalHeight) * 100).toFixed(0) + '%';
    title.innerHTML = form.name.value;
    wrapper.style.visibility = '';
};

eg.hide = function() {
    document.getElementById('popup').style.display = 'none';
};

eg.onChange = function() {
    var form = this.form;

    setTimeout(function() {
        if( form.originallyShown !== form.show.value) {
            form.save.style.display = '';
        } else if( form.caption.originalValue.trim() !== form.caption.value.trim()) {
            form.save.style.display = '';
        } else {
            form.save.style.display = 'none';
        }
    }, 0);
};

eg.save = function() {
    var form = this.form;
    form.caption.value = form.caption.value.trim();
    var post = $.post( '/src/gallery/editGallery.php', $(form).serialize() + '&action=save');

    post.done(function( jsonString ) {
        var data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error('failed to parse save response', e);
            log.error('failed to parse save response');
            data = {result: 'json error', 'error': jsonString};
            if(e.message === 'Unexpected token <') {
                document.getElementById('images').innerHTML = jsonString;
            }
        }

        if( data.result == 'success') {
            form.save.style.display = 'none';
            form.caption.originalValue = form.caption.value;
            form.originallyShown = form.show.value;
            $(form).find('.tile').removeClass('new');
            log.success('saved');
        } else {
            console.error('save error', data.error);
            log.error('save error');
        }
    });

    post.fail(function() {
        console.error('save post error');
        log.error('save post error');
    });
};

$(document).ready(eg.setup);