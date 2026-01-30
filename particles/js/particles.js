// param col - array[r,g,b]
function createParticle(init_x, init_y, col, init_velocity = [1,0]) {
    return {
        x: init_x,
        y: init_y,
        vx: init_velocity[0],
        vy: init_velocity[1],
        colR: col[0],
        colG: col[1],
        colB: col[2],
        theta: 0,     // angle changing on every update
        life: 1 + Math.random()*Glob.birthHpRandomness,       // when will it die
        itr: 0,   // internal clock: iteration
    };
}

Glob.particles = [];
function initParticles(x,y, numParticles, displacement) {
    if (null == Glob.updInterval)
        Glob.updInterval = setInterval(upd, Glob.updateSpeed);

    for (let i = 0; i < numParticles; ++i) {
        let col = initialColor(x,y);

        let v = getInitialDirection(x,y);

        let spotX = x + (Math.random()-0.5) * displacement;
        let spotY = y + (Math.random()-0.5) * displacement;
        Glob.particles.push(createParticle(spotX,spotY,col,v));
    }
}

// update function (every N milliseconds)
function upd() {
    // console.log(Glob.particles[0]);
    ctx = Glob.ctx;
    $(Glob.particles).each(function (index,p) {
        ++p.itr;

        // change velocity of every particle
        let newV = vectorRotated(p.vx, p.vy, p.theta);

        p.vx = newV[0];
        p.vy = newV[1];

        p.theta = updateTheta(p);
        p.theta = floorCeil(p.theta, -Glob.maxTheta * Math.PI/4, Glob.maxTheta * Math.PI/4);

        // depict particles and update their positions
        ctx.lineWidth = lineThickness(p.life);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        p.x += p.vx;
        p.y += p.vy;

        // change color of every particle
        col = updateColor(p.colR, p.colG, p.colB, p.x, p.y);
        p.colR = col[0];
        p.colG = col[1];
        p.colB = col[2];
        ctx.strokeStyle = "rgb("+p.colR+","+p.colG+","+p.colB+")";

        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // life
        p.life -= (Glob.dyingSpeed*Glob.dyingSpeed*Glob.dyingSpeed*Glob.dyingSpeed/10) * (1 + Math.random() * Glob.dyingRandom);
        p.life -= Glob.dyingByColorchnage * changeOfColor(p.x-p.vx, p.y-p.vy, p.x, p.y);
        if (Glob.killOutOfBounds && !isInMarginedBounds(p.x, p.y))
            p.life = 0;

        // breed
        if (Glob.breedRate > 0
                && Glob.particles.length < Glob.amountLimit
                && p.itr%(Math.round(Glob.breedRandomness*Math.random()*50 + 1/(Glob.breedRate*Glob.breedRate/10))) == 0) {
            newP = JSON.parse(JSON.stringify(p));
            let lifeVal = p.life / (2 - Glob.breedShareHealth);
            p.life = lifeVal;
            newP.life = lifeVal;

            // angle
            afterV1 = vectorRotated(p.vx, p.vy, Glob.breedAngleChange*Math.PI/2);
            afterV2 = vectorRotated(p.vx, p.vy, -Glob.breedAngleChange*Math.PI/2);

            // itr
            p.itr = 0; newP.itr = 0;
            p.vx = afterV1[0]; p.vy = afterV1[1];
            newP.vx = afterV2[0]; newP.vy = afterV2[1];

            Glob.particles.splice(index,0,newP);
        }

        // random refraction
        if (Glob.rrProp > 0
                && Math.random() < Glob.rrDropout
                && p.itr%(Math.round(1/(Glob.rrProp*Glob.rrProp/10))) == 0) {
            afterV1 = vectorRotated(p.vx, p.vy, (Math.random()>0.5 ? 1 : -1)*Math.PI*Glob.rrAngle);
            p.vx = afterV1[0]; p.vy = afterV1[1];
        }
    });

    // remove dead particles
    Glob.particles = Glob.particles.filter(p => p.life > 0);

    $("#numParticles").html(Glob.particles.length);
}

// update color based on various things
// returns array[r,g,b]
function updateColor(r,g,b, x, y) {
    ts = Math.pow(Glob.colorTs, 0.2);
    // take average of current p.color
    let pointRgb = getRgbOfPixel(Glob.imgData,Math.round(x),Math.round(y));
    pointRgb[0] = Math.round((1-ts) * pointRgb[0] + ts * r);
    pointRgb[1] = Math.round((1-ts) * pointRgb[1] + ts * g);
    pointRgb[2] = Math.round((1-ts) * pointRgb[2] + ts * b);
    return pointRgb;
}

// mouse down
function onCanvasMd(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    Glob.mdCoords = [x,y];
    Glob.mouseDown = true;
}

// mouse up
function onCanvasMu(e) {
    let muX = e.offsetX;
    let muY = e.offsetY;
    if (Glob.mouseDown) {
        mdCoords = Glob.mdCoords ? Glob.mdCoords : [muX,muY];
        // init particles here
        initParticles(mdCoords[0],mdCoords[1], Glob.numberOfParticles, Glob.maxMcDisplacement);
    }
    Glob.mouseDown = false;
}

function onCanvasMm(e) {
    Glob.dv = [0, 0];
    if (!Glob.mouseDown)
        return;

    mdCoords = Glob.mdCoords;
    moveX = e.offsetX;
    moveY = e.offsetY;

    // only react if brush moved enough
    dx = (moveX - mdCoords[0]);
    dy = (moveY - mdCoords[1]);
    howMuchBrushMoved = Math.sqrt(dx*dx + dy*dy);
    if (howMuchBrushMoved < Glob.minBrushMovement)
        return;

    Glob.dv = [dx, dy];

    Glob.mouseDown = false;

    initParticles(mdCoords[0],mdCoords[1], Glob.numberOfParticles, Glob.maxMcDisplacement);
}

// place particles on grid
function initGrid() {
    for (let x = 0; x < Glob.w; x += Glob.gridSize) {
        for (let y = 0; y < Glob.h; y += Glob.gridSize) {
            let gridX = x + (Math.random()-0.5) * 2 * Glob.gridDisplacement * Glob.gridSize;
            let gridY = y + (Math.random()-0.5) * 2 * Glob.gridDisplacement * Glob.gridSize;
            initParticles(gridX,gridY,1,0);
        }
    }
}

// returns line thickness depending on life
function lineThickness(life) {
    const maxT = 1 + 7*Glob.startThinkness;
    const minT = Glob.endThinkness;
    const pow = 1 + Glob.thicknessPow*2;
    const h = maxT - minT; // height
    return h * Math.pow(life, pow) + minT;
}

// returns true if x,y are in picture bounding rect
function isInBounds(x,y) {
    return x >= 0 && y >= 0 && x < Glob.w && y < Glob.h;
}

// returns true if x,y are in picture bounding rect
function isInMarginedBounds(x,y) {
    const margins = Math.min(Glob.w, Glob.h) * 0.05;
    return x >= -margins && y >= -margins && x < Glob.w + margins && y < Glob.h + margins;
}
