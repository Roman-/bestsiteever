function loMain() {
    Glob.canvasWrapper = $("<div id='canvasWrapper'></div>");

    let uploadBtn = $("<button></button>").html('upload image...').click(uploadPic);
    var gridBtn = $("<button></button>").click(initGrid).html('grid');
    var stopBtn = $("<button></button>").click(function () {Glob.particles = []}).html('stop');
    var clearBtn = $("<button></button>").click(function () {Glob.particles = []; clearCanvas()}).html('clear');
    var dwnldBtn = $("<button></button>").click(downloadWhatsOnCanvas).html('download');
    var numParticlesSpan = $("<span id='numParticles' class='ml-1'></span>").html('click inside the box below to start creating');
    $("#statusBar").append(uploadBtn, gridBtn, clearBtn, stopBtn, dwnldBtn, numParticlesSpan);

    let leftPanel = $("<div class='col-8'></div>").append(Glob.canvasWrapper);


    let randomizeParamsBtn = $("<button class='btn btn-sm btn-primary'></button>").html('randomize').click(randomizeParams);
    // let downloadPresetBtn = $("<button class='btn btn-sm btn-primary'></button>").html('save').click(downloadPreset);
    let paramsBtnsRow = $("<div></div>").append(randomizeParamsBtn, jqPresetsSelect());
    let rightPanel = $("<div class='col-4'></div>").append(paramsBtnsRow, paramsToGui());

    let row = $("<div class='row w-100'></div>").append(leftPanel, rightPanel);

    $("#mainLayout").empty().append(row);
}

function setTitle(txt) {
    $("#appTitle").html(txt);
}

function downloadWhatsOnCanvas() {
    let link = $("<a></a>");
    link.attr('download', 'snakes-'+someRandomShit()+'.png');
    link.attr('href', Glob.canvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.get(0).click();

    function someRandomShit() {
        let d = new Date();
        return '' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
    }
}
