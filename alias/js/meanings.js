// loading meaning of the word

// returns html with meaning from wiktionary
// returns null if not found

function onWordClicked(w) {
    var newDiv = $(document.createElement('div'));
    newDiv.html("loading meaning of" + w + "...");
    newDiv.dialog();

    //jQuery.get("https://ru.wiktionary.org/wiki/" + w, function(data) {showWiktionary(newDiv, w, data);});
    jQuery.get("data/wiktionary.html", function(data) {showWiktionary(newDiv, w, data);});
}

function showWiktionary(newDiv, w, data) {
    //newDiv.html(data.substring(0, 55) + " ha");
    var re=/<h4>.*id="Значение".*<\/h4>.*<ol>\s*<li>(.*)<\/li><\/ol>/s
    //var re=/<h4>.*id="Значение".*<\/h4>.*<ol>/
    var OK = re.exec(data);
    if (!OK)
        console.log(' NO');
    else {
        //console.log("YES!! " + OK[1] + "YES");
        newDiv.html(OK[1]);
        console.log(OK[1]);
    }
}
