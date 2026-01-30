// Image obj to imagedata
function extractImageData(img) {
    // draw it on virtual canvas and extract image data from it
    let w = img.width;
    let h = img.height;
    let tempcanvas = $("<canvas></canvas>")
        .attr('width', w).attr('height', h);

    let ctx = tempcanvas[0].getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    let imageData = ctx.getImageData(0, 0, w, h);
    return imageData;
}

// returns difference from 0-1, where 0 = images are identical
// xoffset, yoffset - we copare data1[x,y] and data2[x+xoff, y+yoff]
function diff(imgData1, imgData2, xoff, yoff, imgDataOut = null) {
    if (!imgData1 || !imgData1.width || !imgData2 || !imgData2.width)
        return console.error("wrong args:",imgData1, imgData2);
    if (imgData1.width != imgData2.width || imgData1.height != imgData2.height) {
        console.error("img diff: dimentions dont match", imgData1, imgData2);
        return 1;
    }
    if (imgDataOut != null && imgData1.width != imgDataOut.width || imgData1.height != imgData2.height)
        return console.error("img data OUT: dimentions dont match", imgData1, imgDataOut);

    let w = imgData1.width;
    let h = imgData1.height;

    let xMin = Math.max(0, -xoff);
    let xMax = Math.min(w, w - xoff);
    let yMin = Math.max(0, -yoff);
    let yMax = Math.min(h, h - yoff);
    let area = (xMax - xMin) * (yMax - yMin);
    const threshold = 0.2;

    var x,y,diff=0;
    for (x = xMin; x < xMax; ++x) {
        for (y = yMin; y < yMax; ++y) {
            // compare data1[x,y] and data2[x+xoff, y+yoff]
            os1 = (w * y + x) * 4; // offset 1
            os2 = (w * (y+yoff) + x + xoff) * 4; // offset 2

            let rDiff = Math.abs(imgData1.data[os1] - imgData2.data[os2]);
            let gDiff = Math.abs(imgData1.data[os1+1] - imgData2.data[os2+1]);
            let bDiff = Math.abs(imgData1.data[os1+2] - imgData2.data[os2+2]);
            pxD = (rDiff+gDiff+bDiff)/765;
            diff += pxD;

            if (null != imgDataOut) {
                val = (pxD > threshold) ? 255 : 0;
                /*
                imgDataOut.data[os1+0] = val;
                imgDataOut.data[os1+1] = val;
                imgDataOut.data[os1+2] = val;
                */
                imgDataOut.data[os1+0] = rDiff;
                imgDataOut.data[os1+1] = gDiff;
                imgDataOut.data[os1+2] = bDiff;
                imgDataOut.data[os1+3] = 255;
            }
        }
    }
    return diff / area;
}

// returns array [r,g,b]
// imageData: ImageData object
// returns [-1, -1, -1] if out of bounds
function getRgbOfPixel(imageData, x, y) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
        x = Math.round(x);
        y = Math.round(y);
    }
    // out of bounds => same color as in bounds
    if (x < 0)
        x = 0;
    if (y < 0)
        y = 0;
    if (x >= imageData.width)
        x = imageData.width - 1;
    if (y >= imageData.height)
        y = imageData.height - 1;
    /*
    if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height)
        return [-1, -1, -1];
        */
    os = (imageData.width * y + x) * 4; // offset
    let d = imageData.data;
    r = (os+0) < d.length ? d[os+0] : -1;
    g = (os+1) < d.length ? d[os+1] : -1;
    b = (os+2) < d.length ? d[os+2] : -1;

    return [r,g,b];
}
