Glob = function () {}


let Config = {
    width: 1280,
    height: 720,
    text: "text to png",
    fillColor : "#00ffff",
    strokeColor : "#0000ff",
    lineHeight: 1.7,
    font: "Verdana",
    filename: "0000",
    alignCenter: true
};

Glob.colorsList = [
    "Black",
    "White",
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Orange",
    "Cyan",
    "Silver",
    "Grey",
    "DarkBlue",
    "LightBlue",
    "Purple",
    "Brown",
    "Maroon",
    "Lime",
    "Magenta",
    "Olive",
    "Pink",
    "Aquamarine"
];

Glob.fontsList = [
    "Verdana",
    "Helvetica",
    "Ubuntu Mono",
    "Lobster",
    "Play",
    "Amatic SC",
    "Russo One",
    "Didact Gothic",
    "Neucha",
    "Rubik Glitch",
    "Rubik Wet Paint",
    "Rubik Puddles",
    "Rubik Beastly",
    "Oi"
];

// width
Glob.sizes = [ 640, 800, 1000, 1080, 1280, 1920 ];

Glob.canvas = null; // canvas that renders it

Glob.examplesRow = null;

Glob.btnDownload = null;
Glob.inputFileName = null;
