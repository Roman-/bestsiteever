// shuffles array in place. \param a an array containing the items.
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/*
function randomElement(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}
*/
