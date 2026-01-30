function clearTimers() {
    clearInterval(Global.gameInterval);
    Global.gameInterval = null;
}

// show "get ready" layout
function onDictTrClicked(di) {
    clearTimers();
    loadDictionary(di);
    setLayout(LayoutsEnum.pre);
}

// start new game
function startExplaining() {
    // layout
    setLayout(LayoutsEnum.game);
    Global.timerDiv = $("#gameTimer"); // timer div element to display time

    // start timer
    Global.gameWordStartMs = Global.gameStartMs = (new Date()).getTime();
    Global.gameInterval = setInterval(displayTime, 100);

    // show word
    Global.currentWordsList = [];
    Global.currentWord = "";
    showNewWord();
}

function showNewWord() {
    Global.currentWord = generateNextWord();
    $("#wordsCountDiv").html(countPoints());
    $("#gameWordDiv").html(wrapCentered(
                "<div class='hintToTouch'>"+localed('explain the word:')+"</div>"
                + "<span id='gameWord'>" + Global.currentWord + "</span>"
                + "<div class='hintToTouch'>"+localed('touch the screen when it\'s guessed')+"</div>"
    ));
    $("#gameWord").css("font-size", calcWordFontSize());
}

// based on Global.currentWord.length, calcs word size
function calcWordFontSize() {
    var s = Math.floor(13.6 * 12 / Global.currentWord.length);
    // max width = for a 7-letter word
    const maxWidth = Math.floor(13.6 * 12 / 7);
    if (s > maxWidth)
        s = maxWidth;
    return s + "vw";
}

// user clicked on the word, marking it as guessed
// \param g guessed (1 if guessed, 0 if skipped)
function onWordGuessed(g) {
    Global.currentWordsList.push({"w": Global.currentWord, "g": g});

    if (Global.gameInterval === null) { // after time is up
        onGameTimeUp();
    } else { // still have time
        $("#gameWordDiv").effect( "highlight", {color: (g == 0 ? '#f00' : "#0f0")}, 300 );
        showNewWord();
    }

}

// guessed last word after the time was up
function onGameTimeUp() {
    // finishing the game
    clearTimers();
    setLayout(LayoutsEnum.list);

    // showing list
    $("#ResultCountDiv").html(localed("Result: ") + countPoints());
    $("#listLay").html(listTableHtml());
}

function displayTime() {
    var diff = (new Date()).getTime() - Global.gameStartMs;

    if (diff >= 0) {
        var left = Global.durationOptions[Global.durationIndex] - (diff/1000);
        var label = secToString(left + 1);
        if (left < 0) {
            clearTimers();
            Global.timerDiv.html(localed("Last word"));
        } else {
            Global.timerDiv.html(label);
        }
    } else {
        console.error("diff<0?");
    }
}

function changeDuration() {
    if (Global.disappearTo)
        clearTimeout(Global.disappearTo);

    if ((++Global.durationIndex) >= Global.durationOptions.length)
        Global.durationIndex = 0;

    saveLocal("durationIndex", Global.durationIndex);

    var sec = Global.durationOptions[Global.durationIndex];
    var text = makeIcon("stopwatch-2") + "<br>" +  localed("Round duration: ") + sec;

    const displayTimeWindowMs = 900; // time in milliseconds to display time hint
    $("#gameDurationMsg").stop().animate({opacity:'100'}).show().html(wrapCentered(text));
    Global.disappearTo = setTimeout(function () {$("#gameDurationMsg").fadeOut( "slow", function() {})}, displayTimeWindowMs);
}

function starDictionary(di) {
    di.starred = !di.starred;
    onAllDictsLoaded();
    saveLocal("dicts", JSON.stringify(Global.dicts));
}

// returns amount of points
// \param skipIsMinus skipped word counts as -1 point
function countPoints(skipIsMinus = true) {
    var pts = 0;
    const pontsForSkip = (skipIsMinus ? -1 : 0);
    Global.currentWordsList.forEach(function (w) {
        pts += (w["g"] == 1 ? 1 : pontsForSkip);
    });
    return pts;
}
