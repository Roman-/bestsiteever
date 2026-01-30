function loMain() {
    // let btnPlay = $("<button class='btn btn-primary mx-1'></button>").html('Play').click(onStartSound);
    let btnPlay = $("<button class='btn btn-primary mx-1 col-2'></button>").html('Play').click(playLayers);
    // let btnPause = $("<button class='btn btn-primary mx-1'></button>").html('Pause').click(onPauseSound);

    let freqRange = $("<input type='range'></input>")
        .addClass('mx-2 form-control')
        .attr('id', 'freqInput')
        .attr('min', 10)
        .attr('max', 3000)
        .val(400)
        .on('input', function () {onFreqChanged($(this).val())});

    let detRange = $("<input type='range'></input>")
        .addClass('mx-2 form-control')
        .attr('id', 'detuneInput')
        .attr('min', -100)
        .attr('max', 5000)
        .val(10)
        .on('input', function () {onDetuneChanged($(this).val())});

    let eraserButton = $("<button id='eraser' class='btn btn-outline-secondary'></button>")
        .html('eraser').click(onEraserToggled);

    let sparseSelect = $("<select class='form-control col-2'></select>")
        .on('input', function () {Glob.sparseIndex = ($(this).val());});
    $(["solid", "sparse", "very sparse", "super sparse"]).each(function (index, name) {
        let indeces = [0, 1/2, 3/4, 7/8];
        sparseSelect.append($("<option></option>").html(name).val(indeces[index]));
    });

    let claerBtn = $("<button class='btn btn-outline-secondary col-1'></button>").html('clear').click(clearCurrentLayer);

    let infoDiv = $("<div id='infoDiv'></div>");

    let panelDiv = $("<div class='row'></div>").append(claerBtn,eraserButton, sparseSelect, btnPlay)
    let div = $("<div></div>").append(
            // freqRange, detRange,
            panelDiv,
            Glob.canvas,
            infoDiv
            );
    setCurrentLayer(0);

    $("#mainLayout").empty().append(div);
}
