function Avg () {}
Avg.times = [];

 // Array of pairs
Avg.bestAvgs = null;

function clearAvgs() {
    Avg.times = [];
    Avg.bestAvgs = null; // array of pairs
}

function addTimeToList(ms) {
    Avg.times.push(ms);
}

// returns array of pairs ["aoName", ms] with ms=-1 if no avg
function getAverages() {
    let toCalc = [5,12,50,100];
    let bests = [];
    let worsts = [];
    // ok we'll do shitcode now but TODO optimize
    return [
        ["single", Avg.times.length == 0 ? -1 : Avg.times[Avg.times.length-1]],
        ["avg5", getAo(5)],
        ["avg12", getAo(12)],
        ["avg50", getAo(50)],
        ["avg100", getAo(100)]
    ];
}

function jqTimesTable() {
    let table = $("<table class='table'></table>");
    if (Avg.times.length == 0)
        return table;
    let avgs = getAverages();
    let showStatsBtn = $("<button class='btn btn-sm btn-outline-secondary ml-3'></button>").html("show stats").click(onShowStats);
    table.append(jqTr([$("<span></span>").append("Times",showStatsBtn), Avg.times.length]));

    if (Avg.bestAvgs == null)
        Avg.bestAvgs = avgs;

    for (let i = 0; i < avgs.length; ++i) {
        let p = avgs[i];
        if (p[1] == -1)
            break;

        let updated = (Avg.bestAvgs[i][1] != -1 && p[1] < Avg.bestAvgs[i][1]);

        let timeSpan = $("<span></span>").html(msToHumanReadable(p[1])).addClass(updated ? 'updPb' : '');
        table.append(jqTr([p[0],timeSpan]));

        if (p[1] < Avg.bestAvgs[i][1] || Avg.bestAvgs[i][1] == -1)
            Avg.bestAvgs[i][1] = p[1];
    }

    return table;
}

function onShowStats() {
    // best stats
    let modalHeader = getPuzzleName() + " (" + Avg.times.length + " solves)";
    let div = $("<div></div>");
    let table = $("<table class='table'></table>");

    for (let i = 0; i < Avg.bestAvgs.length; ++i) {
        let p = Avg.bestAvgs[i];
        if (p[1] == -1)
            break;
        table.append(jqTr(["Best " + p[0],msToHumanReadable(p[1])]));
    }
    div.append(table);

    // all times
    let allTimesDiv = $("<div></div>");
    for (let i = 0; i < Avg.times.length; ++i) {
        let t = Avg.times[i];
        let comma = (i == Avg.times.length-1) ? "" : ", ";
        allTimesDiv.append(msToHumanReadable(t) + comma);
    }

    if (Avg.times.length > 1) {
        div.append($("<h2>All times</h2>"), allTimesDiv);
    }
    showBsModal(div, modalHeader);
}

function numsort(a,b) {
    return a - b;
}

// returns -1 if no average
function getAo(n) {
    if (n > Avg.times.length)
        return -1;

    let arr = [];
    for (let i = 0; i < n; ++i) {
        let index = (Avg.times.length-1-i);
        arr.push(Avg.times[index]);
    }
    arr.sort(numsort);

    // remove top 5%
    let toRemove = Math.ceil(0.05*n);
    arr.splice(n-toRemove, toRemove);
    arr.splice(0, toRemove);

    // calc avg
    let res = 0, denom=(n - 2*toRemove);
    arr.forEach(function (x) {
        res += x/denom;
    });
    return res;
}
