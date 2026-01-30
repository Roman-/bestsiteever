$(document).ready(function() {
    initMenu();
    initLayer();
    initGlobCanvas();
    loMain();
    updateCanvas();
    onEraserToggled(); onEraserToggled();
});

function initGlobCanvas() {
    if (!Glob.canvas)
        Glob.canvas = $("<canvas>");
    Glob.canvas
        .on('mousedown', onCanvaMouseDown)
        .on('mousemove', onCanvaMouseMove)
        .on('mouseup', onCanvaMouseUp)
        .on('touchstart', onCanvasGesture)
        .css('border', '1px solid red')
    setCanvasSize();
    Glob.canvaCtx = Glob.canvas[0].getContext('2d');
}

function setCanvasSize() {
    Glob.width = Glob.layerLength;
    Glob.height = 300;
    if (!Glob.canvas)
        Glob.canvas = $("<canvas>");
    Glob.canvas
        .width(Glob.width).height(Glob.height)
        .attr('width', Glob.width).attr('height', Glob.height)
}

// init Glob.layers
function initLayer() {
    Glob.layer = [];
    for (let j = 0; j < Glob.layerLength; j++) {
        Glob.layer.push(0);
    }

    // layer 0: for fun we init with parabola
    for (let j = 0; j < Glob.layerLength; j++) {
        Glob.layer[j] = Math.round(150 + 100 *Math.sin(j / 500 * (6 * 2 * Math.PI)));
    }
}

function initMenu() {
    $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
    $("#openvisu").click(
        function () {
            url = "https://sunandstuff.com/spectrum/";
            window.open(url,'_blank');
        });
    $("#openvisu").click(
        function () {
            url = "https://sunandstuff.com/spectrum/";
            window.open(url,'_blank');
        });
}

