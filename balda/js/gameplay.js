function Game() {}
Game.treeAll = null; // dict tree with all possible words that human can use
Game.treeCommon = null; // tree with common (easy) words that computer might use during game
Game.dictAll = null; // dict with all words that can be used in the game
Game.dictCommon = null; // dict with common words in the game
Game.board = null;
Game.wordsUsed = [];
Game.player1Words = []; // list of words by player 1
Game.player2Words = []; // list of words by AI or player 2
Game.aiLevel = null; // ai level, 1-5 described in ailevels.js
Game.opponentName = null; // name of opponent based on level
Game.isAiVsAi = false; // true when current game is ai vs. ai

// ai vs. ai
Game.paused = false; // when paused, AI don't make moves one after another

function initGame(lang = 'en', aiLevel = 2, boardDims = '5x5') {
    switch(lang) {
        case 'ru':
            Game.dictAll = Dicts.rusNounsAll; // dict with common words in the game
            Game.dictCommon = Dicts.rusNounsCommon; // dict with all words that can be used in the game
            break;
        case 'en':
            Game.dictAll = Dicts.engNounsAll; // dict with all words that can be used in the game
            Game.dictCommon = Dicts.engNounsCommon; // dict with common words in the game
            break;
        default:
            console.error("initGame: language set wrong", lang, ". Using english");
            break;
    }

    Game.treeAll = makeLetterTree(Game.dictAll);
    Game.treeCommon = makeLetterTree(Game.dictCommon);

    let boardWh = boardDimsToWh(boardDims);
    let boardWordPair = (true) ? createBoard(Game.dictCommon, boardWh[0], boardWh[1]) : createTestBoard();
    Game.wordsUsed = [boardWordPair['midWord']];
    Game.board = boardWordPair['board'];

    Game.player1Words = [];
    Game.player2Words = [];

    Game.aiLevel = aiLevel;
    Game.opponentName = aiName(aiLevel);
}

// returns object
// 'board': 2d array;
// 'midWord' : string
// 2d array representing board
// empty - whether to create empty word instead
function createBoard(wordsList, width = 5, height = width) {
    let board = [];

    // create empty board
    for (let i = 0; i < height; i++) {
        board.push([]);
        for (let j = 0; j < width; j++) {
            board[i].push(" ");
        }
    }

    // insert size-length word in the middle
    let word = "";
    if (wordsList && (typeof wordsList == 'object') && wordsList.length > 0) {
        let nSizedWords = wordsList.filter(word => word.length == width);
        word = nSizedWords.length ? randomElement(nSizedWords) : wordsList[0].substr(0, width);
        let mid = Math.floor((height-1)/2);
        for (let i = 0; i < width && i < word.length; i++) {
            board[mid][i] = word.charAt(i);
        }
    }

    return {
        "board": board,
        "midWord": word
    };
}

// test: returns pre-determined board
function createTestBoard() {
    let board = [
        [" ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " "],
        ["c", "o", "a", "c", "h"],
        [" ", " ", "l", " ", " "],
        [" ", " ", " ", " ", " "],
    ];
    return {
        "board": board,
        "midWord": 'ааааа'
    };
}

// param boardDims - dimentions of a board (e.g. '5x5')
function startGameWithPc(lang, aiLevel, boardDims) {
    Glob.lang = lang;
    Game.isAiVsAi = false;
    saveLocal('scrabbleLang', Glob.lang);
    initGame(lang, aiLevel, boardDims);

    let boardContainer = $("<div id='boardWrap' class='text-center'></div>");
    let infoUnderDiv = $("<div id='infoUnder'></div>")
        .append(faIcon('info-circle'), " Click on the empty cell to enter letter")
        .addClass('py-1');
    let boardAndInfoDiv = $("<div class='col-12 col-sm-6 text-center'></div>").append(boardContainer, infoUnderDiv);
    let hintArea = $("<div id='hintArea' class='my-1'></div>").append($("<button class='btn btn-outline-secondary btn-sm w-100'>Get hints</button>").click(onRequestHint));
    let p1WordsContainer = $("<div class='col-6 col-sm-3'></div>").append(
            $("<div class='nameHead'><span class='playerName'>You</span> <span id='p1score'></span></div>"),
            $("<div id='p1WordsList'></div>"),
            $("<div id='p1NewWord'></div>"),
            hintArea
    );
    let aiMoveBtn = $("<button class='btn btn-outline-secondary my-1 btn-sm w-100'>Make AI move</button>").click(onPcMove);
    let aiWordsContainer = $("<div class='col-6 col-sm-3'></div>").append(
            $("<div class='nameHead'><span class='playerName'>"+Game.opponentName+"</span> <span id='p2score'></span></div>"),
            $("<div id='p2WordsList'></div>"),
            aiMoveBtn
    );

    let gameLoWrapper = $("<div class='row mt-1' id='rowWrap'></div>").append(
            boardAndInfoDiv,
            p1WordsContainer, aiWordsContainer,
    );

    $("#mainLayout").html(gameLoWrapper);
    changeTitle("Balda");

    displayBoard();
}

// param boardDims - dimentions of a board (e.g. '5x5')
function startGameAiAi(lang, aiLevel, boardDims) {
    Game.isAiVsAi = true;
    Glob.lang = lang;
    saveLocal('scrabbleLang', Glob.lang);
    initGame(lang, aiLevel, boardDims);

    let boardContainer = $("<div id='boardWrap' class='bwAiAi text-center'></div>");
    let infoUnderDiv = $("<div id='infoUnder'></div>")
        .append(faIcon('info-circle'), "battle is happening")
        .addClass('py-1');
    let boardAndInfoDiv = $("<div class='col-12 col-sm-6 text-center'></div>").append(boardContainer, infoUnderDiv);
    let p1WordsContainer = $("<div class='col-6 col-sm-3'></div>").append(
            $("<div class='nameHead'><span class='playerName'>AI 1</span> <span id='p1score'></span></div>"),
            $("<div id='p1WordsList'></div>"),
            $("<div id='p1NewWord'></div>"),
    );
    let aiWordsContainer = $("<div class='col-6 col-sm-3'></div>").append(
            $("<div class='nameHead'><span class='playerName'>AI 2</span> <span id='p2score'></span></div>"),
            $("<div id='p2WordsList'></div>")
    );

    let gameLoWrapper = $("<div class='row mt-1' id='rowWrap'></div>").append(
            boardAndInfoDiv,
            p1WordsContainer, aiWordsContainer,
    );

    $("#mainLayout").html(gameLoWrapper);
    changeTitle("AI vs. AI");

    displayBoard();

    let whoGoesFirst = (Math.random() > 0.5) ? 0 : 1;
    setTimeout(function () {
        onPcMove(whoGoesFirst);
    }, 1000);
}

function onRequestHint() {
    let hintArea = $("#hintArea");
    let btn = hintArea.children("button");
    // run through hints
    let allMoves = findAllMoves(Game.board, Game.treeAll, Game.wordsUsed);
    let allWords = movesToWordList(allMoves);
    console.log(allMoves);
    const listingDelay = 320;
    const maxHints = 6;
    let hintIndex = 0;
    for (hintIndex = 0; hintIndex < maxHints && hintIndex < allWords.length; hintIndex++) {
        let w = allWords[hintIndex];
        setTimeout(function () {
            hintArea.html(w);
        }, listingDelay * hintIndex);
    }
    // get it back
    setTimeout(function () {
        hintArea.html(btn.click(onRequestHint));
    }, listingDelay * (hintIndex));
}

function displayBoard() {
    $("#boardWrap").html(jqBoard(Game.board, onCellClick));
    $("#p1WordsList").html(Game.player1Words.join('<br>'));
    $("#p2WordsList").html(Game.player2Words.join('<br>'));

    let p1score = countScore(Game.player1Words);
    let p2score = countScore(Game.player2Words);
    if (p1score)
        $("#p1score").html("(" + p1score + ")");
    if (p2score)
        $("#p2score").html("(" + p2score + ")");
}

// playerIndex: 0 or 1
function onPcMove(playerIndex = 1) {
    let allMoves = findAllMoves(Game.board, Game.treeCommon, Game.wordsUsed);
    if (allMoves.length == 0) {
        console.log("no moves left => game over");
        return gameOverScreen();
    }
    let m = pickAiMove(allMoves, Game.aiLevel);
    let i = m['i'], j = m['j'];
    Game.board[i][j] = m['letter'];
    Game.wordsUsed.push(m['word']);

    displayBoard();
    let hlCellCallback = function () {
        setTimeout(function () {
            highlightPath(m["path"], $("table.board"), $("#infoUnder"), 400, onPathHlEnded);
            let usedWordsArr = (playerIndex == 1) ? Game.player2Words : Game.player1Words;
            usedWordsArr.push(m['word']); // only display it there at the end for "animation" purposes
            if (allCellsOccupied(Game.board))
                gameOverScreen();

            function onPathHlEnded() {
                displayBoard();
                // next player move
                playerIndex = (playerIndex+1)%2;
                if (!Game.paused && $(".bwAiAi").length > 0) {
                    setTimeout(function () {onPcMove(playerIndex)}, 900 + Math.random()*400)
                }
            }
        }, 400);
    }
    highlightCell(i,j, Glob.aiLetterHlClass, true, hlCellCallback);
}

// \param removeHl - if highlight needs to be removed lately
// callback - function to call when finishes highlighting
function highlightCell(i, j, className, removeHl = true, callback = null) {
    let td = $("#brdCell-"+i+'-'+j).addClass(className);
    if (removeHl) {
        setTimeout(function () {
            td.removeClass(className);
            if (callback !== null) {
                callback();
            }
        }, 300);
    } else if (callback !== 0) {
        callback();
    }
}

function onCellClick(el) {
    $("#infoUnder").empty();
    let td = $(this);
    let parts = $(this).attr('id').split('-');
    let i = parts[1], j = parts[2];
    function restoreCell(td) {
        td.html('&nbsp;').css('padding', '');
    }
    if (td.html().trim() == "" || td.html() == "&nbsp;" ) {
        let letterInput = $("<input type='text' maxlength='1' size='1'></input>").css('font-size', '1rem').css('padding', 0);
        letterInput.on('focusout', onFocusOut).on('input', onInputChange);
        function onInputChange(e) {
            letter = letterInput.val();
            if (isLetter(letter)) {
                onUserEnterLetter(i, j, letter, td, restoreCell);
            } else {
                restoreCell(td);
            }
        }
        function onFocusOut() {
            if (letterInput.val().trim() == "")
                restoreCell(td);
            else if (isLetter(letterInput.val()))
                onUserEnterLetter(i, j, letterInput.val(), td, restoreCell);
            else
                console.log("focusout, input val was", letterInput.val());
        }
        $(this).html(letterInput).css('padding', '0');
        setTimeout(function () {letterInput.focus()}, 10);
    } else {
        console.warn("clicked on", $(this).html());
    }

    // user enters letter, needs to enter word now
    // restoreCellCb - function (td) that restores the td (removes everyting from it)
    function onUserEnterLetter(i, j, letter, td, restoreCellCb) {
        letter = letter.toLowerCase().replaceAccents();
        let placeholder = "New word";
        let wordInput = $("<input class='form-control my-1' size='25'></input>").attr('placeholder', placeholder);
        let header = $("<div></div>")
            .html("You entered letter \"" + letter + "\". Which word it forms?")
            .addClass('alert alert-info');
        $("#p1NewWord").empty().append(wordInput, header);
        setTimeout(function () {wordInput.focus()}, 50)
        function inputOnKeypress(e) {
            if (e.which == 13)
                return onDataEntered();
        }
        function restoreEverything() {
            restoreCellCb(td);
            $("#p1NewWord").empty();
        }
        wordInput.on('keypress', inputOnKeypress).on('focusout', onDataEntered);

        function onDataEntered() {
            let word = wordInput.val().toLowerCase().replaceAccents();
            if (word.length <= 1)
                return restoreEverything();

            let moveResult = isMoveLegal(Game.board, Game.treeAll, i, j, letter, word, Game.dictAll, Game.wordsUsed);
            if (moveResult['legal']) {
                restoreEverything();
                Game.board[i][j] = letter;
                Game.wordsUsed.push(word);
                Game.player1Words.push(word);

                displayBoard();
                function afterLetterHl() {
                    function afterPathHl() {
                        if (allCellsOccupied(Game.board)) {
                            return setTimeout(gameOverScreen, 500);
                        } else {
                            setTimeout(onPcMove, 700);
                        }
                    }
                    highlightPath(moveResult["path"], $("table.board"), $("#infoUnder"), 200, afterPathHl);
                }
                highlightCell(i,j, Glob.userLetterHlClass, true, afterLetterHl);
                console.log(moveResult['reason']);
            } else {
                restoreEverything();
                let msgDiv = $("<div></div>")
                    .html(moveResult['reason'])
                    .addClass('alert alert-warning alert-dismissible')
                    .css('cursor', 'pointer')
                    .click(function () {$(this).hide()});
                $("#p1NewWord").html(msgDiv);
            }

        }
    }
}

function gameOverScreen() {
    if (Game.isAiVsAi)
        return gameOverAiaiScreen();

    let p1score = countScore(Game.player1Words);
    let p2score = countScore(Game.player2Words);
    let scoreString = "<strong>" + p1score + "-"+p2score + "</strong>";
    let winString = "";
    if (p1score > p2score)
        winString = "You won "+scoreString+"! Congratulations!";
    if (p1score == p2score)
        winString = "It\'s a "+scoreString+" draw!";
    if (p1score < p2score)
        winString = "Game over, " + Game.opponentName + " wins " + scoreString;

    let againBtn = $("<button class='btn btn-primary btn-sm ml-3'>Start again</button>").click(loNewGame);
    let msgDiv = $("<div class='col-12 text-center alert alert-info'></div>").append(winString).append(againBtn);
    $("#rowWrap").prepend(msgDiv)
}

function gameOverAiaiScreen() {
    let p1score = countScore(Game.player1Words);
    let p2score = countScore(Game.player2Words);
    let scoreString = "<strong>" + p1score + "-"+p2score + "</strong>";
    let winString = "";
    if (p1score > p2score)
        winString = "You won "+scoreString+"! Congratulations!";
    if (p1score == p2score)
        winString = "It\'s a "+scoreString+" draw!";
    if (p1score < p2score)
        winString = "Game over, " + Game.opponentName + " wins " + scoreString;

    let againBtn = $("<button class='btn btn-primary btn-sm ml-3'>Start again</button>").click(loNewGame);
    let msgDiv = $("<div class='col-12 text-center alert alert-info'></div>").append(winString).append(againBtn);
    $("#rowWrap").prepend(msgDiv)
}

