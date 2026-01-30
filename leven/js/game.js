function Game () {}
Game.list = [];
Game.target = null;
Game.map = null; // game map is 2d array of levendist words. Reduces as we add words to Game.list
Game.rounds = [ [3,1], [3,2], [2,2], [3,3], [1,3], [12,4] ]; // [numWords, distance]. 3 words with dist = 1 etc.
Game.currentRound = 0;

// returns object {'target': word, 'list': []}
// if word=null then pick random word
// \param difficulty - initial hints distance
// \param recu - level of recursion. If failed to init game, we recursively try to init it once more
// \returns true if initializing game went successful
function initNewGame(hintsNum = 3, difficulty = 1, word = null, recu = 0) {
    // random word
    Game.target = randomElement(Glob.dictTargets);
    Game.map = makeWordMap(Game.target);
    Game.list = [];

    // output N words with distance M or more
    let currentLd = difficulty;

    let success = true;
    for (let i = 0; i < hintsNum; ++i)
        success &= appendHint(difficulty);

    if (!success) {
        console.warn("could not append all hints for ", Game.target, "map = ", Game.map);
        return recu > 5 ? false : initNewGame(hintsNum = 3, difficulty = 1, null, recu + 1)
    }

    console.log("Init game. Target: \n" + Game.target + "\nList = ", Game.list, ", map=", Game.map);

    return true;
}

// appends to Game.list hint from Game.map of the distance dist. This changes Game.map
// returns true if has been appended
function appendHint(dist) {
    while (dist < Game.map.length && Game.map[dist].length == 0)
        dist++;
    if (dist == 0)
        return false;
    // add 1 word from Game.map[dist] to Game.list
    if (!Game.map.hasOwnProperty(dist)) {
        console.log("do not have words " + dist + " away");
        return false;
    }
    Game.list.unshift(Game.map[dist].splice(0,1)[0]);
    return true;
}

// returns true if first n words of the list are same distance from target
function areSameDistance(list, n, target) {
    if (list.length < n || list.length == 0)
        return false;
    let d = levenDist(list[0], target);

    for (let i = 1; i < n; i++)
        if (levenDist(list[i], target) != d)
            return false;
    return true;
}

// user clicked 'hint'
function getUserHint(div) {
    // hint should be same or better then the best word we have
    let dist = levenDist(Game.list[0], Game.target);
    let distInitial = dist;

    // if first like 5 words are same distance, decrease it by 1
    let nWordsSameDist = 5;
    if (Game.list.length >= nWordsSameDist && areSameDistance(Game.list, nWordsSameDist, Game.target))
        dist = Math.max(1, dist-1);

    while (dist > 0 && Game.map[dist].length == 0)
        dist--;

    if (dist == 0) {
        appendHint(distInitial); // append hint thats worse than initial
    } else {
        Game.list.unshift(Game.map[dist].splice(0,1)[0]);
    }

    fillDivWithList(div);
}

// returns 2d array: [[], [1-away], [2-away]]
function makeWordMap(word) {
    let res = [
        [], // dist 0: contains single word
        [], // dist 1: one-away
        [], // dist 2
        [], // dist 3
        [], // dist 4
    ];

    Glob.dictInitial.forEach(function (w) {
        let dist = levenDist(word, w);
        if (dist < 5)
            res[dist].push(w);
    });


    for (let i = 0; i < res.length; i++)
        shuffle(res[i]);

    return res;
}

// returns div with colored word by difficulty + diff level)
function coloredWordDiv(w, dist) {
    let theWord = $("<span></span>").html(w).css('color', colorByDist(dist)).css('font-weight', 'bold');
    let theDist = $("<span></span>").html(" ("+dist+")").css('color', 'gray').css('font-style', 'italic');
    let title = dist + (dist == 1 ? " letter" : " letters") + " away";
    return $("<div></div>").append(theWord, theDist).attr('title', title);
}
