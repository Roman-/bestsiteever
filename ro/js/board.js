function Board() {}

Board.tileSize = null; // size of one tile in pixels
Board.width = null; // pcs
Board.height = null; // pcs
Board.rDeg = null; // degrees defined by rule. 0: Twiddle; 90: Ro puzzle; 45:Ro-45; 22.5: annoying
Board.padding = null; // distance between tiles
Board.showVirtualShift = null;
Board.tiles = null; // tiles as jquery $(div) elements
Board.handles = null; // handles as jquery $(div) elements
Board.state = null; // 2d array
Board.ori = null; // orientation state as 1d array. ori[0] is rotation of tile#0 (not tile in position #0!)

// returns true if board is in solved state
function isSolved() {
    if (null == Board.state)
        return false;


    for (let i = 0; i < Board.ori.length; ++i)
        if (Board.ori[i]%360 != 0)
            return false;

    let num = 0;
    for (let y = 0; y < Board.height; y++) {
        for (let x = 0; x < Board.width; x++) {
            if (Board.state[y][x] != (num++))
                return false;
        }
    }
    return true;
}

// init all board-related things
// call on init or when dimentions changes
function initBoard() {
    // init state, tiles
    Glob.boardContainer.empty();
    Glob.glass = createGlass();
    Glob.boardContainer.append(Glob.glass);

    Board.tiles = [];
    Board.state = [];
    Board.ori = [];
    let tileIndex = 0;
    for (let i = 0; i < Board.height; ++i) {
        let row = [];
        for (let j = 0; j < Board.width; ++j) {
            let tile = jqTile(tileIndex, Board.width, Board.height);
            Glob.boardContainer.append(tile);
            row.push(tileIndex);
            Board.ori.push(0);
            Board.tiles.push(tile);
            tileIndex++;
        }
        Board.state.push(row)
    }
    applyStyleSheet();
    applyPaint();
    applyBoardPos();

    // init handles
    Board.handles = [];

    for (let j = 0; j < Board.height-1; j++) {
        for (let i = 0; i < Board.width-1; i++) {
            let handle = jqHandle(i,j);
            Glob.boardContainer.append(handle);
            Board.handles.push(handle);
        }
    }
    updHandlesText();

    // glass
    Glob.glass
        .css('width', Board.width*Board.tileSize + (Board.width-1) * Board.padding)
        .css('height', Board.height*Board.tileSize + (Board.height-1) * Board.padding);

    // virtual shift
    $("#shiftWrap").empty();
    if (Board.showVirtualShift) {
        Glob.vs = createVs();
        $("#shiftWrap").html(Glob.vs)
    }

    resetTimer();
    displayTime(getPuzzleName());
}

function applyBoardPos() {
    for (let i = 0; i < Board.height; ++i) {
        for (let j = 0; j < Board.width; ++j) {
            let pos = posByIndeces(j, i); // Current position on screen
            let num = Board.state[i][j]; // Tile number at position i,j
            let ori = Board.ori[num];
            let tr = "rotate(" + ori + "deg)";
            Board.tiles[num].css('left', pos[0]).css('top', pos[1]).css('transform', tr);

            if (Colors.scheme == 4) {
                // Compute the position of tile 'num' in the solved state
                let i0 = num % Board.width;
                let j0 = Math.floor(num / Board.width);
                let pos0 = posByIndeces(i0, j0);
                Board.tiles[num].css('background-position', (-pos0[0]) + 'px ' + (-pos0[1]) + 'px');
            }
        }
    }
}

// returns tile jquery object
function jqTile(i,w,h) {
    return $("<div class='tile noselect'></div>").addClass((Board.rDeg!=0) ? "bbot" : "").html(i+1);
}

/// stopped there
function jqHandle(i,j) {
    let cx = (i+1) * (Board.tileSize + Board.padding);
    let cy = (j+1) * (Board.tileSize + Board.padding);
    let size = Board.tileSize/4;

    return $("<div class='handle'></div>")
        .css('left', Math.round(cx-(size+Board.padding)/2)).css('top', Math.round(cy-(size+Board.padding)/2))
        .css('width',size).css('height',size);
}

function updHandlesText() {
    let index = 0;
    Board.handles.forEach(function (h) {
        let ij = handleIjByIndx(index);
        let newVal = handleLetter(ij[0],ij[1],!Board.shiftOn);
        h.html(newVal);
        h.css('border-width', Board.shiftOn ? "3px" : "");
        index++;
    });
}
