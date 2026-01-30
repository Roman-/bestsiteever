// I is colomn number
var gridDiff, gridSize, gridScore, misclicks, stumbleTout, targetI, targetJ, currColors;

// x,y - local coordinates (0,0 is left-top corner)
function canvasTouched(e) {
    stopTwinkling();
    var rect = Global.canvas[0].getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var tileSize = Global.canvasSize / gridSize;
    var isTarget = ((x >= targetI * tileSize && x <= ((targetI+1) * tileSize)) &&
                    (y >= targetJ * tileSize && y <= ((targetJ+1) * tileSize)));


    clickedOnCell(isTarget);
}

function drawPoints(pts) {
    ctx = Global.ctx;
    var textWidth = Global.canvasSize * 0.8;
    var gradient = Global.ctx.createLinearGradient(0, 0, Global.canvasSize, Global.canvasSize);
    gradient.addColorStop("0",   "red");
    gradient.addColorStop("0.2", "magenta");
    gradient.addColorStop("0.4", "green");
    gradient.addColorStop("0.6", "yellow");
    gradient.addColorStop("0.8", "blue");
    gradient.addColorStop("1.0", "red");
    Global.ctx.fillStyle = gradient;
    ctx.strokeStyle = "gray";
    Global.ctx.lineWidth = 0.9;

    ctx.font = textWidth + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText('' + pts, Global.canvasSize/2, Global.canvasSize/3 + textWidth/2);
    // ctx.strokeText('' + pts, Global.canvasSize/2, Global.canvasSize/3 + textWidth/2);

    // cheering message or something
    textWidth /= 6;
    ctx.font = textWidth + "px Arial";
    ctx.fillText((pts > Global.playerHiScore) ? 'New best score!' : 'Keep it up!',
            Global.canvasSize/2, Global.canvasSize - textWidth/2);
    ctx.strokeText((pts > Global.playerHiScore) ? 'New best score!' : 'Keep it up!',
            Global.canvasSize/2, Global.canvasSize - textWidth/2);
}

function clickedOnCell(istarget) {
    if (!Global.clickable)
        return;
    if (!running)
        startTimer();
    misclicks += (istarget ? 0 : 1);
    if (misclicks >= Global.misclicksB4Hint) {
        misclicks = 0;
        twinkTargetCell();
        clearTimeout(stumbleTout);
        stumbleTout = setTimeout(twinkTargetCell, Global.secondsB4Hint*1000);
    }
    gridScore += (istarget ? 1 : -1);
    setStatus(gridScore);
    if (istarget) {
        gridSize = Math.min(gridSize + 1, Global.maxGridSize);
        //gridSize = 4+RND(maxGridSize - 4); // if playing in random mode
        gridDiff = Math.ceil(Math.max(gridDiff * Global.gridColorFactor, Global.gridMinColorDiff));
        updateTable();
        clearTimeout(stumbleTout);
        stumbleTout = setTimeout(twinkTargetCell, Global.secondsB4Hint*1000);
    }

    $("#statusTd").effect( "highlight", {color: (istarget ?  "#0a0" : '#a00')}, 400 );
}

function RND(mx) {
    return Math.floor(Math.random() * mx);
}

function generateColor() {
    var r = RND(200), g = RND(200), b = RND(200);
    var rDiff = Math.random(), gDiff = Math.random(), bDiff = Math.random();
    var sum = rDiff + gDiff + bDiff;
    rDiff = Math.floor(rDiff/sum*gridDiff);
    gDiff = Math.floor(gDiff/sum*gridDiff);
    bDiff = Math.floor(bDiff/sum*gridDiff);
    var bString = "rgb(" + r + "," + g + "," + b + ")";
    var r1 = r+rDiff, g1 = g+gDiff, b1 = b+bDiff;
    var bTarget = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    return {"basic": bString, "target": bTarget};
}

function twinkTargetCell(level=3) {
    if (level == 3)
        Global.twinkling = true;

    if (level <= 0 || !Global.twinkling) {
        clearTimeoutAndNull(Global.twinkleTimer);
        return;
    }

    var tileSize = Global.canvasSize/gridSize;
    var left = targetI * tileSize + Global.margin, top = targetJ * tileSize + Global.margin,
        width = tileSize - 2*Global.margin, height = width;
    var gradient = Global.ctx.createLinearGradient(left, top, left + width, top + height);
    gradient.addColorStop("0",   "red");
    gradient.addColorStop("0.2", "magenta");
    gradient.addColorStop("0.4", "orange");
    gradient.addColorStop("0.6", "yellow");
    gradient.addColorStop("0.8", "blue");
    gradient.addColorStop("1.0", "red");
    Global.ctx.strokeStyle = gradient;
    Global.ctx.lineWidth = 3;

    Global.ctx.strokeRect(left, top, width, height);
    Global.twinkleTimer = setTimeout(function() {fillCanvas(); setTimeout(function (){twinkTargetCell(level-1)},70);}, 70);
}

function fillCanvas() {
    if (currColors == null)
        return;
    var ctx = Global.ctx;
    ctx.fillStyle = Global.gridBgCol;
    ctx.fillRect(0,0,Global.canvasSize,Global.canvasSize);

    ctx.fillStyle = currColors["basic"];
    var tileSize = Global.canvasSize / gridSize;
    var elemSize = tileSize - Global.margin * 2;
    for (var i = 0; i < gridSize; ++i)
        for (var j = 0; j < gridSize; ++j)
            ctx.fillRect(i * tileSize + Global.margin, j * tileSize + Global.margin, elemSize, elemSize);

    // tile
    ctx.fillStyle = currColors["target"];
    ctx.fillRect(targetI * tileSize + Global.margin, targetJ * tileSize + Global.margin, elemSize, elemSize);

    if (!Global.clickable && (typeof gridScore == 'number'))
        drawPoints(gridScore);
}

function clear() {
    misclicks = 0;
    clearTimeout(stumbleTout);
    stopTwinkling();
}

function stopTwinkling() {
    clearTimeoutAndNull(Global.twinkleTimer);
    Global.twinkling = false;
}

function setStatus(score) {
    if (typeof score === 'number')
        $("#status").html("Score: " + score + (Global.playerHiScore > 0 ?
                    "<br><span id='bestScore'>Best: "+Global.playerHiScore+"</span>" : ""));
    else if (typeof score === 'string')
        $("#status").html(score);
    else
        $("#status").html("");
}

function generateNewGridData() {
    currColors = generateColor();
    targetI = 1 + RND(gridSize-2), targetJ = 1 + RND(gridSize-2);
}
function updateTable() {
    generateNewGridData();
    fillCanvas();
}

function startGameCycle() {
    Global.clickable = true;
    clear();
    gridDiff = Global.startGridDiff, gridSize = Global.startGridSize;
    updateTable();
    $("#timer").html("Click on the square with different color");
    setStatus("");
    gridScore = 0;
    $("#leaderBoardSend").hide();
}

// updates local game statistics: hiscore, gamesplayed
function gameOver() {
    clear();
    twinkTargetCell();
    drawPoints(gridScore);
    Global.gamesPlayed++;

    Global.clickable = false;

    // if eligible for leaderboard top100, display the question
    showLeaderBoardSend();

    Global.playerHiScore = Math.max(Global.playerHiScore, gridScore);
    savePlayerData();
    $("#timer").html("<a class='butn bigbtn' onclick='startGameCycle();'>start again</a>");
}

function eligibleForPbSubmit() {
    var result = (Global.bottomScore !== null && Global.bottomScore < gridScore && gridScore > Global.playerHiScore && Global.gamesPlayed > 0);
    // if (!result)
        // console.log("not eligible for submission: bottom = ", Global.bottomScore, "hiscore = ", Global.playerHiScore);
    return result;
}

function showLeaderBoardSend() {
    if (!eligibleForPbSubmit())
        return;
    $("#leaderBoardSend").show();
    // $("#playerName").focus().select();
     $("#playerName").focus();
}

function onSendScoreClick() {
    var enteredName = $("#playerName").val();
    if (isNameValid(enteredName)) {
        Global.playerName = enteredName;
        savePlayerData();
    } else {
        $("#playerName").effect( "highlight", {color: ('#a00')}, 700 );
        return;
    }
    // sending...
    sendPost("addtoleaderboard.php", "name="+encodeURIComponent(enteredName)
            +"&score="+gridScore+"&gamesplayed="+Global.gamesPlayed+"&h="+mh835(),
        function(response) {
            var checkString = "success";
            if (response.indexOf(checkString) == 0) {
                // update leader thing.
                $("#leaderBoardSend").hide();
                loadLeaderboard();
            } else {
                $("#playerName").effect( "highlight", {color: ('#a00')}, 500 );
                // console.log("response" + response);
            }
        },
        function(msg){
            // console.error("error when tried to send: " + msg);
            $("#leaderBoardSend").effect( "highlight", {color: ('#a00')}, 500 );
        });
}
