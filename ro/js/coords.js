// returns index of tile
function pieceIndexByIj(i,j) {
    return j*(Board.width) + i;
}

// returns [i,j] of piece in the board by its index
function pieceIjByIndx(index) {
    return [index % Board.width, Math.floor(index / Board.width)];
}

// returns index of handle in Board.handles
function handleIndexByIj(i,j) {
    return j*(Board.width-1) + i;
}

// returns [i,j] of handle by its number
function handleIjByIndx(index) {
    const w = (Board.width-1);
    return [index % w, Math.floor(index / w)];
}

// Ro handle position (i,j) by coordinates in the glass
function rhiByCoords(x,y) {
    let p = [
        Math.floor((x - Board.tileSize/2) / (Board.tileSize + Board.padding)),
        Math.floor((y - Board.tileSize/2) / (Board.tileSize + Board.padding))
    ];
    if (p[0] >= Board.width-1)
        p[0] = Board.width-2;
    if (p[1] >= Board.height-1)
        p[1] = Board.height-2;
    if (p[0] < 0)
        p[0] = 0;
    if (p[1] < 0)
        p[1] = 0;
    return p;
}

// returns true if there's a tile with indeces i,j
function indxInBounds(i,j) {
    return i >= 0 && j >= 0 && i < Board.width && j < Board.height;
}

// by indeces i,j returns coordinates
function posByIndeces(j,i) {
    return [j * (Board.tileSize + Board.padding), i * (Board.tileSize + Board.padding)];
}
