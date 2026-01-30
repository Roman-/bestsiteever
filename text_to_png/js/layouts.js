function loMain() {
    let firstRow = $("<div></div>").addClass("row").append(jqPanelCol(), jqRightCol());

    $("#mainLayout").empty().append(firstRow, "<hr>", Glob.colorsRow, "<hr>", Glob.examplesRow);

    setTimeout(onSizeChange, 100);
}

function jqRightCol() {
    let canvasWrap = $("<div></div>").append(Glob.canvas);
    let bottomPanel = $("<div></div>").addClass("row").append(
        $("<div>").addClass("col-auto").append(jqSizesSelect()),
        Glob.inputFileName.addClass("ml-2"),
        $("<div>").html(".png").addClass("mr-2").css("display", "inline-block").css("margin-top", "auto"),
        Glob.btnDownload.addClass("mx-2")
    );
    return $("<div></div>").addClass("col-6").append(canvasWrap, bottomPanel);
}

function onSizeChange() {
    Glob.canvas[0].width = Config.width;
    Glob.canvas[0].height = Config.height;
    onTextUpdate();
}

// panel form on the left
function jqPanelCol() {
    return $("<div></div>").addClass("col-6").append(
        $("<textarea>")
            .val(Config.text)
            .attr("id", "main-ta")
            .addClass("form-control")
            .attr("rows", 3)
            .bind("change input keyup", (e)=>{
                Config.text = $(e.target).val();
                onTextUpdate();
            }),
        $("<div class='form-check form-control'>").append(
            $("<input type='checkbox' id='checkCenter'>")
                .addClass("form-check-input")
                .prop("checked", Config.alignCenter)
                .bind("input change", (e)=>{
                    Config.alignCenter = $(e.target).prop("checked");
                    onTextUpdate();
                }),
            $("<label for='checkCenter'>").html("center").addClass("form-check-label"),
)
        /*
        $("<input type='color'/>").
            addClass("form-control")
            .val(Config.fillColor)
            .bind("change input", (e)=>{
                Config.fillColor=$(e.target).val();
                onTextUpdate();
            }),
        $("<input type='color'/>").
        addClass("form-control")
            .val(Config.strokeColor)
            .bind("change input", (e)=>{
                Config.strokeColor=$(e.target).val();
                onTextUpdate();
            })
         */
    );
}

function renderText(canvas) {
    const zoomOutFactor = 0.78; // dirty hack because I'm too lazy
    // I'm bored with coming up with a precise alg, so playing dirty there
    canvas[0].width = Config.width;
    canvas[0].height = Config.height;

    if (Config.text.trim() === "")
        return;
    const initialFontWidth = 100;
    let lines = Config.text.split("\n");

    let ctx = canvas[0].getContext("2d");
    ctx.font = `${initialFontWidth}px ` + Config.font;
    console.log("font = ", ctx.font);

    // measure height
    let textMetrics = ctx.measureText("o");
    let fontHeight = textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent;
    let lineHeight = fontHeight * Config.lineHeight;

    // measure width
    let maxWidth = 0
    lines.forEach((l) => {
        let w = ctx.measureText(l).width;
        if (w > maxWidth) {
            maxWidth = w;
        }
    });

    // adjust height: scale width: the line with max width must fill in the entire Config.width
    let fontSize = Math.floor(initialFontWidth / maxWidth * canvas[0].width * zoomOutFactor);
    let ratio = maxWidth/(lines.length * lineHeight);
    canvas[0].height = Math.round(canvas[0].width / ratio);

    // add margins before resizing

    ctx = canvas[0].getContext("2d");
    ctx.font = `${fontSize}px ` + Config.font;

    textMetrics = ctx.measureText("o");
    fontHeight = textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent;
    lineHeight = fontHeight * Config.lineHeight;

    let w = canvas[0].width;
    let h = canvas[0].height;
    console.log("canvas wh", w, h);

    ctx.fillStyle = "#ffffff";
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = Config.alignCenter ? "center" : "left";

    for (let l = 0; l < lines.length; ++l) {
        let x = Config.alignCenter ? w / 2 : (canvas[0].width * ((1-zoomOutFactor) / 2));
        let y = Math.round((l + 1) * lineHeight);
        console.log("xy", x, y);

        ctx.fillStyle = Config.fillColor;
        ctx.fillText(lines[l], x, y);
    }
}

function onTextUpdate() {
    renderText(Glob.canvas);
    Glob.colorsRow.empty().append(jqColorsDiv());
    Glob.examplesRow.empty().append(jqExamplesDiv());
}

function jqSizesSelect() {
    let select = $("<select class='form-control'>").prop("title", "image width");
    Glob.sizes.forEach((w) => {
        let option = $("<option>").val(w).html(w + "px");
        select.append(option);
    });
    select.val(Glob.sizes[1]);
    select.bind("change input", (e)=>{
        Config.width = Number.parseInt($(e.target).val());
        onSizeChange();
    });
    return select;
}
