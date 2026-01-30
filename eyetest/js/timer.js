var startMilliseconds, stopMiliseconds; // date and time when timer was started
var running = false;

var timeout;

function msToHumanReadable(duration, useMilli) {
    duration = Global.gameTimeout*1000 - duration;
    if (duration < 5000)
        timer.className = "timer_red";
    var milliseconds = parseInt((duration%1000)/10)
        , centiseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && (minutes > 0 || hours > 0)) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

    hoursString = (hours == 0) ? "" : hours + ":";
    minutesString = (minutes == 0) ? "" : minutes + ":";

    return hoursString + minutesString + seconds + "." + (useMilli ? milliseconds : centiseconds);
}

function stopTimer() {
    if (running) {
        running = false;
        clearTimeout(timeout);

        var d = new Date();
        stopMiliseconds = d.getTime();
        timer.innerHTML = msToHumanReadable(stopMiliseconds - startMilliseconds, true);
        timer.className = "timer_stopped";

        return;
    }
}

function startTimer() {
    var d = new Date();
    startMilliseconds = d.getTime();
    running = true;
    timeout = setInterval(displayTime, 100);
    timer.className = "timer_running";
}

function displayTime() {
    if (running) {
        var d = new Date();
        var diff = d.getTime() - window.startMilliseconds;
        if (diff >= 0)
            timer.innerHTML = msToHumanReadable(diff, false);
        if (diff >= Global.gameTimeout * 1000) {
            stopTimer();
            gameOver();
        }
    }
}
