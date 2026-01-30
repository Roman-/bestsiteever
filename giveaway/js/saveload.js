/// \value stringified json object or standard type
/// \returns true if succeed
function saveLocal(name, value) {
    // If the platform supports localStorage, then save the value
    try {
        localStorage.setItem(name, value);
        return true;
    }
    catch(e) {
        // Most likely cause of errors is a very old browser that doesn't support localStorage (fail silently)
        console.warn("saving error");
        return false;
    }
}

/// \returns loaded value or specified defaultValue in case of error
function loadLocal(name, defaultValue) {
    // If the platform supports localStorage, then load the selection
    try {
        var result = localStorage.getItem(name);
        return (result === null) ? defaultValue : localStorage.getItem(name);
    }
    catch(e) {
        // Either no selection in localStorage or browser does not support localStorage (fail silently)
        console.warn("can\'t load from localstorage");
        return defaultValue;
    }
}

function loadStyle() {
    var defaultStyle = $("#styleSheet").html();
}

function saveAll() {
    saveLocal("giveawayStyle", $("#bodycss").val());
    saveLocal("giveawayCompName", $("#compNameInput").val());
    saveLocal("giveawayStrings", $("#strings").val());
}

function loadAll() {
    // load style
    var loadedStyle = loadLocal("giveawayStyle", Global.defaultStyle);
    $("#styleSheet").html(loadedStyle);
    $("#bodycss").val(loadedStyle);

    $("#title").html(loadLocal("giveawayCompName", "Live giveaway"));
    $("#compNameInput").val(loadLocal("giveawayCompName", "Live giveaway"));
    $("#strings").val(loadLocal("giveawayStrings", Global.defaultNames));
}

function Global(){}
Global.defaultStyle = `body {
    background: url("https://pp.userapi.com/c854420/v854420811/397b8/y0mtDpFVKi8.jpg") no-repeat center center fixed;
    background-size: cover;
    color: #002;

}
#title {
    font-family:"Lucida Console", Monaco, monospace;
    font-size: 50px;
    text-align: right;
}
#name {
    font-size: 100px;
    color: #003;
    width: 100%;
    text-align: center;
}
`;
Global.defaultNames = `Mats Valk
Sebastian Weyer
Philipp Weyer
Michał Rzewuski
Alexandre Carlier
Kevin Gerhardt
Antonie Paterakis
Ciarán Beahan
Martin Vædele Egdal
Richard Delacoste
Andrey Che
Michał Pleskowicz
Cornelius Dieckmann
Dario Roa Sánchez
Daniel Rose-Levine
Antoine Cantin
Maciej Czapiewski
Jakob Gunnarsson
Pablo Contreras
Henri Gerber
`
