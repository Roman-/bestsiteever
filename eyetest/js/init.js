$(document).ready(function() {
    Global.canvas = $("#myCanvas");

    if (isMobile())
        Global.canvas[0].ontouchstart=function(e) { e.preventDefault(); canvasTouched(e.touches[0]); }
    else
        Global.canvas.mousedown(function (e) {e.preventDefault(); canvasTouched(e);});

    setCanvasSize();
    $(window).resize(function () {setCanvasSize(); fillCanvas();});
    timer = document.getElementById("timer"); // TODO Fix

    startGameCycle();

    loadPlayerData();
    loadBottomScore();
    loadLeaderboard();
    $("#sendScore").click(onSendScoreClick);
    $("#cancelScore").click(function () {$("#leaderBoardSend").hide();});
    $("#statusTd").click(function (){if (confirm("Do you want to erase your best score?")) {eraseUserData();}});
    $("#lbDialog").dialog({autoOpen: false});
    // $('body').keyup(function(e){ if(e.keyCode == 69){if (confirm("Do you want to erase your hiscore?")) eraseUserData();} });
    // test
});

function setCanvasSize() {
    Global.canvasSize = Math.floor(Math.min($("#gameDiv").width(), $("#gameDiv").height()));
    Global.canvas.width(Global.canvasSize).height(Global.canvasSize);
    Global.canvas[0].width = Global.canvas[0].height = Global.canvasSize;
    Global.ctx = Global.canvas[0].getContext("2d");
}
