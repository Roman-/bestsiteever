function setLayout(lay) {
    // header is always visible
    setHeaderContent(lay);
    // footer is only invisible on 'pre' layout (get ready)
    changeVisibility($('#footer'), (lay != LayoutsEnum.pre));
    changeVisibility($('#footer-placeholder'), (lay != LayoutsEnum.pre));
    setFooterContent(lay);

    // set visibility of layout
    changeVisibility($('#selectDict'), (lay == LayoutsEnum.main));
    changeVisibility($('#pressToStart'), (lay == LayoutsEnum.pre));
    changeVisibility($('#gameWordDiv'), (lay == LayoutsEnum.game));
    changeVisibility($('#listLay'), (lay == LayoutsEnum.list));
    changeVisibility($('#helpLay'), (lay == LayoutsEnum.help));

    prepareTranslations();
}

function setHeaderContent(lay) {
    var content = "layout: " + lay;
    if (lay == LayoutsEnum.main) {
        content = mainHeaderHtml();
    } else if (lay == LayoutsEnum.pre) {
        content = getReadyHeaderHtml();
    } else if (lay == LayoutsEnum.game) {
        content = gameHeaderHtml();
    } else if (lay == LayoutsEnum.list) {
        content = listHeaderHtml();
    } else if (lay == LayoutsEnum.help) {
        content = helpHeaderHtml();
    }
    $('#header').html(wrapCentered(content));
}
function setFooterContent(lay) {
    var content = "layout: " + lay;
    if (lay == LayoutsEnum.main || lay == LayoutsEnum.help) {
        content = mainMenuHtml();
    } else if (lay == LayoutsEnum.pre) {
        content = "(this is not visible)";
    } else if (lay == LayoutsEnum.game) {
        content = timerFooterHtml();
    } else if (lay == LayoutsEnum.list) {
        content = listFooterHtml();
    }
    $('#footer').html(content);
}

// returns inner html for main header (game name)
function mainHeaderHtml() {
    return "<span id='mainheader' class='glow'>"+ localed("Quick Alias") + "</span>";
}

// returns inner html for main menu (buttons on the bottom)
function mainMenuHtml() {
    var s = "";
    s += "<table id='mainMenuTable'><tr>";

    s += "<td onclick='onHelpClicked()' id='helpBtnTd'>"+makeIcon("lifebuoy")+"</td>";
    s += "<td onclick='onDayNightClicked();'>"+makeIcon("idea")+"</td>";
    s += "<td onclick='changeLocale()' id='changeLocaleTd'>"+makeFlagIcon(Global.uiLang[Global.uiLangIndex])+"</td>";
    s += "<td onclick='changeDuration()'>"+makeIcon("stopwatch-2")+"</td>";
    s += "<td onclick='toggleFullscreen()' id='fullscreenId'>"+makeIcon("television")+"</td>";

    s += "</table></tr>";
    return "<div id='mainmenu'>" + s + "</div>";
}

// returns TableRow html for specific dictionary
// \param di dictionary object
function dictTrHtml(di) {
    var starTd = $("<td class='dictStarTd'></td>").append(starIcon(di)).
        click(function(){starDictionary(di)});
    var nameTd = $("<td></td>").html("<div class='dictName'>"+di.name+"</div><div class='dictDescr'>"+di.descr+"</div>")
        .click(function(){onDictTrClicked(di)});
    var infoTd = $("<td class='dictInfoTd' id='dictInfo"+di.id+"'></td>").html("loading...");
    var tr = $("<tr class='dictTr' id='dictTr-"+di.id+"'></tr>")
        .append(starTd)
        .append(nameTd)
        .append(infoTd);
    return tr;
}

// returns home button html code
function homeButtonHtml() {
    return "<img src='img/icons/home-1.png' class='homeBtn' onclick='setLayout(LayoutsEnum.main)'/>";
}
// returns exit (skip round and show list) button html code
function exitButtonHtml() {
    return "<img src='img/icons/exit-1.png' class='exitBtn' onclick='onGameTimeUp()'/>";
}

function getReadyHeaderHtml() {
    return "<table class='tableThreeCols'><tr><td>"+homeButtonHtml()+"</td>"+
        "<td id='readyTd'>"+localed("Ready?")+"</td><td></td></tr></table>";
}

function helpHeaderHtml() {
    return "<table class='tableThreeCols'><tr><td>"+homeButtonHtml()+"</td>"+
        "<td>" +localed("How to")+ "</td><td></td></tr></table>";
}

// returns html for "skip current word" button in footer
function skipBtnHtml() {
    return "<div id='skipBtnWrap' onclick='onWordGuessed(0)'><span id='skipBtnLabel'>"+localed("skip word")+"</span></div>"
}

// \returns footer html for GAME layout (timer, "skip" button)
function timerFooterHtml() {
    return "<table id='timerFooterTable' class='tableThreeCols'><tr><td></td>"+
        "<td><span id='gameTimer'>timer</span></td>"+"<td>"+skipBtnHtml()+"</td></tr></table>";
}

// returns header html for GAME mode
function gameHeaderHtml() {
    return "<table class='tableThreeCols'><tr><td>"+homeButtonHtml()+"</td>"+
        "<td><span id='wordsCountDiv'></span></td><td>"+exitButtonHtml()+"</td></tr></table>";
}

function listHeaderHtml() {
    return "<table class='tableThreeCols'><tr><td>"+homeButtonHtml()+"</td>"+
        "<td><span id='ResultCountDiv'></span></td><td></td></tr></table>";
}

// returns html of list of guessed words
function listTableHtml() {
    var s = "";
    var i = 0;
    Global.currentWordsList.forEach(function(w) {
        s += "<tr>";
        s += "<td class='listNumber'>" + (w["g"] == 1 ? (++i + ".") : makeCrossSign()) + "&nbsp;</td>";
        s += "<td class='listWord'>" + w["w"] + "</td>";
        s += "<td class='listGoogle'>" + makeGoogleUrl(w["w"]) + "</td>";
        s += "</tr>";
    });
    return "<table class='resultList'>" + s + "</table>";
}

function listFooterHtml() {
    var s = wrapCentered("<span id='listFooterNextBtn'>"+localed("Next")+"</span>");
    s = "<div class='clickable' onclick='setLayout(LayoutsEnum.pre)'>" + s + "</div>";
    return s;
}

// returns STAR icon JQuery element for dictionary {di}
function starIcon(di) {
    var src = "img/icons/star-" + (di.starred ? "gold":"empty") + ".png";
    return $("<img></img>").addClass("icon").attr("src", src);
}

// change layout to help. If it is currently displayed, change to home.
function onHelpClicked() {
    if ($("#helpLay").is(":visible")) {
        setLayout(LayoutsEnum.main);
        $("#helpBtnTd").html(makeIcon("lifebuoy"));
    } else { // displaying help layout
        setLayout(LayoutsEnum.help);
        $("#helpBtnTd").html(makeIcon("home-1"));
    }
}
