Solver = function () {};

Solver.stack = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // stack of moves
Solver.size = 1;
Solver.radix = 8;
// moves: 0123 (clockwise), 4567 (ccw)

function initStack() {
    Solver.size = 1;
    Solver.stack = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
}

// moves_ = [0,0,0,0,0,0,0,0,0,0,0,0,0,0] - array of moves; first element is last move
// size - number of moves (current)
// radix - possible number of moves
// returns new size (new number of moves)
// isRedundant - function (i,j) that shows if indeces i,j correspond to moves like R, L, M, L'
// areCancellations - function (i,j) that shows if indeces i,j correspond to moves like R, R', R2
function radix_inc(moves_, size_, radix, areParallelLayers, areSameLayer) {
    var hasRedundancy;
    var newSize = size_, i,j,k;
    ++moves_[0];
    var hasRedundancy = true;
    while (hasRedundancy) {
        i = 0;
        while(moves_[i] >= radix) {
            moves_[i] = 0;
            if (i == newSize - 1) {
                moves_[i] = 0;
                moves_[newSize++] = 0;
            } else {
                ++moves_[++i];
            }
        }
        // check for redundancy
        hasRedundancy = false; // assumption
        for (j = newSize-1; j > 0; --j) {
            // 1) find an interval (i, j] consisting of parallel layer moves only
            i = j;
            while (--i >= 0 && areParallelLayers(moves_[i], moves_[j])) {}
            // 2) check if somewhere on this interval there's a move similar to moves[j]
            for (k = j-1; k > i; --k) {
                if (areSameLayer(moves_[j], moves_[k])) {
                    //qDebug() << toString() << "has similar: #" << k << "#" << j;
                    ++moves_[k];
                    hasRedundancy = true;
                    break;
                }
            }
            if (hasRedundancy)
                break; // no need to check the rest of the interval
        }
    }
    return newSize;
}

// stack to string (inversed). First digit is last move
function stackToString(stack, size) {
    let s = "";
    /*
    for (let i = size-1; i >= 0; --i)
        s += stack[i];
        */
    for (let i = 0; i < size; ++i)
        s += stack[i];
    return s;
}
