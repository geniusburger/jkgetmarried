countdownTimer = {};

countdownTimer.handle = null;

countdownTimer.createFutureDate = function (days, hours, minutes, seconds) {
    return new Date(new Date().getTime() + ((((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000));
};

countdownTimer.initialize = function (futureDate, target, labels, data, progress, start) {
    countdownTimer.daysElement = $(data[0]);
    countdownTimer.hoursElement = $(data[1]);
    countdownTimer.minutesElement = $(data[2]);
    countdownTimer.secondsElement = $(data[3]);
    countdownTimer.daysLabelElement = $(labels[0]);
    countdownTimer.hoursLabelElement = $(labels[1]);
    countdownTimer.minutesLabelElement = $(labels[2]);
    countdownTimer.secondsLabelElement = $(labels[3]);
    countdownTimer.progressElement = progress;
    countdownTimer.target = $(target);

    countdownTimer.daysElement.addClass('non-zero');
    countdownTimer.hoursElement.addClass('non-zero');
    countdownTimer.minutesElement.addClass('non-zero');
    countdownTimer.secondsElement.addClass('non-zero');
    countdownTimer.daysLabelElement.addClass('non-zero');
    countdownTimer.hoursLabelElement.addClass('non-zero');
    countdownTimer.minutesLabelElement.addClass('non-zero');
    countdownTimer.secondsLabelElement.addClass('non-zero');

    countdownTimer.setFutureDate(futureDate);
    if (start) {
        countdownTimer.start();
    }
};

countdownTimer.updateDisplay = function () {
    countdownTimer.daysElement.text(countdownTimer.days);
    countdownTimer.hoursElement.text(countdownTimer.hours);
    countdownTimer.minutesElement.text(countdownTimer.minutes);
    countdownTimer.secondsElement.text(countdownTimer.seconds);
    countdownTimer.progressElement.style.width = Math.max(Math.min(100 * (59 - countdownTimer.seconds) / 59, 100), 0) + "%";

    var zero = true;
    if (countdownTimer.days === 0) {
        countdownTimer.daysElement.removeClass('non-zero');
        countdownTimer.daysLabelElement.removeClass('non-zero');
        if (countdownTimer.hours === 0) {
            countdownTimer.hoursElement.removeClass('non-zero');
            countdownTimer.hoursLabelElement.removeClass('non-zero');
            if (countdownTimer.minutes === 0) {
                countdownTimer.minutesElement.removeClass('non-zero');
                countdownTimer.minutesLabelElement.removeClass('non-zero');
                if (countdownTimer.seconds === 0) {
                    countdownTimer.secondsElement.removeClass('non-zero');
                    countdownTimer.secondsLabelElement.removeClass('non-zero');
                }
            }
        }
    }
};

countdownTimer.setFutureDate = function (futureDate) {
    countdownTimer.target.html(futureDate.toDateString() + '<wbr/> ' + futureDate.toLocaleTimeString().replace(/:\d\d /, ' '));

    var milliseconds = futureDate.getTime() - new Date().getTime();
    if (milliseconds < 0) {
        milliseconds = 0;
    }
    countdownTimer.seconds = Math.floor(milliseconds / 1000);

    countdownTimer.days = Math.floor(countdownTimer.seconds / 86400);
    countdownTimer.seconds -= countdownTimer.days * 86400;

    countdownTimer.hours = Math.floor(countdownTimer.seconds / 3600);
    countdownTimer.seconds -= countdownTimer.hours * 3600;

    countdownTimer.minutes = Math.floor(countdownTimer.seconds / 60);
    countdownTimer.seconds -= countdownTimer.minutes * 60;

    countdownTimer.updateDisplay();
};

countdownTimer.start = function () {
    if (!countdownTimer.running && countdownTimer.isTimeRemaining()) {
        countdownTimer.running = true;
        countdownTimer.handle = window.setInterval(countdownTimer.tick, 1000);
    }
};

countdownTimer.isTimeRemaining = function () {
    return countdownTimer.seconds || countdownTimer.minutes || countdownTimer.hours || countdownTimer.days;
};

countdownTimer.tick = function () {

    // Don't tick if the timer is no longer running
    if (!countdownTimer.running) {
        return;
    }

    // Decrement the seconds
    countdownTimer.seconds--;

    // Cascade the decrement if necessary
    if (countdownTimer.seconds < 0) {
        countdownTimer.seconds = 59;
        countdownTimer.minutes--;
        if (countdownTimer.minutes < 0) {
            countdownTimer.minutes = 59;
            countdownTimer.hours--;
            if (countdownTimer.hours < 0) {
                countdownTimer.hours = 23;
                countdownTimer.days--;
                if (countdownTimer.days < 0) {
                    // This should never happen since the countdown should stop when it gets to 0
                    countdownTimer.days = 0;
                    countdownTimer.hours = 0;
                    countdownTimer.minutes = 0;
                    countdownTimer.seconds = 0;
                    countdownTimer.running = false;
                    console.error("time exceeded");
                }
            }
        }
    }

    countdownTimer.updateDisplay();
    if (!countdownTimer.isTimeRemaining()) {
        countdownTimer.running = false;
        window.clearInterval(countdownTimer.handle);
        alert('The wedding is starting!');
    }
};