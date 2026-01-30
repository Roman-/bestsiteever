
function elemName(el) {
    if (el == 'x')
        return 'x-centers';
    if (el == 't')
        return 't-centers';
    if (el == 'w')
        return 'wings';
    if (el == 'e')
        return 'edges';
    if (el == 'i')
        return 'images';
    if (el == 'c')
        return 'corners';
    if (el == 'o')
        return 'other (parities, flips etc)';
    return ':)';
}

function compareTables(a, b) {
    return a["rank"] < b["rank"] ? -1 : 1;
    // first priority: number of elements
    if (Object.keys(a["elements"]).length > Object.keys(b["elements"]).length)
        return -1;
    if (Object.keys(a["elements"]).length < Object.keys(b["elements"]).length)
        return 1;
    // don't compare empty elements
    if (Object.keys(a["elements"]).length == 0)
        return 0;
    // TODO  if more than one buffer per element (like in my generated tables), increase the rating
    // second priority: elements themself
    if (Object.keys(a["elements"])[0] > Object.keys(b["elements"])[0])
        return -1;
    if (Object.keys(a["elements"])[0] < Object.keys(b["elements"])[0])
        return 1;
    // final priority: initial position
    return a["rank"] < b["rank"] ? -1 : 1;
}

function sortTables() {
    tables.sort(compareTables);
}

function closePreview()
{
    if (document.getElementById( "previewWindow" ).style.display != 'none')
    {
        document.getElementById( "previewWindow" ).style.display = 'none';
        document.getElementById( "previewWindowBack" ).style.display = 'none';
    }
}

function previewPicture(picUrl) {
    document.getElementById( "previewWindow" ).style.display = 'initial';
    document.getElementById( "previewWindowBack" ).style.display = 'initial';
    document.getElementById( "popupPic" ).innerHTML = "<img src='"+picUrl+"' onclick='closePreview();' class='previewBig'/>";
}

