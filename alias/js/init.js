$(document).ready(function() {
    initDictionaries();

    setLayout(LayoutsEnum.main);

    bindClickEvent($("#pressToStart"), startExplaining);
    bindClickEvent($("#gameWordDiv"), function() {onWordGuessed(1);});

    Global.uiLangIndex = parseInt(loadLocal("uilang", 0));
    Global.uicolors = parseInt(loadLocal("uicolors", 0));
    Global.durationIndex = parseInt(loadLocal("durationIndex", 3));
    prepareTranslations();
    setStylesheet();

    // test
    //setTimeout(function () {onDictTrClicked(Global.dicts[0]); startExplaining();}, 100);
});

function onDayNightClicked() {
    Global.uicolors = (Global.uicolors + 1)%2;
    setStylesheet();
}

// applies the stylesheet (day or night) depending on global.uicolors
function setStylesheet() {
    var href = (Global.uicolors == 0 ? "css/night.css" : "css/day.css") + "?v" + Global.version;
    $("#gamecolors").attr("href", href);
    $("#metaBarColor").attr("content", Global.uicolors == 0 ? "#161616" : "#C5E0E8");
    saveLocal("uicolors", Global.uicolors);
}

function initDictionaries() {
    $("#selectDict").html("<tr><td id='loadingDicts'><br><br>"+localed("Loading dictionaries...") + "<br><br></td></tr>");
    var loaded = loadLocal("dicts");
    var loadedVersion = loadLocal("version", 0);
    if (loaded == null || Global.version != loadedVersion) {
        var dictsLoaded = 0;
        Global.dicts.forEach(function(dict) {
            dict.words = [localed("words not loaded")];
            dict.starred = false;
            // load an actual set of words
            jQuery.get("dicts/" + dict.lang + "/" + dict.id + ".txt",
                   function(data) {
                       dict.words = toWordSet(data);
                       shuffle(dict.words);
                       dictsLoaded++;
                       if (dictsLoaded == Global.dicts.length) {
                           onAllDictsLoaded();
                           saveLocal("dicts", JSON.stringify(Global.dicts));
                           saveLocal("version", Global.version);
                           console.log("loaded (updated) dictionaries");
                       }
                   });
        });
    } else {
        Global.dicts = JSON.parse(loaded);
        console.log("dictionaries from localstorage");
        onAllDictsLoaded();
    }
}

function onAllDictsLoaded() {
    bubbleStarredDicts();
    $("#selectDict").html("");
    Global.dicts.forEach(function(dict) {
        $("#selectDict").append(dictTrHtml(dict));
        initDictInfo(dict);
    });
    filterDictsLocale();
}

function filterDictsLocale() {
    Global.dicts.forEach(function(dict) {
        var row = $("#dictTr-" + dict.id);
        var toShow = (Global.uiLang[Global.uiLangIndex] == dict.lang);
        var result = toShow ? row.show() : row.hide();
    });
}

function initDictInfo(dict) {
    var id = "#dictInfo" +  dict.id;
    $(id).html("<div class='flag'>"+makeFlagIcon(dict.lang)+"</div><div class='dictWordCount'>"+dict.words.length+"</div>");
}

function prepareTranslations() {
    $("#changeLocaleTd").html(makeFlagIcon(Global.uiLang[Global.uiLangIndex]));
    putLocaledLabel("pressToStart", "Press to start", true);
    putLocaledLabel("gameTitle", "Quick Alias _title", false);
    putLocaledLabel("mainheader", "Quick Alias", false);
    putLocaledLabel("helpLay", "rules", false);
    filterDictsLocale();
}

// puts starred dicts on top of the list
function bubbleStarredDicts() {
    var newDictsList = [];

    Global.dicts.forEach(function(dict) {
        if (dict.starred)
            newDictsList.push(dict);
    });
    Global.dicts.forEach(function(dict) {
        if (!dict.starred)
            newDictsList.push(dict);
    });

    Global.dicts = newDictsList;
}
