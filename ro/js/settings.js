// puzzle type name  based degrees
function getPtName(deg) {
    switch(deg) {
        case 0: return "Twiddle";
        case 90: return "Ro";
        case 45: return "Half-ro";
        case 22.5: return "Annoying 22.5";
        default: return "???";
    }
}

// puzzle is named based on dimentions and degrees
function getPuzzleName() {
    return getPtName(Board.rDeg) + " " + Board.width + "x" + Board.height;
}

// loads from localstorage
function loadSettings() {
    Glob.showTimer = parseInt(loadLocal("Glob.showTimer", "0"));
    Board.tileSize = parseInt(loadLocal('Board.tileSize', '100')); // size of one tile in pixels
    Board.scheme = parseInt(loadLocal('Colors.scheme', '1'));
    Board.padding = parseInt(loadLocal('Board.padding', '5'));
    Colors.borderRadius = parseInt(loadLocal('Colors.borderRadius', '25'));
    Colors.scheme = parseInt(loadLocal('Colors.scheme', '1'));
    Colors.hText = parseInt(loadLocal('Colors.hText', '0'));
    Board.rDeg = parseFloat(loadLocal('Board.rDeg', '0')); // ro by default
    Colors.animationTime = parseFloat(loadLocal('Colors.animationTime', '0.25'));
    Board.showVirtualShift = loadLocal('Board.showVirtualShift', 'false')=="true";
    Glob.showTimer = loadLocal('Glob.showTimer', 'false')=="true";
    Glob.roNightMode = loadLocal('Glob.roNightMode', 'false')=="true";

    Board.width = parseInt(loadLocal('Board.width', '3'));
    Board.height = parseInt(loadLocal('Board.height', '3'));
    displayTime(Glob.showTimer ? 'ready' : getPuzzleName());

    if (Glob.roNightMode)
        DarkReader.enable(Glob.dmFixes);
    else
        DarkReader.disable();
}

// re-draw board etc.
function jqSettings() {
    /*   TILE SIZE    */
    let minusTileSize = $("<button class='btn btn-outline-primary'>−</button>").click(function () {
        if (Board.tileSize > 20)
            Board.tileSize -= 5;
        saveLocal('Board.tileSize', Board.tileSize);

        initBoard();
    });
    let plusTileSize = $("<button class='btn btn-outline-primary'>+</button>").click(function () {
        Board.tileSize += 5;
        saveLocal('Board.tileSize', Board.tileSize);

        initBoard();
    });

    let tileSizeGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Board size</label></div>"),
                minusTileSize,
                plusTileSize
    );

    /* padding */
    let minusPadding = $("<button class='btn btn-outline-primary'>−</button>").click(function () {
        if (Board.padding > 0)
            Board.padding -= 1;
        saveLocal('Board.padding', Board.padding);

        initBoard();
    });
    let plusPadding = $("<button class='btn btn-outline-primary'>+</button>").click(function () {
        if (Board.padding < 50)
            Board.padding += 1;
        saveLocal('Board.padding', Board.padding);

        initBoard();
    });

    let paddingGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Gaps between tiles</label></div>"),
                minusPadding,
                plusPadding
    );

    /* puzzle dimentions */
    var dimenSelect = $("<select class='custom-select'></select>").change(function (e) {
        // resize puzzle also
        let oldSize = Board.width;
        pair = $(this).val().split('x');
        Board.width = pair[0];
        Board.height = pair[1];
        saveLocal('Board.width', Board.width);
        saveLocal('Board.height', Board.height);

        // new size
        let newSize = Board.width;
        let factor = oldSize/newSize;
        Board.tileSize = Math.ceil(Board.tileSize * factor + 1.5);
        Board.tileSize -= (Board.tileSize)%5;
        saveLocal('Board.tileSize', Board.tileSize);
        initBoard();
    });
    ["3x2", "3x3", "4x3", "4x4", "4x5", "5x5", "6x6", "7x7"].forEach(function (dimens) {
        let isCurrent = (Board.width+"x"+Board.height == dimens);
        dimenSelect.append($("<option></option>").html(dimens).val(dimens).prop('selected', isCurrent));
    });

    /* puzzle type */
    let degSelect = $("<select class='custom-select'></select>").change(function (e) {
        Board.rDeg = parseFloat($(this).val());
        saveLocal('Board.rDeg', Board.rDeg);
        initBoard();
    });
    [0, 90, 45, 22.5].forEach(function (deg) {
        degSelect.append($("<option></option>").html(getPtName(deg)).val(deg)
                .prop('selected', deg==Board.rDeg));
    });

    let ptGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Puzzle type</label></div>"),
                degSelect,
                dimenSelect
    );


    /* border radius */
    let borderRadSelect = $("<select class='custom-select'></select>").change(function (e) {
        Colors.borderRadius = parseInt($(this).val());
        saveLocal('Colors.borderRadius', Colors.borderRadius);
        initBoard();
    });
    [["Square",0], ["Rounded",5],["Very rounded",25],["Circle",50]].forEach(function (pair) {
        borderRadSelect.append($("<option></option>").html(pair[0]).val(pair[1])
                .prop('selected', pair[1]==Colors.borderRadius));
    });

    let borderRadGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Tile shape</label></div>"),
                borderRadSelect
    );

    /* color scheme */
    let colorSchemeSelect = $("<select class='custom-select'></select>").change(function (e) {
        Colors.scheme = parseInt($(this).val());
        saveLocal('Colors.scheme', Colors.scheme);
        initBoard();
    });
    $(["Plain", "Violet", "Fringe", "Rows", "Image"]).each(function (index, name) {
        colorSchemeSelect.append($("<option></option>").html(name).val(index).prop('selected', (index == Colors.scheme)));
    });

    let colorSchemeGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Color scheme</label></div>"),
                colorSchemeSelect
    );

    /* animation time */
    let animSelect = $("<select class='custom-select'></select>").change(function (e) {
        Colors.animationTime = parseFloat($(this).val());
        saveLocal('Colors.animationTime', Colors.animationTime);
        initBoard();
    });
    [["No animation",0], ["Fast",0.15],["Normal",0.25],["Slow",0.35]].forEach(function (pair) {
        animSelect.append($("<option></option>").html(pair[0]).val(pair[1]).prop('selected', (pair[1] == Colors.animationTime)));
    });

    let animGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Animation</label></div>"),
                animSelect
    );

    /* handles labeling */
    let handlesLabelSelect = $("<select class='custom-select'></select>").change(function (e) {
        Colors.hText = parseInt($(this).val());
        saveLocal('Colors.hText', Colors.hText);
        initBoard();
    });
    $(["None", "UIJK", "Numpad"]).each(function (index, name) {
        handlesLabelSelect.append($("<option></option>").html(name).val(index).prop('selected', (index == Colors.hText)));
    });

    let handlesLabelGr = $("<div class='input-group mb-1'></div>").append(
                $("<div class='input-group-prepend'><label class='input-group-text'>Handles labeling</label></div>"),
                handlesLabelSelect
    );

    /* virtual shift */
    let virShCb = $("<input type='checkbox' id='virShCb'></input>").prop('checked',Board.showVirtualShift).change(function (e) {
        let isChecked = $(this).prop('checked');
        Board.showVirtualShift = isChecked;
        saveLocal('Board.showVirtualShift', Board.showVirtualShift);
        initBoard();
    });

    let virShGr = $("<div class='input-group mb-1'></div>").append(
            $("<div class='input-group-prepend'></div>").append($("<div class='input-group-text'></div>").append(virShCb)),
            $("<div class='input-group-append'><label for='virShCb' class='input-group-text'>show virtual shift</label></div>")
    );
    if (!Glob.isTouchDevice)
        virShGr.hide();

    /* show timer */
    let showTimerCb = $("<input type='checkbox' id='showTimerCb'></input>").prop('checked',Glob.showTimer).change(function (e) {
        let isChecked = $(this).prop('checked');
        Glob.showTimer = isChecked;
        saveLocal('Glob.showTimer', Glob.showTimer);

        displayTime(Glob.showTimer ? 'ready' : getPuzzleName());
    });

    let showTimerGr = $("<div class='input-group mb-1'></div>").append(
            $("<div class='input-group-prepend'></div>").append($("<div class='input-group-text'></div>").append(showTimerCb)),
            $("<div class='input-group-append'><label for='showTimerCb' class='input-group-text'>show timer</label></div>")
    );

    /* virtual shift */
    let roNightModeCb = $("<input type='checkbox' id='roNightModeCb'></input>").prop('checked',Glob.roNightMode).change(function (e) {
        let isChecked = $(this).prop('checked');
        Glob.roNightMode = isChecked;
        saveLocal('Glob.roNightMode', Glob.roNightMode);
        if (Glob.roNightMode)
            DarkReader.enable(Glob.dmFixes);
        else
            DarkReader.disable();
    });

    let roNightModeGr = $("<div class='input-group mb-1'></div>").append(
            $("<div class='input-group-prepend'></div>").append($("<div class='input-group-text'></div>").append(roNightModeCb)),
            $("<div class='input-group-append'><label for='roNightModeCb' class='input-group-text'>Night mode</label></div>")
    );

    /* collapse */
    let advSettingsDiv = $("<div class='collapse' id='advSetDiv'></div>").append(
            showTimerGr,
            borderRadGr,
            paddingGr,
            animGr);
    let collapseBtn = $("<button class='btn btn-outline-primary form-control my-1' data-toggle='collapse' data-target='#advSetDiv'></button>")
        .html("Advanced settings...");

    let resetBtn = $("<button class='btn btn-danger form-control'>Reset to defaults</button>").click(function () {
        Board.tileSize = 100;
        saveLocal('Board.tileSize', Board.tileSize);
        Colors.borderRadius = 25;
        saveLocal('Colors.borderRadius', Colors.borderRadius);
        Board.width = 3;
        saveLocal('Board.width', 3);
        Board.height = 3;
        saveLocal('Board.height', 3);
        Board.rDeg = 0; // RO
        saveLocal('Board.rDeg', Board.rDeg);
        Board.padding = 5;
        saveLocal('Board.padding', Board.padding);
        Colors.scheme = 1;
        saveLocal('Colors.scheme', Colors.scheme);
        Colors.hText = 0;
        saveLocal('Colors.hText', Colors.hText);
        Board.showVirtualShift = false;
        saveLocal('Board.showVirtualShift', Board.showVirtualShift);
        Glob.showTimer = false;
        saveLocal('Glob.showTimer', Glob.showTimer);
        Colors.animationTime = 0.25;
        saveLocal('Colors.animationTime', Colors.animationTime);

        Board.width = 3;
        saveLocal('Board.width', Board.width);
        Board.height = 3;
        saveLocal('Board.height', Board.height);

        Glob.roNightMode = false;
        saveLocal('Glob.roNightMode', Glob.roNightMode);
        DarkReader.disable();

        displayTime(Glob.showTimer ? 'ready' : getPuzzleName());

        initBoard();
        $("#rightPanelWrap").empty().html(jqRightPanel());
    });

    let doneBtn = $("<button class='btn btn-success form-control my-1'>Done</button>").click(function () {
        $("#btnSettings").trigger('click');
    });

    return $("<div></div>").append(
            virShGr,
            ptGr,
            colorSchemeGr,
            handlesLabelGr,
            tileSizeGr,
            roNightModeGr,

            collapseBtn,
            advSettingsDiv,

            doneBtn,
            resetBtn);
}

