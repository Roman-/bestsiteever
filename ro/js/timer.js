function Timer() {}
Timer.ih = null; // interval (handle)
Timer.canStart = false; // only can start timer when fairly scrambled
Timer.isRunning = false; // when the timer was started
Timer.startMs = null; // when the timer was started
Timer.stopMs = null; // when the timer was stopped
Timer.jqTimer = null;

// put S inside timer thing
function displayTime(s) {
    if (null === Timer.jqTimer)
        Timer.jqTimer = $("#timer");
    Timer.jqTimer.html(Glob.showTimer ? s : getPuzzleName());
}

function startTimer() {
    if (null !== Timer.ih) {
        console.warn("start timer called when handle isnt null");
    }
    Timer.startMs = (new Date()).getTime();
    Timer.isRunning = true;
    Timer.canStart = false;

    Timer.ih = setInterval(onTupd, 50);
    Timer.stopMs = null;
}

function resetTimer() {
    if (Timer.ih !== null) {
        clearInterval(Timer.ih);
        Timer.ih = null;
        Timer.stopMs = null;
    }
    if (Timer.isRunning)
        displayTime("ready");
    Timer.isRunning = false;
    Timer.canStart = false;
    Timer.jqTimer.css('font-weight', '');
}

function stopTimer() {
    if (null !== Timer.stopMs)
        return;
    Timer.isRunning = false;
    Timer.stopMs = (new Date()).getTime();
    addTimeToList(Timer.stopMs - Timer.startMs);
    var res = msToHumanReadable(Timer.stopMs - Timer.startMs);
    clearInterval(Timer.ih);
    Timer.ih = null;
    Timer.canStart = false;
    displayTime(res);
    Timer.jqTimer.css('font-weight', 700);
}

// on timer update
function onTupd() {
    var diff = (new Date()).getTime() - Timer.startMs;
    if (diff >= 0)
        displayTime(msToHumanReadable(diff));
}

