$(document).ready(function() {
    Glob.boardContainer = $("<div class='col-sm-6 col-12 mt-1' id='boardContainer'></div>");
    Glob.infoDiv = $("<div class='text-secondary mt-2' id='infoDiv'></div>");

    loadSettings();
    initBoard();
    initMenu();

    loMain();

    window.oncontextmenu = onContextMenu;
    window.onkeydown = windowKd;
    window.onkeyup = windowKup;
});

// returns virtual shift jquery obj
function createVs() {
    return $("<div class='w-100 text-center rounded noselect' id='virtShift'></div>")
        .html("shift")
        .on('touchstart',vsTs).on('touchend',vsTe).on('mousedown',vsMd).on('mouseup',vsMu).on('mouseleave',vsMu);
}

// returns glass jquery object
function createGlass() {
    return $("<div id='glass'></div>")
        .on('mouseout', glassMout)
        .on('mousemove', glassMm)
        .on('mousedown', glassMd)
        .on('touchstart', glassTs);
}

// returns text with information
function infoText() {
    let txt = $("<div><p>Controls: <strong>left click</strong> to make move, <strong>right click</strong> for inverse move, <strong>Esc</strong> to reset, <strong>spacebar</strong> to scramble.</p><p>Keyboard contorls: <strong>UIJK</strong> or <strong>Numpad</strong> to make moves, <strong>shift+UIJK</strong> and <strong>shift+Numpad</strong> to make inverse moves.</p></div>");
    let div = $("<div></div>").append(txt);
    let btn = $("<button class='btn btn-outline-secondary form-control'></button>").html('Enable timer').click(function () {
        Glob.showTimer = true;
        saveLocal('Glob.showTimer', true);
        displayTime('ready');
        $(this).hide();
    });
    if (!Glob.showTimer)
        div.append(btn);
    return div;
}

function initMenu() {
    // $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
}

