Glob.picImgData = null;
initGlobPic();

function initGlobPic(url = 'base_imgs/flower1.jpeg') {
    var image = new Image();
    image.onload = function() {
        // draw image...
        let width = image.width;
        let height = image.height;
        let canvas = $("<canvas></canvas>")
            .width(width).height(height)
            .attr('width', width).attr('height', height);

        let ctx = canvas[0].getContext('2d');

        ctx.drawImage(image, 0, 0);
        Glob.picImgData = ctx.getImageData(0, 0, width, height);
    }
    image.src = url;
}

function mona(x,y) {
    if (null === Glob.picImgData) {
        return 0;
    }
    let w = Glob.picImgData.width;
    x = Math.round(x) % w;
    y = Math.round(y) % Glob.picImgData.height;

    let i = x + y*w;
    if (i > Glob.picImgData.data.length)
        return 0;

    return Glob.picImgData.data[i*4];
}
