// returns dataURL of PNG picture obtained from imagedata
// width, height - picture w and h in pixels. imageData size = width*height*4
// convert ImageData to PNG image ready to be downloaded
function imageDataToPngDataUrl(imageData) {
    let canvas = $("<canvas></canvas>");
    canvas.width(imageData.width).height(imageData.height).attr('width', imageData.width).attr('height', imageData.height);
    canvas[0].getContext('2d').putImageData(imageData, 0, 0);

    return canvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream");
}

// download imageData as PNG image
function downloadImageData(imageData, filename = 'miniature') {
    let link = $("<a></a>");
    link.attr('download', filename + '.png');
    link.attr('href', imageDataToPngDataUrl(imageData));
    link.get(0).click();
}

// download what's on canvas as PNG image
function saveCanvasAsPng(jqCanvas, filename = 'miniature') {
    let ctx = jqCanvas[0].getContext('2d');
    let data = ctx.getImageData(0, 0, Glob.width, Glob.height);
    return downloadImageData(data, filename);
}
