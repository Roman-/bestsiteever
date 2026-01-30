// directions.js - functions that helps particles to choose/change direction
//
function randomDirectionVec() {
    let vx = Math.random()-0.5;
    let vy = Math.random()-0.5;
    v = normalizeVec(vx,vy,Glob.vectorLength);
    return v;
}

// returns number fom 0 to 1 how color in position [x,y] is different from color on position [newX, newY]
function changeOfColor(x,y,newX, newY) {
    let rgb1 = getRgbOfPixel(Glob.imgData, x,y);
    let rgb2 = getRgbOfPixel(Glob.imgData, newX,newY);
    return (Math.abs(rgb1[0]-rgb2[0]) + Math.abs(rgb1[1]-rgb2[1]) + Math.abs(rgb1[2]-rgb2[2])) / (255*3);
}

// param x,y - coordinates of point spot
// returns direction to which color is less likely to change
function initialDirectionWithLessCc(x,y) {
    const numAttempts = 10;
    // we look ahead 1px, 3px, 5px and 10px and take average pixelchange
    const lookAheadDistances = [1, 3, 5, 10];

    let bestColDiff = lookAheadDistances.length;
    let bestVec;
    for (let i = 0; i < numAttempts; ++i) {
        let v = randomDirectionVec();
        let currColDiff = 0;
        lookAheadDistances.forEach(function (vecLength) {
            currColDiff += changeOfColor(x,y, x + v[0]*vecLength, y+v[1]*vecLength);
        });
        if (currColDiff < bestColDiff) {
            bestColDiff = currColDiff;
            bestVec = v;
        }
    }
    return bestVec;
}

// pick theta such that [x,y] + ([vx,vy]rotated by theta) gives direction with less color change
// on the next iteration the upd() function will rotate [vx,vy] by theta returned from here
function pickThetaColorBased(x,y,vx,vy,theta) {
    const numAttempts = 10;
    // we look ahead 2,4,10 px and take average pixelchange
    const lookAheadDistances = [3, 5, 10];

    let bestColDiff = lookAheadDistances.length;
    let bestTheta;
    for (let i = 0; i < numAttempts; ++i) {
        let newTheta = updateThetaRandomly(theta);
        let newV = vectorRotated(vx, vy, newTheta);
        let newVx = newV[0];
        let newVy = newV[1];
        let currColDiff = 0;
        lookAheadDistances.forEach(function (vecLength) {
            let newX = x + newVx*vecLength;
            let newY = y + newVy*vecLength;
            currColDiff += changeOfColor(x,y, newX, newY);
            if (!isInBounds(newX, newY))
                currColDiff += 0.1 / lookAheadDistances.length;
        });
        if (currColDiff < bestColDiff) {
            bestColDiff = currColDiff;
            bestTheta = newTheta;
        }
    }
    return bestTheta;
}

// returns new theta based on current theta
function updateThetaRandomly(theta) {
    return theta + (Glob.thetaUpdVelocity/10) * (Math.random() - 0.5) * Math.PI;
}

// returns new theta based on sin(itr)
function updateThetaBySin(p) {
    // say 60 iterations (= 1 sec)
    // let param1 = Math.random() * 500 + 500;
    let param1 = 1000;
    let y = Math.sin(p.itr / param1) * (Glob.maxTheta * Math.PI/4);
    return y;
}

// returns new theta based on current positions and Glob.params related to theta update
function updateTheta(p) {
    let thetaColBased = Glob.thetaUpdByColor > 0 ? pickThetaColorBased(p.x,p.y,p.vx,p.vy,p.theta) : p.theta;
    let thetaRndBased = Glob.thetaUpdByRandom > 0 ? updateThetaRandomly(p.theta) : p.theta;
    let thetaSinBased = Glob.thetaUpdBySin > 0 ? updateThetaBySin(p) : p.theta;

    // weighted average - coeffs
    let sum = Glob.thetaUpdByColor + Glob.thetaUpdByRandom + Glob.thetaUpdBySin; // sum of coeffs
    if (sum < 0.0001)
        return p.theta

    let cCol = Glob.thetaUpdByColor / sum;
    let cRnd = Glob.thetaUpdByRandom / sum;
    let cSin = Glob.thetaUpdBySin / sum;

    let avg = cCol * thetaColBased
        + cRnd * thetaRndBased
        + cSin * thetaSinBased;

    return avg;
}

// returns initial direction of particle based on params in glob
function getInitialDirection(x,y) {
    let vColorBased = initialDirectionWithLessCc(x,y);
    let vRndBased = randomDirectionVec();
    let t = Glob.initDirByColor;
    let v = [t * vColorBased[0] + (1-t) * vRndBased[0], t * vColorBased[1] + (1-t) * vRndBased[1]];


    // correct newV to follow the mouse
    const mouseGuided = 1;
    if (mouseGuided > 0 && Glob.dv && (Glob.dv[0]!=0 || Glob.dv[1]!=0)) {
        gv = normalizeVec(Glob.dv[0], Glob.dv[1], Glob.vectorLength);
        l = mouseGuided;
        v = [ l * gv[0] + (1-l) * v[0], l * gv[1] + (1-l) * v[1] ];
    }

    return normalizeVec(v[0],v[1], Glob.vectorLength);
}


// returns [r,g,b] based on Glob.params related to color initialization
function initialColor(x,y) {
    let rndColor = [ Math.random()*255, Math.random()*255, Math.random()*255];
    let picColor = getRgbOfPixel(Glob.imgData, x,y);

    // weighted average - coeffs
    let sum = Glob.colorInitByRandom + Glob.colorInitByPic; // sum of coeffs
    if (sum < 0.0001)
        return [128,128,128];

    let cRnd = Glob.colorInitByRandom / sum;
    let cPic = Glob.colorInitByPic / sum;

    return [
        Math.round(
           cPic * picColor[0]
        + cRnd * rndColor[0]),
        Math.round(
           cPic * picColor[1]
        + cRnd * rndColor[1]),
        Math.round(
           cPic * picColor[2]
        + cRnd * rndColor[2]),
    ];
}
