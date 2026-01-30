function loPlay() {
    let roundDiv = $("<h1></h1>").html("Round " + (Game.currentRound+1));
    if (Game.currentRound >= Game.rounds.length) {
        Game.currentRound = 0;
        return loAllRoundsPassed();
    }
    let numDistPair = Game.rounds[Game.currentRound];
    let success = initNewGame(numDistPair[0], numDistPair[1]);
    let playPanel = success ? jqPlay() : "Could not init a game :("

    $("#mainLayout").empty().append(roundDiv, playPanel);

    $("#guessInput").focus();
}

function loAbout() {
    let h1 = $("<h1></h1>").html('About');
    let aboutDiv = $("<div></div>").html(aboutText);
    $("#mainLayout").empty().append(h1, aboutDiv);
}

function loMapgen() {
    function showMap(event) {
        let text = input.val().trim();
        let div = $("<div></div>");
        if (text != '' && (event.keyCode ? event.keyCode : event.which) == 13) {
            let map = makeWordMap(text);
            $(map).each(function (index, list) {
                if (index == 0)
                    return;
                div.append('<h2>' + index + "-away</h2>");
                div.append(list.join(', '));
                div.append('<hr>');
            });
            textDiv.empty().append(div);
        }
    }

    let h1 = $("<h1></h1>").html('Find closest words');
    var input = $("<input type='text'></input>")
        .addClass('form-control mb-3')
        .attr('placeholder', 'Enter a word')
        .attr('max', 15)
        .on('keypress', showMap)

    var textDiv = $("<div></div>");

    $("#mainLayout").empty().append(h1, input, textDiv);
    input.focus();
}

function resetNewGame() {
    Game.currentRound = 0;
    loPlay();
}

// output colored words
function testColors() {
    $("#mainLayout").empty()
    for (let i = 1; i < 6; i++) {
        $("#mainLayout").append($("<div></div>").html('word' + i).css('color', colorByDist(i)).css('font-weight', 'bold'));
    }
}

function loReloadDicts(res) {
    console.log(res);
    $("#mainLayout").empty().append("Error. Reload page?");
}

// assuming Game object has been initialized
function jqPlay() {
    let div = $("<div></div>");
    let input = $("<input type='text' class='form-control mt-2'></input>")
        .prop('placeholder', 'Enter your guess')
        .prop('id', 'guessInput')
        .on('keyup', function (event) {
        let text = input.val().trim().toLowerCase();
        if (text != '' && (event.keyCode ? event.keyCode : event.which) == 13) {
            input.val('');
            if (Game.target == text) {
                input.val('').prop('disabled', true);
                surrenderBtn.prop('disabled', true);

                let congratsThing = $("<div class='alert alert-success'></div>")
                    .append("<b>" + text + "</b> - correct!");
                againBtn = $("<button class='btn btn-success form-control'>Next round <i class='fa fa-arrow-right'></i></button>")
                    .click(function () {
                        Game.currentRound++;
                        loPlay();
                    })
                commentText.empty().append(congratsThing, againBtn);
                input.hide();
                againBtn.focus();
                return;
            }
            // if not among know words, return
            if (Glob.dictAntiFlood.indexOf(text) == -1) {
                input.prop('placeholder', 'Guess \"' + text + '\" isn\'t among the English words I know');
                return;
            } else {
                input.prop('placeholder', '');
            }
            // if it's already in the list, ignore it
            if (Game.list.indexOf(text) != -1) {
                input.prop('placeholder', 'Guess \"' + text + '\" is already in here');
                return;
            }
            dist = levenDist(Game.target, text);
            if (dist >= Game.map.length) {
                input.prop('placeholder', 'Guess \"' + text + '\" is too far away');
                return; // too far away
            }
            // throw it away from Game.map, add it to the list
            Game.map[dist].splice(Game.map[dist].indexOf(text), 1);
            Game.list.unshift(text);
            fillDivWithList(aListDiv);
        }
    });
    let commentText = $("<h4>Guess a word that spells similar to:</h4>");
    let aListDiv = $("<div class='card px-1' id='aList'></div>");
    // let aListDiv = $("<div></div>");
    let hintBtn = $("<button class='btn btn-outline-warning  col-6'></button>").html('Hint')
        .click(function () {getUserHint(aListDiv)});
    var surrenderBtn = $("<button class='btn btn-outline-danger col-6'></button>").html('Surrender')
        .click(function () {
            // surrender: don't change current round
            input.val('').prop('disabled', true);
            surrenderBtn.prop('disabled', true);
            surrDiv = $("<div></div>").html('The word was <b>' + Game.target + "</b>");
            againBtn = $("<button class='btn btn-primary'>Start again</button>").click(function () {
                input.val('').prop('disabled', false);
                loPlay();
            });
            commentText.empty().append(surrDiv, againBtn);
        });
    let btnsPanel = $("<div class='mt-2'></div>").append(hintBtn, surrenderBtn);
    div.empty().append(input, commentText, aListDiv, btnsPanel, jqHelpAlert());

    fillDivWithList(aListDiv);

    return div;
}

function loAllRoundsPassed() {
    let h2 = $("<h1></h1>").html("Congratulations!");
    let div = $("<div></div>").html("You have completed the game");
    let pic = $("<img src='img/win.gif'/>");
    $("#mainLayout").empty().append(h2, div, pic);
}

// fills div with list of hints or guesses
function fillDivWithList(div) {
    div.empty();
    Game.list.sort(function (a,b) {return levenDist(a,Game.target) - levenDist(b,Game.target)});
    Game.list.forEach(function (w) {
        let dist = levenDist(w, Game.target);
        div.append(coloredWordDiv(w,dist));
    });
}

function jqHelpAlert() {
    // returns html "<span class=...>text<span>"
    function wrapSpan(text, dist) {
        let c = (dist == 0) ? "black" : colorByDist(dist);
        return "<span style='color: "+c+"; font-weight: bold;'>"+text+"</span>";
    }
    let div = $("<div class='alert alert-secondary mt-4 alert-dismissible fade show'></div>");
    div.append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>');
    div.append("<h2>How to play</h2>");
    div.append($("<p></p>").html(wrapSpan("Green",1) + " words are just one letter away from the target: " + wrapSpan("cat",1) + " &#8594; " + wrapSpan("can",0)+", "+wrapSpan("spin",1)+" &#8594; "+wrapSpan("pin",0)+", "+wrapSpan("spin",1)+" &#8594; "+wrapSpan("spine",0)));
    div.append($("<p></p>").html(wrapSpan("Teal",2) + " words are two letters away: " + wrapSpan("hard",2) + " &#8594; " + wrapSpan("part",0)+", "+wrapSpan("play",2)+" &#8594; "+wrapSpan("player",0)));
    div.append($("<p></p>").html(wrapSpan("Bluish",3) + "-colored words are three letters away, which for short words may be as confusing as "+wrapSpan("cat",3)+" &#8594; "+wrapSpan("dog",0) + " (all three letters are different)."));
    div.append($("<p></p>").html(wrapSpan("Use your intuition",0) + " to find a target word, but also use strategy: a combination like {"+ wrapSpan("bug",1) + ", " + wrapSpan("bun",2)+"} indicates that the third letter of your word is likely to be \"g\", because "+wrapSpan("bug",1) + " and " + wrapSpan("bun",2) + " only differ in one letter, but " + wrapSpan("bug",1) + " is exactly one step closer to the target."));
    div.append("<h2>There are "+Game.rounds.length+" rounds</h2>");
    div.append("<p>Each round the initial set of hints are further away from the target. Can you win in less than 5 guesses in each round?</p>");
    div.append("<h2>Have fun!</h2>");
    div.append("<p>That's the whole point.</p>");
    return div;
}

// gradient: green to green-blue to gray
function colorByDist(dist) {
    /*
     // older version had too bright green color
    if (dist < 1)
        return '#ee0000'; // same
    if (dist < 2)
        return '#11ee11';
    if (dist < 3)
        return '#22aa55';
    if (dist < 4)
        return '#338888';
    if (dist < 5)
        return '#888888';
    return '#aaaaaa';
    */
    if (dist < 1)
        return '#ee0000'; // same
    if (dist < 2)
        return '#11dd11';
    if (dist < 3)
        return '#11aa99';
    if (dist < 4)
        return '#0088bb';
    if (dist < 5)
        return '#778890';
    return '#aaaaaa';
}
