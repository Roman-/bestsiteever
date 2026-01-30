AiLevels = function (){}
AiLevels.ais = [
    // 0
    {
        "name": "Dummy AI",
        "description": "Knows common words, picks one of the worst moves",
        "icon": "🤖",
    },
    // 1
    {
        "name": "Easy AI",
        "description": "Knows common words, picks an average move",
        "icon": "🤖",
    },
    // 2
    {
        "name": "Normal AI",
        "description": "Knows common words, picks best than average move",
        "icon": "🤖",
    },
    // 3
    {
        "name": "Hard AI",
        "description": "Knows all words, picks best than average move",
        "icon": "🤖",
    },
    // 4
    {
        "name": "Impossible AI",
        "description": "Knows common words, picks the best move",
        "icon": "👾",
    },
    // 5
    {
        "name": "God AI",
        "description": "Knows all words, picks the best move",
        "icon": "👾",
    },
];

function pickAiMove(allMoves, aiLevel) {
    // make array of possible scores
    let scores = [];
    allMoves.forEach(function (m) {
        let len = m['word'].length;
        if (scores.indexOf(len) == -1)
            scores.push(len);
    });
    scores = scores.sort(function (a,b) {return a - b});
    let lowIndex = ((scores.length > 1) && (Math.random() > 0.3)) ? 1 : 0;
    let meanIndex = Math.floor(scores.length / 2);
    let highIndex = (scores.length > 1 && Math.random() > 0.7) ? scores.length - 2 : scores.length - 1;
    let topIndex = scores.length - 1;

    let scoreIndex = 0;
    switch (aiLevel) {
        case 0: scoreIndex = lowIndex;  break;
        case 1: scoreIndex = meanIndex; break;
        case 2: scoreIndex = highIndex; break;
        case 3: scoreIndex = highIndex; break;
        case 4: scoreIndex = topIndex;  break;
        case 5: scoreIndex = topIndex;  break;
        default: console.error("aiLevel unknown: ", aiLevel); break;
    }

    let score = scores[scoreIndex];

    console.log("among scores", scores, aiName(aiLevel) + " picks #" + scoreIndex, " (score = ", score, "). The best option was ", moveObjToString(allMoves[0]));

    // pick a move that gives that score
    let result = null;
    allMoves.forEach(function (m) {
        if (m['word'].length == score) {
            // add some "randomness" to pick among possible moves of this score
            if (!result || (Math.random() > 0.8)) {
                result = m;
            }
        }
    });

    // TODO delete this part after testing
    if (result === null) {
        console.error("didn't pick a move", scores, allMoves, aiLevel);
        return allMoves[0];
    }

    return result;
}

// returns name of AI based on level
function aiName(aiLevel) {
    return AiLevels.ais[aiLevel]['icon'] + " " + AiLevels.ais[aiLevel]['name'];
}
