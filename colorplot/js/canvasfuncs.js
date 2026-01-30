function setCanvasSize(w = 200, h = 200) {
    if (!Glob.canvas)
        Glob.canvas = $("<canvas>");
    Glob.width = w;
    Glob.height = h;
    Glob.canvas
        .width(Glob.width).height(Glob.height)
        .attr('width', Glob.width).attr('height', Glob.height)
        // .css('width', '100%').css('height', '100%');
}


// returns 0 if no error; otherwise returns error msg
function drawFuncOnCanvas(jqCanvas) {
    let ctx = jqCanvas[0].getContext('2d');
    // ctx.fillRect(0,0,Glob.width, Glob.height); // crear
    let imageData = ctx.getImageData(0, 0, Glob.width, Glob.height);

    let data = imageData.data;
    var x,y,c;
    var errorObj = null;

    for (var i = 0; i < data.length && !errorObj; i+=4) {
        x = (i/4) % Glob.width;
        y = Math.floor((i/4) / Glob.width);

        xScaled = (x-Glob.sx) * Glob.fx;
        yScaled = (y-Glob.sy) * Glob.fy;

        try {
            t = Math.round(subs(xScaled, yScaled));
            c = pf(t);
            data[i] = c[0];
            data[i+1] = c[1];
            data[i+2] = c[2];
            data[i+3] = 255;

        } catch (e) {
            errorObj = e;
        }
    }

    if (null !== errorObj) {
        return errorObj.message;
    }

    ctx.putImageData(imageData, 0, 0);

    return 0;
}

// return random functino to start with
function randomInitFunc() {
    let coolfuncs = [
        "sin(x*y / 10) * 255",
    ];
    return randomElement(coolfuncs);
}
