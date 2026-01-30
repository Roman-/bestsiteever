Board.shiftOn = false;

function windowKup(e) {
    // unpress shift = upper/lowercase
    if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        Board.shiftOn = false;
        onVsUpd();
;
    }
}

function windowKd(e) {
    if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
        Board.shiftOn = true;
        onVsUpd();
    }

    if (e.code == "Space") {
        onScramblePressed();
        return e.preventDefault();
    } else if (e.code == "Escape") {
        onResetPressed();
        return;
    }
    if (Board.keyMovesMap.hasOwnProperty(e.code)) {
        let m = Board.keyMovesMap[e.code];
        hlHandle(m[0],m[1]);
        makeMoveByHnd(m[0], m[1], !Board.shiftOn);
        return e.preventDefault();;
    }
    if (e.code == "KeyH" && Board.shiftOn) {
        return showAlgsSheet();
    }
}

// mouse out => do not highlight
function glassMout() {
    hlHandle(-1,-1);
}

// mouse move => highlight
function glassMm(e) {
    e = e || window.event;
    let x = e.offsetX;
    let y = e.offsetY;
    let handleIn = rhiByCoords(x,y);
    let i = handleIn[0];
    let j = handleIn[1];

    if (i >= Board.width-1)
        i = Board.width-2;
    if (j >= Board.height-1)
        j = Board.height-2;
    if (i<0)
        i = 0;
    if (j<0)
        j = 0;

    hlHandle(i,j);
    e.preventDefault();
}

// touchstart
function glassTs(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
        let t = e.touches[e.touches.length - 1]; // last gesture in case we push simultaneously
        let x = t.pageX - e.target.getBoundingClientRect().x;
        let y = t.pageY - e.target.getBoundingClientRect().y;
        let handleIn = rhiByCoords(x,y);
        makeMoveByHnd(handleIn[0], handleIn[1], !Board.shiftOn);
    }
}

// mouse down = make move
function glassMd(e) {
    e = e || window.event;
    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3;
    else if ("button" in e)  // IE, Opera
        isRightMB = e.button == 2;
    let handleIn = rhiByCoords(e.offsetX,e.offsetY);
    makeMoveByHnd(handleIn[0], handleIn[1], !isRightMB);
    e.preventDefault();
}

// context menu (right click) - if click was inside Glob.glass, don't do anything
function onContextMenu(e) {
    if (e.target.id == "glass")
        return false;
    return true;
}

/*              VIRTUAL SHIFT        */

// when virtual shift is updated
function onVsUpd() {
    updHandlesText();
    if (Glob.vs) {
        Glob.vs.css('background-color', Board.shiftOn ? 'lightblue' : '').html(Board.shiftOn ? 'SHIFT' : 'shift');
    }
}

// virtual shift touch start
function vsTs(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
        Board.shiftOn = true;
        onVsUpd();
    }
}

// virtual shift touch start
function vsTe(e) {
    e.preventDefault();
    if (e.touches.length == 0) {
        Board.shiftOn = false;
        onVsUpd();
    }
}

// virtual shift touch start
function vsMd(e) {
    e.preventDefault();
    Board.shiftOn = true;
    onVsUpd();
}

// virtual shift touch start
function vsMu(e) {
    e.preventDefault();
    Board.shiftOn = false;
    onVsUpd();
}
