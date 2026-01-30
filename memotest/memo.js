var charsString = "";

/* generator */

function randomElement(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

/* table-related */

function classNameByIndex(i, itemsPerRow) {
    var rownum = Math.floor(i / itemsPerRow);
    var alt = (rownum + i - rownum*itemsPerRow)%2;
    return alt ? "c1" : "c2";
}

function generateItem() {
    var s = "";
    var charsPerItem = document.getElementById("in_charsperitem").value;
    var inputChars = document.getElementById("in_chars").value;
    var onlyUseDifferentCharsPerItem = document.getElementById("in_unique").checked;
    for (var i = 0; i < charsPerItem; i++) {
        var ch = randomElement(inputChars);
        s += ch;
        if (onlyUseDifferentCharsPerItem)
            inputChars = inputChars.replace(ch, '');
        if (inputChars.length == 0)
            return nonsenseText();
    }
    return s;
}

function generateTable() {
    charsString = "";
    var s = "<table id='memoTable'>";
    var totalItems = document.getElementById("in_items").value;
    var itemsPerRow = document.getElementById("in_itemsperrow").value;
    for (var i = 0; i < totalItems; i++) {
        if ((i % itemsPerRow) == 0) { // line number
            s += "<tr>";
            s += "<td class='rowNumber'>" + ("00" + Math.ceil((i+1) / itemsPerRow)).slice(-3) + ":</td>";
        }

        var item = generateItem();
        charsString += item;
        s += "<td class=\"" + classNameByIndex(i, itemsPerRow) + "\">" + item + "</td>";

        if (((i+1) % itemsPerRow == 0) || (i == totalItems - 1))
            s += "</tr>";
    }

    return s + "</table>";
}

function generate() {
    document.getElementById("tablePlaceholder").innerHTML = generateTable();
    changeFontSize();
    var currentdate = new Date();
    var datetime =  currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
    console.log("\n" + datetime + "\n" + charsString + "\n\nIn lowercase:\n" + charsString.toLowerCase());
}

function loadPresets() {
    var presets = ["Latin", "Cyrillic", "Decimals", "Binaries", "Suits"];
    var presetsHtml = "";
    presets.forEach(function(el) {
        presetsHtml += "<option value='"+el+"'>"+el+"</option>";
    });
    document.getElementById("in_presets").innerHTML = presetsHtml;
}

function applyPreset() {
    var symbols = "ABCDEFGHIJKLMNOPQRSTUWXYZ", in_items=42, in_charsperitem=2, in_itemsperrow=20, in_unique = false;
    switch(document.getElementById("in_presets").value) {
        case "Latin":
            symbols = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
            in_items = 43;
            in_charsperitem=2;
            in_itemsperrow=10;
            in_unique = true;
            break;
        case "Cyrillic":
            symbols = "АБВГДЕЖЗИКЛМНОПРСТУФХЧШ";
            in_items = 43;
            in_charsperitem=2;
            in_itemsperrow=10;
            in_unique = true;
            break;
        case "Decimals":
            symbols = "0123456789";
            in_items = 50;
            in_charsperitem=2;
            in_itemsperrow=10;
            in_unique = false;
            break;
        case "Binaries":
            symbols = "01";
            in_items = 100;
            in_charsperitem=4;
            in_itemsperrow=10;
            in_unique = false;
            break;
        case "Suits":
            symbols = "♥♦♠♣";
            in_items = 40;
            in_charsperitem=1;
            in_itemsperrow=10;
            in_unique = false;
            break;
    }

    document.getElementById("in_chars").value = symbols;
    document.getElementById("in_items").value = in_items;
    document.getElementById("in_charsperitem").value = in_charsperitem;
    document.getElementById("in_itemsperrow").value = in_itemsperrow;
    document.getElementById("in_unique").checked = in_unique;
}

function changeFontSize() {
    if (document.getElementById("memoTable") != null)
        document.getElementById("memoTable").style.fontSize = document.getElementById("in_fontsize").value;
}

var in_elements = ['in_chars', 'in_items', 'in_charsperitem', 'in_itemsperrow', 'in_fontsize', 'in_unique'];

function saveLayout() {
    try {
        for (var i = 0; i < in_elements.length; ++i)
            localStorage.setItem(in_elements[i], document.getElementById(in_elements[i]).value);
        localStorage.setItem('in_unique', document.getElementById('in_unique').checked);

        return true;
    }
    catch(e) { return false; }
}

function loadLayout() {
    var testLsValue = localStorage.getItem('in_chars');
    if (testLsValue == null || testLsValue == "")
        return false;
    try {
        for (var i = 0; i < in_elements.length; ++i)
            document.getElementById(in_elements[i]).value = localStorage.getItem(in_elements[i]);

        document.getElementById('in_unique').checked = (localStorage.getItem('in_unique') == "true");

        return true;
    }
    catch(e) { console.log('error loading'); return false; }
}

function nonsenseText() {
    var nSymbols = "☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓☔☕☖☗☘☙☚☛☜☝☞☟☠☡☢☣☤☥☦☧☨☩☪☫☬☭☮☯☰☱☲☳☴☵☶☷☸☹☺☻☼☽☾☿♀♁♂♃♄♅♆♇♈♉♊♋♌♍♎♏♐♑♒♓♔♕♖♗♘♙♚♛♜♝♞♟♠♡♢♣♤♥♦♧♨♩♪♫♬♭♮♯♰♱♲♳♴♵♶♷♸♹♺♻♼♽♾♿⚀⚁⚂⚃⚄⚅⚆⚇⚈⚉⚊⚋⚌⚍⚎⚏⚐⚑⚒⚓⚔⚕⚖⚗⚘⚙⚚⚛⚜⚝⚞⚟A⚠⚡⚢⚣⚤⚥⚦⚧⚨⚩⚪⚫⚬⚭⚮⚯B⚰⚱⚲⚳⚴⚵⚶⚷⚸⚹⚺⚻⚼⚽⚾⚿C⛀⛁⛂⛃⛄⛅⛆⛇⛈⛉⛊⛋⛌⛍⛎⛏D⛐⛑⛒⛓⛔⛕⛖⛗⛘⛙⛚⛛⛜⛝⛞⛟E⛠⛡⛢⛣⛤⛥⛦⛧⛨⛩⛪⛫⛬⛭⛮⛯F⛰⛱⛲⛳⛴⛵⛶⛷⛸⛹⛺⛻⛼⛽⛾⛿";
    return randomElement(nSymbols);
}

// startup: loading layout, adding onchange listeners

for (var i = 0; i < in_elements.length; ++i)
    document.getElementById(in_elements[i]).addEventListener("change", saveLayout);

