// Glob = function () {}
Glob = {}

Glob.numberOfParticles = 100;
// grid initialization
Glob.gridSize = 20;
Glob.gridDisplacement = 1.0; // 0 = strict grid, 1 = very random
// mouse click
Glob.maxMcDisplacement = 0; // 0 = all form one point, 10 = may be 10px away
Glob.birthProb = 0; // how many particles are born each iteration on mouse position
Glob.updInterval = null; // interval handle



// vector
Glob.maxTheta = 0.2; // 1 = can turn 90 deg each turn
Glob.thetaUpdVelocity = 0.1; // 0.1 is fine
Glob.initDirByColor = 0.0; // 0 = random initial direction, 1 = initial direction based on color

// how theta depend on different techniques
Glob.thetaUpdByRandom = 0.5;
Glob.thetaUpdByColor = 0.5;
Glob.thetaUpdBySin = 0.0;

// birth/die
Glob.birthHpRandomness = 0.00; // 0 = all particles are equally healthy upon birth; 1 = some may be twice as healthy
Glob.dyingSpeed = 0.5; // every iteration
Glob.dyingByColorchnage = 0.00; // 0 = death speed isn't related with change of color on the picture; 1 = it only dies of that.
Glob.dyingRandom = 0; // your death is that much faster. 1 = twice as fast

// color
Glob.colorTs = 0.5; // color transition speed: 0 = instantly change based on picture, 1 = stay same
Glob.colorInitByRandom = 0.0;
Glob.colorInitByPic = 1.0;

// breed
Glob.breedRate = 0.0; // 0 = they don't breed, 1 = they recursively breed on every 10th iteration.
Glob.breedRandomness = 0.0; // 0 = breed on schedule, 1 = breed at random time
Glob.breedShareHealth = 0.0; // 0 = each child gets half of initial health, 1 = both have initial health (dangerous)
Glob.breedAngleChange = 0.2; // 0 = when reproduction they fly same direction, 1 = 90deg

// thickness
Glob.startThinkness = 0.3; // 0: 1px, 1: 8px
Glob.endThinkness = 0; // when life = 0: 0 = 0px, 1 = 1px
Glob.thicknessPow = 0; // [1, inf). 1 means thinkness decrease linearly, 2 = quadratic. 0 = linear(^1), 1 = thirt power(^3)

// random refractions
Glob.rrProp = 0.0; // 0 = they don't random-refract, 1 = they radnom-refract every 10th iteration.
Glob.rrDropout = 0.0; // 0 = no refraction dropouts, 0.5 = dropout half refraction, 1 = drop all (no refractions)
Glob.rrAngle = 0.0; // 0 = no angle change, 1 = go opposite direction, 0.5 = perpendicular


/* misc */
Glob.vectorLength = 1;
Glob.updateSpeed = 1000/60; // 60 fps
Glob.imgSrc = "img/face.jpeg";
Glob.killOutOfBounds = true; // kill particles that are out of bounds
Glob.amountLimit = 2500; // max. 15K particles, after that they don't breed
// mouse
Glob.dv = [0,0]; // particles will try to move towards mouse
Glob.mouseDown = false;
Glob.minBrushMovement = 10; // brush has to move at least that many pixels

Glob.img = null;
Glob.w = null;
Glob.h = null;

Glob.canvas = null;
Glob.canvasImg = null;
