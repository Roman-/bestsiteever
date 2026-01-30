$(document).ready(function() {
    Glob.nightMode = (loadLocal('Glob.nightMode', false) === 'true');
    Glob.lang = loadLocal('scrabbleLang');

    initMenu();
    applyDayNightMode();

    //loAnalyzer('ru', '5x5', 'порак');

    quickStart();
});

function initMenu() {
    $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
    $("#menuNightmode").click(toggleNightMode);
    $("#loStartAnalyzer").click(loStartAnalyzer);
    $("#loNewGame").click(loNewGame);
    $("#loAiAi").click(loAiAi);
}

function quickStart() {
    if (!Glob.lang)
        loQuickStart(); // hello msg +select your lang
    else
        startGameWithPc(Glob.lang, 2, 5); // start immidiately
}

// switching Glob.nightMode value to opposite and re-draws interface
function toggleNightMode() {
    Glob.nightMode = (Glob.nightMode) ? false : true;
    saveLocal("Glob.nightMode", Glob.nightMode);
    applyDayNightMode();
}

// depending on Glob.nightMode, makes interface dark or light
function applyDayNightMode() {
    if (Glob.nightMode)
        DarkReader.enable();
    else
        DarkReader.disable();
}

// sets title of the application
function changeTitle(s) {
    $("#titleWord").html(s);
}
