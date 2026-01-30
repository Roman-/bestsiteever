// returns board as jquery object
// onCellClickCb - what happens when you click on CB
// eClickable - make occupied cells clickable (allow clicking on all cells, not only empty)
function jqBoard(board, onCellClickCb, oClickable = false) {
    let table = $("<table class='board'></table>").css('margin', "auto");

    for (let i = 0; i < board.length; i++) {
        let tr = $("<tr></tr>");
        for (let j = 0; j < board.length; j++) {
            let isEmpty = (board[i][j] == " ");
            let isClickable = isEmpty || oClickable;
            let content = isEmpty ? "&nbsp;" : board[i][j];
            let td = $("<td></td>").html(content);
            td.attr('id', 'brdCell-' + i + '-' + j).addClass('boardCell').addClass(isClickable ? "bc-empty" : "bc-busy");
            if (isClickable && onCellClickCb) {
                td.on('click', onCellClickCb);
            }
            tr.append(td);
        }
        table.append(tr);
    }
    return table;
}

function loNewGame() {
    $("#mainLayout").html(jqNewGameSetup());
    changeTitle("Balda");
}

// initialize game AI vs. AI
function loAiAi() {
    $("#mainLayout").html(jqAiAiGameSetup());
    changeTitle("AI vs. AI");
}

// returns div with new game settings
function jqNewGameSetup() {
    // opponent type, language, board size
    let h1 = $("<h1></h1>").html("New game");
    let langSelect = jqLangSelect(Glob.lang || 'en');
    let aiSelect = jqAiSelect(2);

    let boardSizeSelect = jqBoardSizeSelect(Glob.boardDim);

    let btnStart = $("<button class='btn btn-success form-control my-1'>Start</button>")
        .click(function () {
            startGameWithPc(langSelect.val(), parseInt(aiSelect.val()), boardSizeSelect.val());
        });
    let div = $("<div class='mt-1'></div>").append(
            h1,
            langSelect,
            boardSizeSelect,
            aiSelect,
            btnStart);

    return div;
}

// returns div with new game settings
function jqAiAiGameSetup() {
    // opponent type, language, board size
    let h1 = $("<h1></h1>").html("AI battle");
    let langSelect = jqLangSelect(Glob.lang || 'en');

    let boardSizeSelect = jqBoardSizeSelect(Glob.boardDim);

    let btnStart = $("<button class='btn btn-success form-control my-1'>Watch</button>")
        .click(function () {
            startGameAiAi(langSelect.val(), 4, boardSizeSelect.val());
        });
    let div = $("<div class='mt-1'></div>").append(
            h1,
            langSelect,
            boardSizeSelect,
            btnStart);

    return div;
}

// runs through path
// afterCallback - function that happens after animation finished
function highlightPath(path, jqBoard, infoDiv = null, animationTime = 400, afterCallback = null) {
    lettersDiv = $("<div></div>").addClass('h2 text-left');
    if (infoDiv)
        infoDiv.empty().append(lettersDiv);

    let hlIndex = 0;
    path.forEach(function (wp) {
        let i = wp['i'];
        let j = wp['j'];
        let td = jqBoard.find("#brdCell-" + i + "-" + j);
        let letter = td.html();
        let delay = (hlIndex++) * animationTime;

        // TODO add class for highlighting to make it different
        setTimeout(function () {
            td.removeClass(Glob.aiLetterHlClass).removeClass(Glob.userLetterHlClass)
            td.addClass(Glob.pathHlClass);
            lettersDiv.append(letter);
        }, delay);
    });

    setTimeout(function () {
        jqBoard.find("td").removeClass(Glob.pathHlClass).removeClass(Glob.aiLetterHlClass).removeClass(Glob.userLetterHlClass);
        lettersDiv.empty();
        if (afterCallback)
            afterCallback();
    }, (animationTime * path.length) + 500);
}

function loQuickStart() {
    // which is your language?
    let h1 = $("<h2></h2>").html('Which language should we play in?');
    let enBtn = $("<div class='col-6'></div>").append($("<button class='btn btn-primary form-control m-1'></button>").html("English").click(function () {
        Glob.lang = 'en';
        startGameWithPc(Glob.lang, 2, 5);
    }));
    let ruBtn = $("<div class='col-6'></div>").append($("<button class='btn btn-primary form-control m-1'></button>").html("Русский").click(function () {
        Glob.lang = 'ru';
        startGameWithPc(Glob.lang, 2, 5);
    }));
    let btnsRow = $("<div class='row my-1'></div>").append(enBtn, ruBtn);
    let rulesDiv = $("<div></div>").html(Texts.rules);
    let div = $("<div></div>").append(rulesDiv, h1, btnsRow);
    $("#mainLayout").html(div);
    changeTitle("Balda");
}

