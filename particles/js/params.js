var Params = [
    {
        name: "dyingSpeed",
        descr: "How fast particles die. 0 = they don't die, 1 = instantly",
        defaultVal: 0.5,
        category: "birth/death",
    },
    {
        name: "birthHpRandomness",
        descr: "0 = all particles are equally healthy upon birth; 1 = some may be twice as healthy",
        defaultVal: 0,
        category: "birth/death",
    },
    {
        name: "dyingByColorchnage",
        descr: "Do particles loose health when cross colorchange border? 0 = no, 1 = instant death",
        defaultVal: 0,
        category: "birth/death",
    },
    {
        name: "dyingRandom",
        descr: "If >0, particle dies faster (but randomly faster). 1 = it dies about twice as faster",
        defaultVal: 0,
        category: "birth/death",
    },

    {
        name: "maxTheta",
        descr: "1 = can turn 90 deg each turn",
        defaultVal: 0.2,
        category: "vector",
    },
    {
        name: "thetaUpdVelocity",
        descr: "0.1 is fine",
        defaultVal: 0.1,
        category: "vector",
    },
    {
        name: "initDirByColor",
        descr: "0 = random initial direction, 1 = initial direction based on color",
        defaultVal: 0,
        category: "vector",
    },

    {
        name: "thetaUpdByRandom",
        descr: "Is theta updated randomly? 0 = no, 1 = yes",
        defaultVal: 0.5,
        category: "theta",
    },
    {
        name: "thetaUpdByColor",
        descr: "Is theta updated based on color ahead of particle? 0 = no, 1 = yes",
        defaultVal: 0.5,
        category: "theta",
    },
    {
        name: "thetaUpdBySin",
        descr: "Is theta updated based on stupid sin formula? 0 = no, 1 = yes",
        defaultVal: 0,
        category: "theta",
    },



    {
        name: "colorTs",
        descr: "color transition speed: 0 = instantly change based on picture, 1 = stay same",
        defaultVal: 0.5,
        category: "color",
    },
    {
        name: "colorInitByPic",
        descr: "initial particle color is based on color of the pixel(x,y) of the picture? 0 = no, 1 = yes",
        defaultVal: 1.0,
        category: "color",
    },
    {
        name: "colorInitByRandom",
        descr: "initial particle color is absolutely random? 0 = no, 1 = yes",
        defaultVal: 0.0,
        category: "color",
    },

    {
        name: "breedRate",
        descr: "0 = particles don't breed, 1 = they recursively breed on every 10th iteration (DANGER! This can hang your PC)",
        defaultVal: 0,
        category: "breed",
    },
    {
        name: "breedRandomness",
        descr: "0 = breed on schedule, 1 = breed at random time",
        defaultVal: 0,
        category: "breed",
    },
    {
        name: "breedShareHealth",
        descr: "0 = each child gets half of initial health, 1 = both have initial health (DANGER! This can hang your PC)",
        defaultVal: 0,
        category: "breed",
    },
    {
        name: "breedAngleChange",
        descr: "0 = after reproduction, particles fly in the same direction, 1 = 90deg",
        defaultVal: 0.2,
        category: "breed",
    },


    {
        name: "startThinkness",
        descr: "initial line thickness: 0 = 1px, 1 = 8px",
        defaultVal: 0.3,
        category: "thickness",
    },
    {
        name: "endThinkness",
        descr: "when dies, what is the thickness: 0 = 0px, 1 = 1px",
        defaultVal: 0.5,
        category: "thickness",
    },
    {
        name: "thicknessPow",
        descr: "1 means thinkness decreases linearly, 0.5 = quadratic, 1 = third power(^3)",
        defaultVal: 0,
        category: "thickness",
    },
];

function randomizeParams() {
    Params.forEach(function (p) {
        Glob[p.name] = Math.random();
        $("#" + 'prm-' + p.name).val(Glob[p.name]);
    });
    $("#presetSelect").val('')
}

function downloadPreset() {
    let savedThing = {};
    Params.forEach(function (p) {
        savedThing[p.name] = Glob[p.name];
    });
    downloadPlainText(JSON.stringify(savedThing), 'preset.json');
}
