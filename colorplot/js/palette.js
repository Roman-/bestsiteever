// maps (x) to RGB color.
// returns array [r,g,b]
function pf(x) {
    return palBlue(x);
}

// 0 = black, 255 = white
function palGray(x) {
    x = Math.round(x);
    if (x < 255)
        return [x,x,x];
    return [255,255,255];
}

// 0 = black, 255 = blue
function palBlue(x) {
    x = Math.round(x);
    if (x < 255)
        return [0,0,x]; // blue
    if (x < 255*2)
        return [0,x%255,255]; // blue -> aqua
    if (x < 255*3)
        return [x%255,255,255]; // aqua -> white
    if (x < 255*4)
        return [255,255,4*255 - x]; // white -> yellow
    if (x < 255*5)
        return [255,5*255 - x,0]; // yellow -> red
    if (x < 255*6)
        return [255,x-5*255,x-5*255]; // red -> white again
    return [255,255,255];
}
