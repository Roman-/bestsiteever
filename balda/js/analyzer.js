// settings for analyzer: board size, language, start word (optional)
function loStartAnalyzer() {
    // opponent type, language, board size
    changeTitle("Board analyzer");
    let h1 = $("<h1></h1>").html("Analyzer");
    let langSelect = jqLangSelect(Glob.lang || 'en');

    let boardSizeSelect = jqBoardSizeSelect(Glob.boardDim);
    let startWordInput = $("<input type='text' class='form-control'></input>")
        .attr('placeholder', 'Start word (optional)');
    let btnStart = $("<button class='btn btn-primary form-control my-1'>Launch analyzer</button>")
        .click(function () {
            loAnalyzer(langSelect.val(), boardSizeSelect.val(), startWordInput.val().toLowerCase().replaceAccents());
        });
    let div = $("<div class='mt-1'></div>").append(
            h1,
            langSelect,
            boardSizeSelect,
            startWordInput,
            btnStart);

    $("#mainLayout").html(div);
}

// analyze board to find best move. Use Game.dictAll only
function loAnalyzer(lang, boardDims, startWord) {
    Glob.lang = lang;
    saveLocal('scrabbleLang', Glob.lang);
    initAnalyzer(lang, boardDims, startWord);

    let boardContainer = $("<div id='boardWrap' class='text-center'></div>");
    let infoUnderDiv = $("<div id='infoUnder'></div>")
        .append(faIcon('info-circle'), " Click on the empty cell to enter letter")
        .addClass('py-1');
    let boardAndInfoDiv = $("<div class='col-12 col-sm-6 text-center'></div>").append(boardContainer, infoUnderDiv);
    let hintsContainer = $("<div class='col-12 col-sm-6'></div>").append(
            $("<div></div>").append(
                $("<button class='btn btn-primary mx-1'>List moves</button>").click(listAnaMoves),
                $("<button class='btn btn-primary mx-1'>List words</button>").click(listAnaWords),
            ),
            $("<div id='theList'></div>"),
    );
    let gameLoWrapper = $("<div class='row mt-1' id='rowWrap'></div>").append(
            boardAndInfoDiv,
            hintsContainer
    );

    $("#mainLayout").html(gameLoWrapper);

    displayAnaBoard();
}

function displayAnaBoard() {
    $("#boardWrap").html(jqBoard(Game.board, onAnaCellClick, true));
}

function initAnalyzer(lang, boardDims, startWord) {
    switch(lang) {
        case 'ru':
            Game.dictAll = Dicts.rusNounsAll; // dict with common words in the game
            break;
        case 'en':
            Game.dictAll = Dicts.engNounsAll; // dict with all words that can be used in the game
            break;
        default:
            console.error("analyzer init: language set wrong", lang, ". Using english");
            break;
    }

    Game.treeAll = makeLetterTree(Game.dictAll);

    let wh = boardDimsToWh(boardDims);
    Game.board = createBoard([startWord], wh[0], wh[1])['board'];

    Game.wordsUsed = [];
}

// analyzer board cell click
function onAnaCellClick(el) {
    $("#theList").empty();
    let td = $(this);
    let parts = $(this).attr('id').split('-');
    let i = parts[1], j = parts[2];
    function restoreCell(td) {
        td.html('&nbsp;').css('padding', '');
    }

    let letterInput = $("<input type='text' maxlength='1' size='1'></input>")
        .css('font-size', '1rem')
        .css('padding', 0)
        .on('focusout', onInputChange).on('input', onInputChange);

    // input value
    let content = td.html().trim().replace("&nbsp;", "");
    if (isLetter(content))
        letterInput.val(content);

    function onInputChange() {
        letter = letterInput.val().trim().toLowerCase().replaceAccents();
        console.log("letter = ", letter);
        restoreCell(td);
        if (isLetter(letter)) {
            Game.board[i][j] = letter;
            td.html(letter);
            // switch on next cell here
        } else {
            Game.board[i][j] = ' ';
        }
        // listAnaMoves(); // live takes too long when lotta cells occupied
    }

    $(this).html(letterInput).css('padding', '0');
    setTimeout(function () {letterInput.focus().select()}, 10);
}

function listAnaMoves() {
    let moves = findAllMoves(Game.board, Game.treeAll, Game.wordsUsed);
    let words = [];
    let wordsDiv = $("<div></div>");
    moves.forEach(function (moveObj) {
        if (words.indexOf(moveObj.word) == -1) {
            let wordSpan = $("<span></span>")
                .html(hlLetterWhereCellEmpty(moveObj, Game.board))
                .click(function () {
                    highlightPath(moveObj["path"], $("table.board"), null, 200, null);
                })
                .css('cursor', 'pointer');
            wordsDiv.append(wordSpan, " ");
            words.push(moveObj.word);
        }
    });

    $("#theList").html(wordsDiv);
}

function listAnaWords() {
    let wordsObjects = findAllWords(Game.board, Game.treeAll, Game.wordsUsed);
    let words = [];
    let wordsDiv = $("<div></div>");
    wordsObjects.forEach(function (wordObj) {
        if (words.indexOf(wordObj.word) == -1) {
            let wordSpan = $("<span></span>")
                .html(wordObj.word)
                .click(function () {
                    highlightPath(wordObj["path"], $("table.board"), null, 200, null);
                })
                .css('cursor', 'pointer');
            wordsDiv.append(wordSpan, " ");
            words.push(wordObj.word);
        }
    });

    $("#theList").html(wordsDiv);
}
