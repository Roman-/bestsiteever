Glob = function () {}

// audio context
Glob.ctx = new (window.AudioContext || window.webkitAudioContext)();
Glob.os = Glob.ctx.createOscillator();
Glob.os.connect(Glob.ctx.destination);

Glob.layer = [] // layer is a 1d-array of tones you would play over time
Glob.waveType = 'sine';
Glob.detune = 300;
Glob.layerColor = 'blue';
Glob.layerLength = 800; // same as canvas width
Glob.maxFreq = 2000;

Glob.canvas = null; // canvas (jq obj)
Glob.width = null; // canvas width
Glob.height = null; // canvas height
Glob.canvaCtx = null; // canvas context

Glob.sparseIndex = 0;
