Glob.isDrawing = false; // mouse is pressed and were drawing
Glob.isEraser = false; // eraser instrument is selected

function onEraserToggled() {
    if (!Glob.isEraser) {
        // ENABLE ERASER
        Glob.isEraser = true;
        Glob.canvas.css('cursor', 'text').css('border-color', 'red');
        $("button#eraser").addClass('btn-danger').removeClass('btn-outline-secondary');
    } else {
        Glob.isEraser = false;
        Glob.canvas.css('cursor', 'crosshair').css('border-color', 'black');;
        $("button#eraser").addClass('btn-outline-secondary').removeClass('btn-danger');
    }
}

// allows for sparse drawing
function addPoint(x,y) {
    if (Glob.isEraser)
        y = 0;
    // sparse drawing: if there is a point already, draw sparsely
    if (Glob.layer[x] != 0) {
        if (Math.random() < Glob.sparseIndex)
            return;
    }
    Glob.layer[x] = y;
}

function setCurrentLayer(i) {
    Glob.currentLayer = i;
    Glob.canvas.css('border-color', Glob.layerColor);
}

function layerToImageData() {
    let imageData = Glob.canvaCtx.getImageData(0, 0, Glob.canvasW, Glob.canvasH);
}

function updateCanvas() {
    Glob.canvaCtx.fillStyle = 'white';
    Glob.canvaCtx.fillRect(0,0,Glob.width, Glob.height);
    var cIndex = 0,x,y;
    Glob.canvaCtx.fillStyle = Glob.layerColor;
    for (x = 0; x < Glob.layer.length; x++) {
        y = Glob.layer[x];
        if (y == 0)
            continue;
        Glob.canvaCtx.fillRect(x, y, 2, 2);
    }
}

function drawTimeline(x) {
    updateCanvas();
    Glob.canvaCtx.fillRect(x, 0, 3, Glob.height);
}

function clearCurrentLayer() {
    for (let j = 0; j < Glob.layerLength; j++) {
        Glob.layer[j] = 0;
    }
    updateCanvas();
}

Glob.prevCoords = [0,0]; // previous coordinates to interpolate (later)
function onCanvaMouseDown(e) {
    Glob.prevCoords = [e.offsetX, e.offsetY];
    Glob.isDrawing = true;
    addPoint(e.offsetX, e.offsetY);
    updateCanvas();
}

// linear interpolation
// param x - target x. Returns target y
function lerp(x1, y1, x2, y2, x) {
    return y1 + (y2-y1)/(x2-x1) * (x-x1);
}

function onCanvaMouseMove(e) {
    if (!Glob.isDrawing)
        return;
    // add points in between 2 Xes
    let x = e.offsetX; // current
    let y = e.offsetY; // current
    let prevX = Glob.prevCoords[0];
    let prevY = Glob.prevCoords[1];
    for (let inX = x; inX != prevX; (inX > prevX) ? inX-- : inX++) {
        let inY = lerp(prevX, prevY, x,y,inX); // interpolate
        addPoint(inX, inY);
    }
    addPoint(x, y);

    Glob.prevCoords = [x,y];
    updateCanvas();
}
function onCanvaMouseUp(e) {
    Glob.isDrawing = false;
}
function onCanvasGesture(e) {
    $("#infoDiv").html("<h1>This drawing thing does not work with gestures (touches). You would need a real computer mouse</h1>");
}

// maps y coordinate to real frequency (note that in canvas y-coord goes upside-down)
function yCoordToFreq(y) {
    if (y == 0)
        return 0;
    return (Glob.height - y) / Glob.height * Glob.maxFreq;
}
