// test functions just for fun
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

Glob.mYfac = 2;
// mandelbrot rule for changing X part
function mruleX(x,y) {
    //return (x*x-y*y);
    return (x*x-y*y) - Math.exp(2-Glob.mYfac)-1;
}
// mandelbrot rule for changing X part
function mruleY(x,y) {
    // return 2*x*y;
    return Glob.mYfac*x*y;
}

// show how fast fc(z) = z^2 + c diverge
// returns value from 0 to 255. 0 if stays inside mandelbrot set, 255 if goes away fast
// ruleX = function (x,y) that sets rule for how X part changes. By default it's x^2-y^2
// ruley = function (x,y) that sets rule for how Y part changes. By default it's 2xy
function mand(x,y, itr=30, limit=50, ruleX = mruleX, ruleY = mruleY) {
    // scale to make the formula for full-scale mandelbrot look like mand(x,y)
    // const maxPal = 255;
    const maxPal = 255*3;
    x = (x - 350) / 200;
    y = (y - 250) / 200;

    let zx = 0;
    let zy = 0;

    for (var i = 0; i < itr; i++) {
        let zsx = mruleX(zx, zy); // z squared x
        let zsy = mruleY(zx, zy); // z squared y
        zx = zsx + x;
        zy = zsy + y;

        d = dist(zx, zy, x,y);
        if (d > limit)
            return (itr-i)/itr * maxPal;
    }
    return 0;
}

function isPrime(n) {
    if (n<=1)
        return false;
    var i = 2;
    while (i*i <= n) {
        // Check if i divides x without leaving a remainder
        if (n % i == 0) {
            // This means that n has a factor in between 2 and sqrt(n)
            // So it is not a prime number
            return false;
        }
        i++;
    }
    return true;
}

// distance to closest prime number
function closestprime(x) {
    x = Math.round(x);
    let p1 = x, p2 = x;
    while (true) {
        p1++;
        if (isPrime(p1))
            return p1-x;
        if (p2 > 0) {
            p2--;
            if (isPrime(p2))
                return x-p2;
        }
    }
}

Glob.drawFrom = -1;
Glob.drawTo = 5;


Glob.ff = Glob.drawFrom;
Glob.fileNumber = 0;
function nextFileName() {
    Glob.fileNumber++;
    return ("00000" + Glob.fileNumber).slice (-3);
}

function proceedDrawing() {
    if (Glob.ff >= Glob.drawTo)
        return;
    Glob.ff += 0.02;
    Glob.mYfac = Glob.ff;
    onDrawByFormula("mand(x,y)");
    setTimeout(proceedDrawing, 1);
}
