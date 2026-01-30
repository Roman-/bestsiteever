function onScramblePressed() {
    // if settings are still open, close them
    if ($("#btnSettings").attr('is-open') == '1')
        $("#btnSettings").trigger('click');

    if ((!Timer.isRunning) && (!Timer.canStart))
        scramble();
}

function scramble() {
    // before scrambling, reset positions & rotation
    function resetBoardPosRot() {
        Board.state = [];
        Board.ori = [];
        let tileIndex = 0;
        for (let i = 0; i < Board.height; ++i) {
            let row = [];
            for (let j = 0; j < Board.width; ++j) {
                row.push(tileIndex);
                Board.ori.push(0);
                tileIndex++;
            }
            Board.state.push(row)
        }
    }

    if (Board.rDeg == 0 && Board.rule == 0 && Board.width >= 3 && Board.height >= 3)
        randomShuffleScramble();
    else
        randomMovesScramble();

    applyBoardPos();
    resetTimer();
    Timer.canStart = true;

    hlHandle(-1,-1);

    // for other puzzles
    function randomMovesScramble(N=null) {
        if (null === N)
            N = (Board.width*Board.height)*6 + Math.round(Math.random() * 10);
        for (let m = 0; m < N; ++m) {
            let i = Math.floor(Math.random() * (Board.width-1));
            let j = Math.floor(Math.random() * (Board.height-1));
            let cw = (Math.random() > 0.5);
            makeMove(i,j, cw);
        }
    }

    function randomShuffleScramble() {
        let newNumbers = [];
        for (let i = 0; i < Board.width*Board.height; i++)
            newNumbers.push(i);
        shuffle(newNumbers);

        for (let i = 0; i < Board.width*Board.height; i++) {
            let ij = pieceIjByIndx(i);
            Board.state[ij[1]][ij[0]] = newNumbers[i];
        }
    }
}

function resetBoard() {
    initBoard(Board.width, Board.height);
    applyBoardPos();
    resetTimer();
}

function onResetPressed() {
    clearAvgs(); // unfortunately
    initBoard();
    applyBoardPos();
    resetTimer();
    $("#btnSettings").attr('is-open', 0);
    displayTime(getPuzzleName());
    Glob.infoDiv.html(infoText());

    hlHandle(-1,-1);
}

function onPuzzleSolved() {
    stopTimer();
    hlCongrats();
    if (Glob.showTimer) {
        Glob.infoDiv.html(jqTimesTable());
    }
}
