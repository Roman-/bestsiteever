var strings = [];
var timerId = null;

$(document).ready(function() {
    // upload buttons
    $('#startbtn').click(startGiveaway);
    $('body').keydown(onbodykd);
    $('#stylebtn').click(applyStyle);
    $('#resetStylebtn').click(resetStyle);
    $('#compNameInput').change(applyName);
    $('#stylizeButton').click(function (){$("#name").show(); $("#stylingArea").show(); $("#stylizeButton").hide();});
    $('#titleButton').click(displayTitleArea);
    $('html').bind('touchstart', stopGiveaway);
    $('#appPreview').hide();

    loadAll();
});

function displayTitleArea() {
    $("#titleArea").show();
    $("#titleButton").hide();
    $("#compNameInput").focus().select();
}

function applyName() {
    $("#title").html($("#compNameInput").val());
    saveAll();
}

function applyStyle() {
    saveAll();

    var s = $("#bodycss").val();
    $("#styleSheet").html(s);
    $("#name").show();
}

function resetStyle() {
    var s = Global.defaultStyle;
    console.log(s);
    $("#styleSheet").html(s);
    $("#bodycss").val(s);
    saveLocal("giveawayStyle", s);
    $("#name").show();
}

function getCompetitorsList() {
    var raw = $("#strings").val().split("\n");
    var result = [];
    raw.forEach(function(n) {
        var str = n.trim();
        if (str != "")
            result.push(str);
    });
    return result;
}

// deprecated: detect names automatically
function getCubecompsCompetitorsList() {
    var raw = $("#strings").val().split("\n");
    var result = [];
    raw.forEach(function(n) {
        if (n.indexOf(' (') != -1)
                n = n.split(' (')[0];
        var len = n.split(' ').length;
        if (len == 2 || len == 3)
            result.push(n);
    });
    return result;
}

function startGiveaway() {
    $("#name").show();
    saveAll();

    strings = getCompetitorsList();
    if (strings.length < 2) {
        alert("Please enter candidates list");
        return;
    }

    // start
    $("#title").html($("#compNameInput").val());
    $("#settingsDiv").hide();
    $(document).attr("title", "hit Spacebar!");
    timerId = setInterval(displayRndName, 70);
}

function stopGiveaway() {
    if (timerId != null) {
        clearInterval(timerId);
        timerId = null;
        // additional info
        $(document).attr("title", $("#name").html() + " is the winner!");
    }
}

function onbodykd(event) {
    if ( event.which == 32 ) {
        stopGiveaway();
    }
}

function displayRndName() {
    var name = randomElement(strings);
    $("#name").html(name);
}


function randomElement(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}
