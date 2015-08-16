
game = {};

game.running = false;
game.stopping = false;

game.lives = 0;

game.livesSpan = null;
game.$div = null;

game.toggle = function($root) {
    if( !game.running) {
        game.start($root);
    } else if(!game.stopping) {
        game.stop();
    }
};

game.start = function($root) {
    game.running = true;
    game.lives = 1;
    var div = document.createElement('div');
    game.$div = $(div);
    div.className = 'lives';
    var span = document.createElement('span');
    span.id = 'lives';
    span.innerHTML = game.lives;
    game.livesSpan = span;
    div.appendChild(span);
    div.appendChild(document.createTextNode(' Lives'));
    game.$div.hide();
    $root.append(div);

    game.keydown.codes.forEach(function(code) {
        if( code.code.length > game.keydown.maxKeys) {
            game.keydown.maxKeys = code.code.length;
        }
        code.codeString = code.code.toString();
    });

    $(document).bind('keydown', game.onkeydown);
    game.$div.slideDown('slow');
};

game.stop = function() {
    game.stopping = true;
    game.running = false;
    $(document).unbind('keydown', game.onkeydown);
    game.adjustLives(-game.lives, 70);
};

game.stopped = function() {
    game.$div.slideUp('slow', function(){
        game.$div.remove();
        game.running = false;
        game.stopping = false;
        $(document).unbind('keydown', game.onkeydown);
    });
};

game.updateLives = function() {
    if( game.livesSpan) {
        game.livesSpan.innerHTML = game.lives;
    }
};

game.loseLife = function() {
    if( game.running) {
        game.adjustLives(-1);
    }
};

game.gainLife = function() {
    if( game.running) {
        game.adjustLives(1);
    }
};

game.adjustLives = function(amount, adjustDelay) {
    if( game.lives !== 0) {
        var adjustment = amount > 0 ? 1 : -1;
        game.lives += adjustment;
        game.updateLives();
        amount -= adjustment;
        if (amount !== 0) {
            setTimeout(function () {
                game.adjustLives(amount, adjustDelay);
            }, adjustDelay || 0);
        }
    }
    if( game.lives === 0) {
        setTimeout(game.stopped, 1000);
    }
};

game.keydown = {
    keys : [],
    maxKeys : 0,
    codes : [{
        name : 'Konami',
        code : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        codeString : '',
        handler : function() {
            game.adjustLives(30, 90);
        }
    }]
};

game.onkeydown = function(e) {
    game.keydown.keys.push(e.keyCode);
    if( game.keydown.keys.length > game.keydown.maxKeys) {
        game.keydown.keys.shift();
    }
    var keyString = game.keydown.keys.toString();
    game.keydown.codes.forEach(function(code){
        if(keyString.indexOf(code.codeString) !== -1) {
            //alert(code.name + ' code!');
            code.handler();
        }
    });
};