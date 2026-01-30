
$(document).ready(function() {
    settingsLayout = document.getElementById("settingsLayout");
    concLayout = document.getElementById("concLayout");
    memoLayout = document.getElementById("memoLayout");
    recallLayout = document.getElementById("recallLayout");
    reviewLayout = document.getElementById("reviewLayout");
    countDownLabel = document.getElementById("countDownLabel");

    reset();

    $("#speaker").bind('touchstart', function(){
        $("#memoStageHeader").html(getHintHtml);
    }).bind('touchend', function(){
        $("#memoStageHeader").html("#MemorizationStage");
    });

    $("#bodyid").bind("keyup", keyUp).bind("keydown", keyDown);

});
