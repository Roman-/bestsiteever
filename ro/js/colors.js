function Colors () {}

// 0: plain white; 1: violet tones; 2: fringe (or something), 3: rows
Colors.scheme = null;
// text on handles. 0: no text; 1: uijk; 2: Numpad
Colors.pictureUrl = 'images/unicorn.jpg';

Colors.hText = 0;

// default stroke color
Colors.clrsArray = ["#f66", "#ff5", "#77f", "#5f5", "#0ff", "#f5a742","#d712e6", "#aaa", "#78a5cf", "white"];
Colors.defStroke = '#333';
Colors.hlStroke = '#000';
Colors.borderRadius = null;
Colors.fontSize = null;
Colors.animationTime = null;
Colors.fontfamily = 'Tahoma, Geneva, sans-serif';

// handles
Colors.handleCol = 'rgba(255, 250, 153, 0.5)';
Colors.handleColHl = 'rgba(252, 236, 3, 0.9)';
Colors.handleColCongr = 'rgba(255,255,255,1)';
Colors.handleStroke = 'rgba(128,25,25,1)';
Colors.handleTextCol = 'rgba(128,0,0,1)';
Colors.handleFont = 'Times New Roman';

function applyPaint() {
    if (Colors.scheme == 4) {
        let totalWidth = Board.width * Board.tileSize + (Board.width - 1) * Board.padding;
        let totalHeight = Board.height * Board.tileSize + (Board.height - 1) * Board.padding;
        $(Board.tiles).each(function (index, obj) {
            $(obj).css({
                'background-image': 'url(' + Colors.pictureUrl + ')',
                'background-size': totalWidth + 'px ' + totalHeight + 'px',
                'background-repeat': 'no-repeat',
                'background-color': 'transparent'
                // Remove 'background-position' here; it's set in applyBoardPos()
            });
        });
    } else {
        $(Board.tiles).each(function (index, obj) {
            obj.css('background-color', fillByIndex(index, Board.width, Board.height));
        });
    }
}

function applyStyleSheet() {
    Colors.fontSize = Math.floor(Board.tileSize*0.7) + "px";
    Colors.handleFontSize = Math.floor(Board.tileSize*0.25) + "px";

    let ss = "";
    ss += ".tile {";
    ss += "width: " + Board.tileSize + "px;";
    ss += "height: " + Board.tileSize + "px;";
    ss += "border-radius:" + Colors.borderRadius + "%;";
    ss += "font-size:" + Colors.fontSize + ";";
    ss += "transition: all " + Colors.animationTime + "s;";
    ss += "font-family: " + Colors.fontfamily + ";";
    ss += "}";

    ss += ".handle {"
    ss += "background-color:" + Colors.handleCol + ";";
    ss += "border-radius: 50%;";
    ss += "border: 1px solid " + Colors.handleStroke + ";";
    ss += "color: " + Colors.handleTextCol + ";";
    ss += "font-family: " + Colors.handleFont + ";";
    ss += "font-size:" + Colors.handleFontSize + ";";
    ss += "}";

    ss += "#boardContainer{";
    ss += "min-width:" + (Board.tileSize * Board.width + (Board.width-1)*Board.padding) + "px;";
    ss += "min-height:" + ((Board.tileSize) * Board.height + (Board.width-1)*Board.padding) + "px;";
    ss += "}";


    $("#tilesStyle").html(ss);
}

// param w - width (pcs), h - height (pcs)
function fillByIndex(i, w, h) {
    switch(Colors.scheme) {
        case 0: return "#eee"; // plain
        case 1: return fillViolet(i, w, h);
        case 2: return fillFringe(i, w, h);
        case 3: return fillRows(i, w, h);
        case 4: return fillPicture(i, w, h);
        default: return "#eee";
    }
}

function fillPicture(i, w, h) {
    // We'll handle picture filling in applyPaint(), so this can be empty or return null
    return null;
}

// jqHandle - jquery hanle object; apply highlight to it
// toHl = 0(false) to reset highlight; 1(true) to highlight; 2 to congratulate
function applyHandleHl(jqHandle, toHl) {
    if (!toHl)
        return jqHandle.css('background-color', '').css('color', '').css('border', '').css('padding', '').css('transform', '');
    else if (toHl == 1)
        return jqHandle.css('background-color', Colors.handleColHl).css('color', '').css('border', '').css('transform', '');
    else if (toHl == 2)
        return jqHandle.css('background-color', Colors.handleColCongr).css('color', 'rgba(255,255,255,0)')
            .css('border', '3px solid black').css('transform', 'scale(1.3)');
}

/**           COLOR SCHEMES      */
function fillFringe(i,w,h) {
    if (i < 0 || i >= w*h)
        return "black";
    let colorIndex = 0;
    let row = Math.floor(i/w);
    let col = i%w;
    while (colorIndex < Colors.clrsArray.length) {
        if (row == colorIndex)
            return Colors.clrsArray[2 * colorIndex];
        if (col == colorIndex)
            return Colors.clrsArray[2 * colorIndex + 1];
        colorIndex++;
    }
    return "white";
}

function fillRows(i,w,h) {
    if (i < 0 || i >= w*h)
        return "black";
    let row = Math.floor(i/w);
    if (row < Colors.clrsArray.length)
        return Colors.clrsArray[row];
    return "white";
}

// param w - width (pcs), h - height (pcs)
function fillViolet(i,w,h) {
    let x = i%w;
    let y = Math.floor(i/h);
    const baseVal = 120;
    const fullVal = 255; // 255

    let pX = Math.floor(x/w*(fullVal-baseVal)); // 0 to 155
    let pY = Math.floor(y/h*(fullVal-baseVal)); // 0 to 155
    let r = baseVal + pX;
    let g = baseVal;
    let b = baseVal + pY;
    return "rgb("+r+","+g+","+b+")";
}
