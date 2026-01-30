function onStartSound() {
    Glob.os.type = 'sine';
    Glob.os.frequency.setValueAtTime($("#freqInput").val(), Glob.ctx.currentTime); // value in hertz
    Glob.os.detune.setValueAtTime($("#detuneInput").val(), Glob.ctx.currentTime); // value in hertz
    Glob.os.start();
    displayInfo();
}

function onPauseSound() {
    Glob.os.stop();
}

function displayInfo() {
    let freq = $("#freqInput").val();
    let det = $("#detuneInput").val();
    $("#indoDiv").html("Freq: " + freq + " Hz.<br>Detune: " + det + " cents.");
}

function onFreqChanged(f) {
    Glob.os.frequency.setValueAtTime(f, Glob.ctx.currentTime); // value in hertz
    displayInfo();
}

function onDetuneChanged(c) {
    Glob.os.detune.setValueAtTime(c, Glob.ctx.currentTime); // value in hertz
    displayInfo();
}

Glob.playerInterval = null; // interval handle
Glob.oscill = null;
Glob.currentX = 0;
Glob.playSpeed = 6; // the lower this value is, the faster we play

function playLayers() {
    Glob.oscill = Glob.ctx.createOscillator();
    let o = Glob.oscill;
    o.connect(Glob.ctx.destination);
    o.type = Glob.waveType;

    let f = yCoordToFreq(Glob.layer[0]);
    o.frequency.setValueAtTime(f, Glob.ctx.currentTime); // value in hertz

    o.detune.setValueAtTime(Glob.detune, Glob.ctx.currentTime); // value in hertz
    o.start();
    Glob.currentX = 0;
    Glob.playerInterval = setInterval(playNextX, Glob.playSpeed);
}

function playNextX() {
    let f = yCoordToFreq(Glob.layer[Glob.currentX]);
    Glob.oscill.frequency.setValueAtTime(f, Glob.ctx.currentTime);

    drawTimeline(Glob.currentX);

    if (++Glob.currentX >= Glob.layerLength) {
        clearInterval(Glob.playerInterval);
        Glob.oscill.frequency.setValueAtTime(0, Glob.ctx.currentTime);
        setTimeout(function () {Glob.oscill.stop();}, 250);
    }
}

