var pstate = [1,2,3,4,5,6,7,8,9];
// let twoswap = [1,2,3,4,5,6,7,9,8];

let statesToFindSolution = [
    /*
    ["5-6", [1,2,3,4,6,5,7,8,9]],
    ["8-9", [1,2,3,4,5,6,7,9,8]],
    ["5-8", [1,2,3,4,8,6,7,5,9]],
    ["6-9", [1,2,3,4,5,9,7,8,6]],
    ["5-6,8-9", [1,2,3,4,6,5,7,9,8]],
    ["5-8,6-9", [1,2,3,4,8,9,7,5,6]],
    ["5-9,6-8", [1,2,3,4,9,8,7,6,5]],
    ["6-9-8", [1,2,3,4,5,9,7,6,8]],
    ["6-8-9", [1,2,3,4,5,8,7,9,6]],
    ["null", [1,2,3,4,5,6,7,8,9]],
    ["6-8", [1,2,3,4,5,8,7,6,9]],
    ["5-9", [1,2,3,4,9,6,7,8,5]],
    */
]

var tmp;
// param a - array
function m4(a, i1,i2,i3,i4) {
    tmp=a[i1]; a[i1]=a[i2]; a[i2]=a[i3]; a[i3]=a[i4];a[i4]=tmp;
}

//m -move from 0 to 7
function applyMove(a, m) {
    switch(m) {
        case 0: return m4(a,0,3,4,1);
        case 1: return m4(a,1,4,5,2);
        case 2: return m4(a,3,6,7,4);
        case 3: return m4(a,4,7,8,5);
        case 4: return m4(a,0,1,4,3);
        case 5: return m4(a,1,2,5,4);
        case 6: return m4(a,3,4,7,6);
        case 7: return m4(a,4,5,8,7);
        default: console.error("move unknown", m,"a=",a); return;
    }
}

function undoMove(a,m) {
    return applyMove(a, (m+4)%8);
}

function applyAlg(alg, size, state) {
    for (i = size-1; i >= 0; --i)
        applyMove(state, alg[i]);
}
function undoAlg(alg, size, state) {
    for (i = 0; i < size; ++i)
        undoMove(state, alg[i]);
}

function stateToGrid(a, html=false) {
    let br = html ? "<br>" : "\n";
    return ''
        + a[0] + a[1] + a[2] + br
        + a[3] + a[4] + a[5] + br
        + a[6] + a[7] + a[8];
}

function isStateSolved(a) {
    for (i = 0; i < a.length; ++i)
        if (a[i] !== (i+1))
            return false;
    return true;
}

function algToString(stackSizePair) {
    let s = "";
    for (i = stackSizePair[1]-1; i >= 0; --i)
        s += stackSizePair[0][i];
    return s;
}

// returns array of algs as strings
function sovleState(a, algsToFind = 10) {
    let foundAlgs = [];
    const maxMovesNum = 8;
    console.log("solving state:\n", stateToGrid(a));
    initStack();
    let falseFunc = function () {return false}
    while (Solver.size < maxMovesNum) {
        Solver.size = radix_inc(Solver.stack, Solver.size, Solver.radix, falseFunc, falseFunc);
        applyAlg(Solver.stack, Solver.size, a);
        if (isStateSolved(a)) {
            foundAlgs.push(solutionToIolk([Solver.stack, Solver.size]));
            if (foundAlgs.length > 10)
                break;
        }
        undoAlg(Solver.stack, Solver.size, a);
    }
    if (Solver.size >= maxMovesNum) {
        console.warn("Could not find solution for state", a, " in ", maxMovesNum + " moves");
    }
    return foundAlgs;
}

function moveToIolk(m) {
    switch(m) {
        case 0: return "u";
        case 1: return "i";
        case 2: return "j";
        case 3: return "k";
        case 4: return "U";
        case 5: return "I";
        case 6: return "J";
        case 7: return "K";
        default: console.error("iolk: move unknown", m); return;
    }
}

function solutionToIolk(StackSizePair) {
    let s = "";
    for (i = StackSizePair[1]-1; i >= 0; --i)
        s += moveToIolk(StackSizePair[0][i]);
    return s;
}

function stest() {
    statesToFindSolution.forEach(function (pair) {
        let name = pair[0];
        let state = pair[1];
        let res = sovleState(state);

        $("#solverDiv").append($("<div></div>").html("<h1>"+name+ "</h1>" + "" + res.join("<br>")));
    });
    /*
    console.log(stateToGrid(pstate));
    applyAlg([0,0,0], 1, pstate);
    console.log(stateToGrid(pstate));
    */
}
