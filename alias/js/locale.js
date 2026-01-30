function changeLocale() {
    Global.uiLangIndex = (Global.uiLangIndex + 1) % Global.uiLang.length;
    // re-draw existing labels
    prepareTranslations();

    saveLocal("uilang", Global.uiLangIndex);
}

// returns the word \param w translated to language specified in Global.currentLocale
function localed(w) {
    var currentLocale = Global.uiLang[Global.uiLangIndex];
    if (!Global.localeMap.hasOwnProperty(w)) {
        console.error("No such locale " + w);
        return w;
    }
    var options = Global.localeMap[w];
    if (options.hasOwnProperty(currentLocale))
        return options[currentLocale];
    else
        console.error("No locale thing for " + w + " for language " + currentLocale);
    return w;
}

// puts {label} into element {elId}
// param {centeredWrap} wrap content with <div> for centering things
function putLocaledLabel(elId, label, centeredWrap) {
    var el = $("#" + elId);
    if (el) {
        var s = localed(label);
        if (centeredWrap)
            s = wrapCentered(s);
        el.html(s);
    }
}

Global.localeMap = {
    "Press to start": {
        "EN": "Press to start",
        "RU": "Нажмите, чтобы начать",
    },
    "Ready?": {
        "EN": "Ready?",
        "RU": "Готовы?",
    },
    "words not loaded": {
        "EN": "Words not loaded",
        "RU": "Слова не загружены",
    },
    "Result: ": {
        "EN": "Result: ",
        "RU": "Результат: ",
    },
    "Last word": {
        "EN": "Last word",
        "RU": "Последнее слово",
    },
    "How to": {
        "EN": "How to",
        "RU": "Правила",
    },
    "skip word": {
        "EN": "skip",
        "RU": "пропустить",
    },
    "Next": {
        "EN": "Next",
        "RU": "Далее",
    },
    "Loading dictionaries...": {
        "EN": "Loading dictionaries...",
        "RU": "Загрузка словарей...",
    },
    "Round duration: ": {
        "EN": "Round duration: ",
        "RU": "Время раунда: ",
    },
    "Quick Alias _title": {
        "EN": "Quick Alias - the Word Explanation Game",
        "RU": "Быстрый Алиас - игра в объяснение слов",
    },
    "Quick Alias": {
        "EN": "Alias",
        "RU": "Алиас",
    },
    "explain the word:": {
        "EN": "explain the word:",
        "RU": "объясните слово:",
    },
    "touch the screen when it's guessed": {
        "EN": "touch the screen when it's guessed",
        "RU": "коснитесь экрана, когда его отгадают",
    },
    "": {
        "EN": "",
        "RU": "",
    },
    "": {
        "EN": "",
        "RU": "",
    },
}
