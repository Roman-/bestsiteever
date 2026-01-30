$(document).ready(function() {
    initMenu();
    Glob.canvas = $("<canvas>");
    $(window).resize(onCvResize);

    loAbout();
});

function initMenu() {
    $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
    $("#loMain").click(loMain);
    $("#loGallery").click(loGallery);
    $("#loAbout").click(loAbout);
}

function onCvResize() {
    if ($("#inGroup").length == 1) {
        setCanvasSize(Math.round($("#inGroup").width() * 0.9), Math.round(window.innerHeight * 0.75));
        doDrawing();
    }
}

// main layout
function loMain(immidiateDrawing = true) {
    let canvasWrap = $("<div id='canvasWrap'></div>").addClass('text-center mt-2').append(Glob.canvas).resize(onCvResize);
    let prep = $('<div class="input-group-prepend"> <span class="input-group-text" id="basic-addon1">f(x,y) = </span> </div>');
    let input = $("<input type='text' id='formula'></input>")
        .addClass('form-control')
        .val(randomInitFunc())
        // .val('gmpic(x,y)')
        .attr('placeholder', 'Type a formula, e.g. "x-y"')
        .on('keypress', onKp);
    function onKp(e) {
        if (e.which == 13)
            return btn.trigger('click');
    }
    var btn = $("<button class='btn btn-primary'></button>").html('Plot')
        .click(function () {
        doDrawing();
    });
    let append = $("<div class='input-group-append'></div>").append(btn);
    let inputGroup = $("<div id='inGroup'></div>").addClass('input-group').append(prep, input, append);
    let warningUnder = $("<div class='alert alert-warning' id='alertUnder'></div>").hide().click(function () {$(this).hide()});
    let panelWrap = $("<div></div>").addClass('row mt-2').append(inputGroup);

    let div = $("<div></div>").append(panelWrap, warningUnder, canvasWrap);
    $("#mainLayout").empty().append(div);

    if (immidiateDrawing) {
        setTimeout(function () {
            input.focus()
            setCanvasSize(Math.round(canvasWrap[0].clientWidth  * 0.95), Math.round(window.innerHeight * 0.75));
            doDrawing();
        }, 50);
    }
}

function substituteScript(formula) {
    formula = prependMathToFuncs(formula.trim());
    $("#yourScriptHere").empty().html("<script>function subs(x,y) {return "+formula+"}</script>");
}

function doDrawing() {
    substituteScript($("input#formula").val());
    let result = drawFuncOnCanvas(Glob.canvas);
    if (typeof result == 'string') {
        $('#alertUnder').html("<i class='fa fa-exclamation-circle mx-1'></i>" + result).show();
        return;
    } else {
        $('#alertUnder').html(result).hide();
    }
}

// immidiately paste formula and make a drawing
function onDrawByFormula(formula) {
    // if not on the layout, switch to it
    if ($("#inGroup").length == 0) {
        loMain(true);
    }
    $("input#formula").val(formula).focus();
    setCanvasSize(Math.round($("#inGroup").width() * 0.9), Math.round(window.innerHeight * 0.75));
    doDrawing();
}
