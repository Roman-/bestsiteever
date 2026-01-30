// wordsets is a temp solution containing all dictionaries for the game
// dictionary URL: ./dicts/{lang}/{id}.txt
Global.dicts = [
                                                                                          // Russian - basic dicts
    {
        name: "Разминка",
        descr: "Топ-2000 существительных русского языка",
        lang: "RU",
        id:   "rus-easy"
    },
    {
        name: "Среденький",
        descr: "Существительные русского языка, чуть посложнее",
        lang: "RU",
        id: "rus-moderate"
    },
    {
        name: "Интересный",
        descr: "Слова, встречающиеся с 10000ной позиции в частотном словаре русского языка",
        lang: "RU",
        id: "rus-hard"
    },
    {
        name: "Микс",
        descr: "Слова разной сложности. Микс всех возможных словарей",
        lang: "RU",
        id: "rus-mix"
    },
                                                                                          // English - basic dicts
    {
        name: "Top nouns",
        descr: "Most frequently used english nouns",
        lang: "EN",
        id: "en-easy"
    },
    {
        name: "Harder",
        descr: "Not-so-trivial English nouns",
        lang: "EN",
        id: "en-moderate"
    },
    {
        name: "Basic",
        descr: "Simple English words of all parts of speech, that should be easy to explain",
        lang: "EN",
        id: "en-basic-all"
    },
                                                                                          // Russian - fun dicts

    {
        name: "Леди",
        descr: "Мужские слова из Алиас: Леди против джентльменов ",
        lang: "RU",
        id: "ladies"
    },
    {
        name: "Джентльмены",
        descr: "Женские слова из Алиас: Леди против джентльменов ",
        lang: "RU",
        id: "gentleman"
    },
    {
        name: "Страны мира",
        descr: "193 государства ООН",
        lang: "RU",
        id: "ru-countries"
    },
    {
        name: "Московский метрополитен",
        descr: "Все станции метро Москвы",
        lang: "RU",
        id: "mosmetro"
    },
    {
        name: "Цветочки",
        descr: "Финальные слова VI чемпионата СПб по шапке vk.com/playthehat",
        lang: "RU",
        id: "ru-spb-hat"
    },
    {
        name: "Спидкубинг",
        descr: "Словарь спидкубера",
        lang: "RU",
        id: "ru-speedcubing"
    },
    {
        name: "Имена",
        descr: "Имена, женские и мужские. Редкие и очень редкие. Александр, Галактион, Джим, Илзе, Хаджимурат.",
        lang: "RU",
        id: "ru-names"
    },
    {
        name: "Таблица Менделеева",
        descr: "118 элементов таблицы Менделеева",
        lang: "RU",
        id: "ru-mendeleev"
    },
    {
        name: "Города России",
        descr: "Все города РФ. Саранск, Феодосия, Ртищево, Ялуторовск...",
        lang: "RU",
        id: "ru-towns"
    },
    {
        name: "Питерский метрополитен",
        descr: "Все станции метро Санкт-Петербурга",
        lang: "RU",
        id: "spbmetro"
    },
    {
        name: "The hat 16",
        descr: "Слова для тренировки",
        lang: "RU",
        id: "rus-hat16"
    },
                                                                                          // English - fun dicts
    {
        name: "Countries",
        descr: "List of the countries of the world",
        lang: "EN",
        id: "en-countries"
    },
    {
        name: "Chemical elements",
        descr: "118 chemical elements",
        lang: "EN",
        id: "en-mendeleev"
    },
    {
        name: "London metro",
        descr: "List of London Underground stations",
        lang: "EN",
        id: "london-metro"
    },
];

function loadDictionary(dict) {
    Global.currentDict = dict;
    Global.wordSetIndex = parseInt(loadLocal("wordIndex" + Global.currentDict.id, '0'));
    return;
}

function generateNextWord() {
    var result = Global.currentDict.words[Global.wordSetIndex];
    Global.wordSetIndex++;
    if (Global.wordSetIndex >= Global.currentDict.words.length) {
        Global.wordSetIndex = 0;
        setTimeout(onTraversedDictionary, 100);
    }
    saveLocal("wordIndex" + Global.currentDict.id, Global.wordSetIndex);
    return result;
}

// happens when dictionary completely traversed - need to shuffle it again.
function onTraversedDictionary() {
    console.warn("dictionary " + Global.currentDict.id + " traversed. Shuffling and saving...");
    shuffle(Global.currentDict.words);
    saveLocal("dicts", JSON.stringify(Global.dicts));
}
