$(document).ready(function() {
    initMenu();
    loadMainImg(onImageLoaded);
    loMain();
});

function initMenu() {
    $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
}

function uploadPic() {
    $('#imgFile').val(null).trigger("click");
}

function onUploadImgChange() {
    file = $('#imgFile')[0].files[0];
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        Glob.img = new Image();
        Glob.img.src = reader.result;
        Glob.img.addEventListener('load', onImageLoaded);
        Glob.imgFileName = file.name;
    }, false);

    reader.readAsDataURL(file);
}

function loadMainImg() {
    Glob.img = new Image();
    Glob.img.crossOrigin = "Anonymous";
    Glob.img.addEventListener('load', onImageLoaded);
    Glob.img.src = Glob.imgSrc;
}

function onImageLoaded() {
    Glob.w = Glob.img.width;
    Glob.h = Glob.img.height;

    // split vertically
    Glob.canvas = $("<canvas></canvas>")
        .css('border', '1px solid black')
        .attr('width', Glob.w).attr('height', Glob.h)
        .width(Glob.w).height(Glob.h)
        .on('mousedown', onCanvasMd)
        .on('mouseup', onCanvasMu)
        .on('mousemove', onCanvasMm)
    Glob.canvasImg = $("<canvas></canvas>")
        .css('border', '1px solid black')
        .attr('width', Glob.w).attr('height', Glob.h);
    Glob.ctx = Glob.canvas[0].getContext('2d');
    Glob.ctxImg = Glob.canvasImg[0].getContext('2d');
    Glob.imgData = extractImageData(Glob.img);

    Glob.canvasWrapper.html(Glob.canvas);
}

function clearCanvas() {
    Glob.ctx.clearRect(0,0,Glob.w, Glob.h);
}
