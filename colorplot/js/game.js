let Game = function () {}
Game.x = 15;
Game.y = 19;
Game.sqSize = 20;
Game.currD = dist(Glob.x, Glob.y, 0,0);
Game.maxDist = dist(Game.sqSize, Game.sqSize, 0,0);

// game pic. Depends on distance of (Game.x, Game.y) from center
function gmpic(x,y) {
    return mona(x,y);
}

function onDocKd(e) {
    let code = e.keyCode;
    if (code == 37) { // left
        Game.x -= 1;
    } else if (code == 38) { // up
        Game.y -= 1;
    } else if (code == 39) { // right
        Game.x += 1;
    } else if (code == 40) { // down
        Game.y += 1;
    }
    updateGame();
}


function boundXy() {
    // rect: -5, -5, 5, 5
    if (Game.x >= Game.sqSize)
        Game.x = -Game.sqSize+2;
    if (Game.x <= -Game.sqSize)
        Game.x = Game.sqSize-2;
    if (Game.y >= Game.sqSize)
        Game.y = -Game.sqSize+2;
    if (Game.y <= -Game.sqSize)
        Game.y = Game.sqSize-2;
    console.log(Game.x, Game.y);
}

function gamefrm(x,y) {
    let dScaled = Game.currD / Game.maxDist;
    let one = 1

    let zeroX = (Math.round(x/2)|Math.round(y/2))%2 ? dScaled * (x^y) : dScaled * (y|x);
    let zeroY = (Math.round(x/2)|Math.round(y/2))%2 ? dScaled * (x|y) : dScaled * (y^x);
    px = x * one + zeroX;
    py = y * one + zeroY;
    return mona(px, py);
}

function gamefrm2(x,y) {
    let dScaled = Game.currD / Game.maxDist; // from 0 to 1. Zero is what you need
    let one = Math.cos(dScaled * Math.sqrt(x/10));
    let zero = Math.sin(dScaled) * Math.sqrt(x*y) + Math.sqrt(dScaled/10)*(x|y);
    px = x * one + zero;
    py = y * one + zero;
    return mona(px, py);
}

function gamefrm3(x,y) {
    let dScaled = Game.currD / Game.maxDist;
    let one = 1

    let zeroX = (Math.round(x/2)|Math.round(y/2))%2 ? dScaled * (x|y) : dScaled * (y|x);
    let zeroY = (Math.round(x/2)|Math.round(y/2))%2 ? dScaled * (x|y) : dScaled * (y|x);
    px = x * one + zeroX;
    py = y * one + zeroY;
    return mona(px, py);
}

function updateGame() {
    boundXy();
    Game.currD = dist(Game.x,Game.y,0,0);
    onDrawByFormula('gamefrm(x,y)');
    $("input#formula").hide();
    if (Game.currD == 0) {
        // $("input#formula").show().val('You won!!!');
        $('#alertUnder').html("You won!!!").show()
            .removeClass('alert-warning').addClass('alert-success');
    }
}
