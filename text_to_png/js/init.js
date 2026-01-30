$(document).ready(function() {
    initGlobElements();
    loMain();
});

function initGlobElements() {
    Glob.canvas = $('<canvas></canvas>').attr("id", "glob-canvas");

    let downloadCanvasImage = ()=>{
        downloadImage(Glob.canvas[0].toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream'), Config.filename + ".png");
    }

    Glob.inputFileName = $("<input type='text'>")
        .val("0000")
        .prop("title", "file name")
        .bind("change input", ()=>{
        let filename = Glob.inputFileName.val().trim();
        Config.filename = (filename === "") ? "no_name" : filename;
    }).on("keyup", (e)=>{
        if (e.which === 13) {
            downloadCanvasImage();
        }
    });

    Glob.btnDownload = $("<a class='btn btn-primary clickable'></a>")
        .html(fa("download") + "Download")
        .prop("download", Config.filename)
        .click(downloadCanvasImage);

    Glob.examplesRow = $("<div></div>").addClass("row");
    Glob.colorsRow = $("<div></div>").addClass("row");

}
