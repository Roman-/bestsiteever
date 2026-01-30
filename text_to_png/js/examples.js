
function jqExamplesDiv() {
    let div = $("<div></div>");
    Glob.fontsList.forEach(fontName => div.append(jqExample(fontName)));
    return div;
}

function jqExample(fontName) {
    // when you click on it, you just set text
    return $("<div></div>")
        .addClass("example-div clickable")
        .css("font-family", fontName)
        .css("color", Config.fillColor)
        .prop("title", fontName)
        .html(Config.text.replaceAll("\n", "<br>"))
        .click(()=>{
            Config.font = fontName;
            onTextUpdate();
        })
}

function jqColorsDiv() {
    let div = $("<div></div>");
    Glob.colorsList.forEach(color => div.append(jqColorEx(color)));
    return div;
}

function jqColorEx(color) {
    // when you click on it, you just set text
    return $("<div></div>")
        .addClass("example-div clickable")
        .css("font-family", Config.font)
        .css("color", color)
        .prop("title", color)
        .html(Config.text.replaceAll("\n", "<br>"))
        .click(()=>{
            Config.fillColor = color;
            onTextUpdate();
        })
}
