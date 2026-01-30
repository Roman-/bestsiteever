function loMain() {
    let row = $("<div class='row'></div>").append(
        Glob.boardContainer,
        $("<div class='col-sm-6 col-12 mt-1' id='rightPanelWrap'></div>").append(jqRightPanel())
    );

    $("#mainLayout").empty().html(row);
}

function loSolver() {
    initBoard(Board.width, Board.height);
    let div = $("<div id='solverDiv'></div>");
    setTimeout(stest, 50);
    $("#mainLayout").empty().html(div);
}

function jqRightPanel() {
    /*   virtual shift  */
    Glob.vs = Board.showVirtualShift ? createVs() : "";
    let shiftWrap = $("<div class='col-12 p-0' id='shiftWrap'></div>").html(Glob.vs);

    /*         buttons        */

    let btnScramble = $("<button class='btn btn-outline-primary col-8 py-3'>Scramble</button>")
        .attr('title','scramble (Spacebar)')
        .click(function () {
            $(this).blur();
            onScramblePressed();
        });
    let btnReset = $("<button class='btn btn-outline-warning col-2 py-3'><i class='fa fa-undo'></i></button>")
        .attr('title','reset (Esc)')
        .click(function () {
            $(this).blur();
            onResetPressed();
        });
    let btnSettings = $("<button class='btn btn-outline-secondary col-2 py-3' id='btnSettings'></button>")
        .attr('title','settings')
        .html("<i class='fa fa-cog'></i>")
        .attr('is-open','0')
        .on('touchstart', function () {
            Glob.isTouchDevice = true;
        })
        .click(function () {
            if ($(this).attr('is-open') == 0) {
                $(this).attr('is-open', 1);
                Glob.infoDiv.empty().append(jqSettings());
            } else {
                $(this).attr('is-open', 0);
                Glob.infoDiv.empty().append(infoText());
            }
    });
    let btnRow = $("<div class='row'></div>").append(shiftWrap, btnScramble, btnSettings, btnReset);

    /*        info div        */

    Glob.infoDiv.html(infoText());


    return $("<div></div>").append(btnRow, Glob.infoDiv);
}

function showAlgsSheet() {
    let helpDiv = $("<div></div>");
    let algs = [
        ["69", "kiJIj"],
        ["68", "ijujUIJ"],
        ["89", "iJIjk"],
        ["698", "KiJIjK"],
        ["689", "kJijIk"],
    ];
    algs.forEach(function (p) {
        let row = $("<div></div>").css('border-top', '1px solid gray');
        let c = p[0];
        let a = p[1];
        let imgSpan = $("<img src='images/swap/"+c+".png' class='helpCase'></img>");
        let algSpan = $("<span class='helpAlg ml-1'>" + a + "</span>");
        row.append(imgSpan, algSpan, $("<br>"));
        helpDiv.append(row);
    });
    Glob.infoDiv.empty().html(helpDiv);
}
