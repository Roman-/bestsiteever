Board.keyMovesMap = {
    "KeyU": [0,0],
    "KeyI": [1,0],
    "KeyO": [2,0],
    "KeyJ": [0,1],
    "KeyK": [1,1],
    "KeyL": [2,1],
    "KeyM": [0,2],
    "Comma": [1,2],
    "Period": [2,2],

    "Numpad7": [0,0],
    "Numpad8": [1,0],
    "Numpad9": [2,0],
    "Numpad4": [0,1],
    "Numpad5": [1,1],
    "Numpad6": [2,1],
    "Numpad1": [0,2],
    "Numpad2": [1,2],
    "Numpad3": [2,2],
}

Board.btnsText = [
    // 1,2: uijk
    [
        ['u', 'i', 'o'],
        ['j', 'k', 'l'],
        ['m', ',', '.'],
    ],
    [
        ['U', 'I', 'O'],
        ['J', 'K', 'L'],
        ['M', '<', '>'],
    ],
    // 3,4: numpad
    [
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
    ],
    [
        ['<strong>7</strong>', '<strong>8</strong>', '<strong>9</strong>'],
        ['<strong>4</strong>', '<strong>5</strong>', '<strong>6</strong>'],
        ['<strong>1</strong>', '<strong>2</strong>', '<strong>3</strong>'],
    ],
];

// returns letter corresponding to handle with coords
function handleLetter(i,j,lower=true) {
    if (Colors.hText == 0)
        return "";
    index = 2*Colors.hText-2 + (lower?0:1);
    let controls = Board.btnsText[index];
    return (j < controls.length ? (i < controls[j].length ? (controls[j][i]) : "&nbsp;") : "&nbsp;");
}

Board.Perms = function (i,j) {return [
    // 0: ro
    [
        [[i+0,j+0], [i+0,j+1], [i+1,j+1], [i+1,j+0]],
        [[i+0,j+0], [i+1,j+0], [i+1,j+1], [i+0,j+1]]
    ],
    // 1: same as #0 but with rotations
    [
        [[i+0,j+0], [i+0,j+1], [i+1,j+1], [i+1,j+0]],
        [[i+0,j+0], [i+1,j+0], [i+1,j+1], [i+0,j+1]]
    ],
    // 2: around one
    [
        [[i-1,j-1], [i+0,j-1], [i+1,j-1], [i+1,j+0], [i+1,j+1], [i+0,j+1], [i-1,j+1], [i-1,j+0]],
        []
    ],
]};

// make move by handle coordinates
function makeMoveByHnd(i,j,cw) {
    if (i >= Board.width-1 || j >= Board.height-1 || i < 0 || j < 0)
        return false;
    makeMove(i,j,cw);
    applyBoardPos();

    if (!Timer.isRunning && Timer.canStart)
        startTimer();
    if (isSolved() && Timer.isRunning) {
        onPuzzleSolved();
    }
}

// i,j - position of the handle
function makeMove(i, j, cw=true) {
    // let permPair = Board.Perms(i,j)[Board.rule];
    // let perm = cw ? permPair[0] : permPair[1];
    let perm = cw
        ? [[i+0,j+0], [i+0,j+1], [i+1,j+1], [i+1,j+0]]
        : [[i+0,j+0], [i+1,j+0], [i+1,j+1], [i+0,j+1]];

    // do permutation in Board.state
    let tempTile = Board.state[perm[0][1]][perm[0][0]];
    for (let k = 0; k < perm.length - 1; ++k) {
        Board.state[perm[k][1]][perm[k][0]] = Board.state[perm[k+1][1]][perm[k+1][0]];
    }
    Board.state[perm[perm.length - 1][1]][perm[perm.length - 1][0]] = tempTile;

    // orientation (for fun): every piece that takes action rotates
    for (let k = 0; k < perm.length; ++k) {
        // apply new orientation to piece that's now in position perm[k][0] and perm[k][1] are piece ij
        let tileIndex = Board.state[perm[k][1]][perm[k][0]];
        Board.ori[tileIndex] = (Board.ori[tileIndex] + (cw ? Board.rDeg : -Board.rDeg));
    }
}

function hlHandle(i,j) {
    for (let i1 = 0; i1 < Board.width-1; ++i1) {
        for (let j1 = 0; j1 < Board.height-1; ++j1) {
            applyHandleHl(Board.handles[handleIndexByIj(i1,j1)], (i===i1&&j===j1));
        }
    }
}

// highlight handles to mimic congratulatinos
function hlCongrats() {
    for (let i1 = 0; i1 < Board.width-1; ++i1) {
        for (let j1 = 0; j1 < Board.height-1; ++j1) {
            applyHandleHl(Board.handles[handleIndexByIj(i1,j1)], 2);
        }
    }
}
