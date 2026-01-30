// returns how many of each pixels do we have
function howManyOfEach() {
    let numPixels = {};
    for (let i = 0; i < newImageData.data.length; i += 4) {
        r = newImageData.data[i];
        g = newImageData.data[i+1];
        b = newImageData.data[i+2];

        let prop = r + "," + g + "," + b;
        if (!numPixels.hasOwnProperty(prop))
            numPixels[prop] = 1;
        else
            numPixels[prop]++;
    }
    console.log(numPixels);
}
