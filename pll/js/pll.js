// on document load
document.addEventListener("DOMContentLoaded", function(event) {
    loadPllsButtons();

    // dark style?
    Global.isDarkMode = (loadLocal("Global.isDarkMode", false) === "true");
    checkDarkMode();
});

/// \value stringified json object or standard type
/// \returns true if succeed
function saveLocal(name, value) {
    // If the platform supports localStorage, then save the value
    try {
        localStorage.setItem(name, value);
        return true;
    }
    catch(e) {
        // Most likely cause of errors is a very old browser that doesn't support localStorage (fail silently)
        console.warn("saving error");
        return false;
    }
}

/// \returns loaded value or specified defaultValue in case of error
function loadLocal(name, defaultValue) {
    // If the platform supports localStorage, then load the selection
    try {
        return localStorage.getItem(name);
    }
    catch(e) {
        // Either no selection in localStorage or browser does not support localStorage (fail silently)
        console.warn("can\'t load from localstorage");
        return defaultValue;
    }
}

// removing focus when clicked on checkbox
var e = document.getElementsByTagName("input");
for (var i = 0; i < e.length; i++)
{
	if (e[i].type == "checkbox")
		e[i].addEventListener("mousedown", function(event) {
			event.preventDefault();
			this.blur();
		});
}

var allowStartTheTimer;
/// invokes generateScramble() and sets scramble string
function showScramble()
{
	window.allowStartTheTimer = false;
	var s;
	if (getAvailableAufs().length == 0)
		s = "select some AUFs below";
	else if (getAvailableBlockPos().length == 0)
		s = "select a few block positions below";
	else if (getSelectedCasesArray().length == 0)
		s = "Select a few PLL cases above to practise them";
	else {
		s = "scramble: " + generateScramble();
		window.allowStartTheTimer = true;
	}
		
	document.getElementById("scramble").innerHTML = s;
}

function randomElement(arr)
{
	return arr[Math.floor(Math.random()*arr.length)];
}

function getAvailableBlockPos()
{
	var blockPos = [];
	if (document.getElementById("cbBL").checked)
		blockPos.push("BL");
	if (document.getElementById("cbRB").checked)
		blockPos.push("RB");
	if (document.getElementById("cbFR").checked)
		blockPos.push("FR");
	if (document.getElementById("cbLF").checked)
		blockPos.push("LF");
	return blockPos;
}

function getAvailableAufs()
{
	var aufs = [];
	if (document.getElementById("cbNoAuf").checked)
		aufs.push("noAuf");
	if (document.getElementById("cbAufU").checked)
		aufs.push("U");
	if (document.getElementById("cbAufU2").checked)
		aufs.push("U2");
	if (document.getElementById("cbAufU'").checked)
		aufs.push("U'");
	return aufs;
}

var lastScramble = "";
var lastPllCaseName = "";

function generateScramble()
{
	if (window.lastScramble != "")
		document.getElementById("last_scramble").innerHTML = "last scramble: " + window.lastScramble;
		
	var pllName = randomElement(getSelectedCasesArray());
	var auf = randomElement(getAvailableAufs());
	var blockPos = randomElement(getAvailableBlockPos());
	
	if (algs[pllName][auf] == null || algs[pllName][auf].length == 0)
		return "algs for this pll not found: " + pllName;
		
	var alg = randomElement(algs[pllName][auf]);
	var finalAlg = moveBlock("BL", blockPos, alg);
	
	/* log */
	var logString = finalAlg + " (" + pllName + "-perm, AUF = " + auf + ", block on " + blockPos + ")";

	window.lastScramble = logString;
	window.lastPllCaseName = pllName;
	
	return finalAlg;
}

// returns algoritm with block on desiredPos, considering that alg has block on prevPos
function moveBlock(prevPos, desiredPos, alg)
{
	var aufs = {
		BL: {
			BL: "",
			RB: "y",
			FR: "y2",
			LF: "y'"
		},
		RB: {
			BL: "y'",
			RB: "",
			FR: "y",
			LF: "y2"
		},
		FR: {
			BL: "y2",
			RB: "y'",
			FR: "",
			LF: "y"
		},
		LF: {
			BL: "y",
			RB: "y2'",
			FR: "y'",
			LF: ""
		}
	}
	rot = aufs[prevPos][desiredPos];
	var newAlg = applyRotationForAlgorithm(alg, rot);
	return newAlg;
}

// returns block position depending on what AUF was generated (no auf = block on BL)
// auf = U => block position BL + U = RB: false!
function blockPositionByAuf(auf)
{
	switch (auf)
	{
	case "noAuf": return "BL";
	case "U": return "RB";
	case "U2": return "FR";
	case "U'": return "LF";
	default: console.log("ERROR blockPositionByAuf: unknown auf: " + auf); return "BL";
	}
}

// http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
function replaceAll(str,mapObj){
	if (!mapObj)
		return str;
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched];
    });
}

// returns new string with transformed algorithm.
// Returnes sequence of moves that get the cube to the same position as (alg + rot) does, but without cube rotations.
// Example: applyRotationForAlgorithm("R U R'", "y") = "F U F'"
function applyRotationForAlgorithm(alg, rot)
{
	var mapObj;
	if (rot=="y")
		mapObj = {R:"F",F:"L",L:"B",B:"R"};
	if (rot=="y'")
		mapObj = {R:"B",B:"L",L:"F",F:"R"};
	if (rot=="y2")
		mapObj = {R:"L",L:"R",B:"F",F:"B"};

	return replaceAll(alg, mapObj);
}

function inverse_scramble(s)
{
	if (s == "noAuf")
		return s;
	var arr = s.split(" ");
	var result = "";
	for (var i = 0; i < arr.length; i++)
	{
		var it = arr[i];
		if (it.length == 0)
			continue;
		if (it[it.length - 1] == '2')
			result = it + " " + result;
		else if (it[it.length - 1] == '\'')
			result = it.substr(0, it.length - 1) + " " + result;
		else
			result = it + "' " + result;
	}
	
	return result.substr(0, result.length-1);
}

/* PLL Buttons-related */

function selectionKeys() 
{
	return 	"<span class='selectionButton' onclick=\"selectAll();\" unselectable=\"on\" onselectstart=\"return false;\">&nbsp;∀&nbsp;</span> " +
	"<span class=\"selectionButton\" onclick=\"selectCertainPlls([]);\" unselectable=\"on\" onselectstart=\"return false;\">&nbsp;∅&nbsp;</span> "// +
	//"<span class=\"selectionButton\" onclick=\"selectCertainPlls([\'Ja\', \'Jb\', \'Na\', \'Nb\']);\" unselectable=\"on\" onselectstart=\"return false;\">JN</span>" +
//	"<span class=\"selectionButton\" onclick=\"selectCertainPlls([\'Aa\', \'Ab\', \'Ga\', \'Gb\', \'Gc\', \'Gd\']);\" unselectable=\"on\" onselectstart=\"return false;\">GA</span>" +
//	"<span class=\"selectionButton\" onclick=\"selectCertainPlls([\'Ua\', \'Ub\', \'Z\']);\" unselectable=\"on\" onselectstart=\"return false;\">UZ</span>" +
//	"<span class=\"selectionButton\" onclick=\"selectCertainPlls([\'V\', \'Y\', \'E\']);\" unselectable=\"on\" onselectstart=\"return false;\">VYE</span>"
	;
}

// returnes array of PLL cases names
function getSelectedCasesArray()
{
	var s = [];
	var e = document.getElementsByClassName("selected");
	for (var i = 0; i < e.length; i++)
		s[i] = e[i].innerHTML;
	return s;
}

function loadPllsButtons()
{
    timer = document.getElementById("timer");
    timer.addEventListener("touchstart", handleTouchStart, false);
    timer.addEventListener("touchend", handleTouchEnd, false);

    timerSize = parseInt(loadLocal("pllTimerSize", ''));
    if (isNaN(timerSize) || timerSize <= 0)
        timerSize = 50;
    scrambleSize = parseInt(loadLocal("pllScrambleSize",''));
    if (isNaN(scrambleSize) || scrambleSize <= 0)
        scrambleSize = 30;

    adjustSize('scramble', 0);
    adjustSize('timer', 0);
    displayStats();

	var s = "";
	for (var key in algs) {
		if (algs.hasOwnProperty(key)) {
			s += generatePllButton(key);
		}
	}
	document.getElementById("pllButtons").innerHTML = s + selectionKeys();
	
	loadPlls();
	
	showScramble();
}

function generatePllButton(name)
{
	return "<a class='unselected' onclick='algClicked(this);' unselectable=\"on\" onselectstart=\"return false;\">" + name + "</a> ";
}

function algClicked(el)
{
	if (el.className == "unselected")
		el.className = "selected";
	else
		el.className = "unselected";
	
	showScramble();
	savePlls();
}

function selectAll()
{
	var e = [].slice.call(document.getElementsByClassName("unselected"));
	for (var i = 0; i < e.length; i++)
		e[i].className = "selected";
	showScramble();
	savePlls();
}

function selectCertainPlls(namesArray)
{
	var e = ([].slice.call(document.getElementsByClassName("unselected"))).concat([].slice.call(document.getElementsByClassName("selected")));
	for (var i = 0; i < e.length; i++)
	{
		if (namesArray.indexOf(e[i].innerHTML) == -1) // names arr does not contain current el
			e[i].className = "unselected";
		else
			e[i].className = "selected";
	}
	
	showScramble();
	savePlls();
}

function savePlls()
{
	var pllsString = "";
	var e = document.getElementsByClassName("selected");
	for (var i = 0; i < e.length; i++)
		pllsString += e[i].innerHTML;
	saveLocal("plls", pllsString);
}

function loadPlls()
{
	var pllString = loadLocal("plls", "");
	if (pllString == "" || pllString == null) {
		selectCertainPlls(["Ga", "Gb", "Gc", "Gd"]);
	}
	else {
		var e = ([].slice.call(document.getElementsByClassName("unselected"))).concat([].slice.call(document.getElementsByClassName("selected")));
		for (var i = 0; i < e.length; i++)
		{
			if (pllString.indexOf(e[i].innerHTML) == -1) // names arr does not contain current el
				e[i].className = "unselected";
			else
				e[i].className = "selected";
		}
	}
}

/*		TIMER		*/

var startMilliseconds, stopMiliseconds; // date and time when timer was started
var allowed = true; // allowed var is for preventing auto-repeat when you hold a button
var running = false; var waiting = false;
var timer = document.getElementById("timer");

var timerActivatingButton = 32; // 17 for ctrl
var timeout;

function msToHumanReadable(duration) {
    var milliseconds = parseInt((duration%1000)/10)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && (minutes > 0 || hours > 0)) ? "0" + seconds : seconds;
	milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;
	
	hoursString = (hours == 0) ? "" : hours + ":";
	minutesString = (minutes == 0) ? "" : minutes + ":";

    return hoursString + minutesString + seconds + "." + milliseconds;
}

function displayTime() {
	if (running)
	{
		var d = new Date();
		var diff = d.getTime() - window.startMilliseconds;
		if (diff >= 0)
			timer.innerHTML = msToHumanReadable(diff);
	}
}

function stopTimer() {
    // TIMER STOPPED
    waiting = true;
    running = false;
    clearTimeout(timeout);
    
    var d = new Date();
    stopMiliseconds = d.getTime();
    timer.innerHTML = msToHumanReadable(stopMiliseconds - startMilliseconds);
    //console.log("execution time: " + timer.innerHTML);
    timer.className = "timer_Stopped";
    
    appendStats();
    showScramble();
}

function getReadyTimer() {
    waiting = false;
    timer.innerHTML = "0.00";
    timer.className = "timer_Ready";
}

function runTimer() {
    var d = new Date();
    startMilliseconds = d.getTime();
    running = true;
    timeout = setInterval(displayTime, 10);
    timer.className = "timer_Running";
}


function handleTouchEnd() {
	allowed = true;
	if (!window.allowStartTheTimer)
		return; // preventing auto-repeat
	if (!running && !waiting) {
        runTimer();
	}
	else {
		timer.className = "timer_notRunning";
	}
}

function handleTouchStart() {
    if (!allowed || !window.allowStartTheTimer)
        return; // preventing auto-repeat and empty scrambles
        
    if (running)
    {
        stopTimer();
        return;
    }
    else
    {
        getReadyTimer();
        return;
    }
}

document.getElementById("bodyid").addEventListener("keydown", function(event) {
		// delete hotkey - remove last
		if (event.keyCode == 46 && !running)
		{
			if (!!window.event.shiftKey)
				confirmClear();
			else
				confirmRemLast();
			return;
		}
		
		if (!allowed || !window.allowStartTheTimer)
			return; // preventing auto-repeat and empty scrambles
			
		if (event.keyCode != 16) // shift
			allowed = false;
			
		if (running)
		{
            stopTimer();
			return;
		}
		else if (event.keyCode == timerActivatingButton)
		{
            getReadyTimer();
			return;
		}
		
});

document.getElementById("bodyid").addEventListener("keyup", function(event) {
	allowed = true;
	if (!window.allowStartTheTimer)
		return; // preventing auto-repeat
	if (!running && !waiting && (event.keyCode == timerActivatingButton)) {
        runTimer();
	}
	else {
		timer.className = "timer_notRunning";
	}
});

// sizes. Too tired, cannot produce normal code
var timerSize,scrambleSize;

function adjustSize(item, inc)
{
	if (item == 'timer')
	{
		window.timerSize += inc
		document.getElementById('timer').style.fontSize = window.timerSize + "px";
		saveLocal("pllTimerSize", window.timerSize);
	}
	
	if (item == 'scramble')
	{
		window.scrambleSize += inc
		document.getElementById('scramble').style.fontSize = window.scrambleSize + "px";
		saveLocal("pllScrambleSize", window.scrambleSize);
	}
}

function resetDefaults()
{
	var e = document.getElementsByTagName("input");
	for (var i = 0; i < e.length; i++)
		if (e[i].type == "checkbox")
			e[i].checked = true;
	window.timerSize = 50;
	window.scrambleSize = 30;
	adjustSize('scramble', 0);
	adjustSize('timer', 0);
}

/* STATS */

// http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/// [0: ResultInstance, 1: ResultInstance, ...]
var timesArray = JSON.parse(loadLocal("plltimesarray", '[]'));
if (timesArray == null)
    timesArray = [];


// invoked right after the timer stopped
function appendStats()
{
	// assuming the time can be grabbed from timer label, and the case - window.lastPllCaseName
	window.timesArray.push(makeResultInstance());
	displayStats();
}

/// removes time from array and invokes displayStats()

function updateIndeces() {
    for (var i = 0; i < window.timesArray.length; i++)
    {
        window.timesArray[i]["index"] = i;
    }
}
function removeTime(i)
{
	window.timesArray.splice(i, 1);
        updateIndeces();
	displayStats();
}

/// requests confirmation and deletes result
function confirmRem(i)
{
	var inst = window.timesArray[i];
	if (confirm("Are you sure you want to remove this time?\n\n" + inst["time"] + "\n\ntime details: " + inst["details"]))
		removeTime(i);
}

function confirmRemLast()
{
	var i = window.timesArray.length;
	if (i != 0)
		confirmRem(i - 1);
}

/// requests confirmation and empty times array (clear session)
function confirmClear()
{
	if (confirm("Are you sure you want to clear session?"))
	{
		window.timesArray = [];
		displayStats();
	}
}

/// \param r - result instance (see makeResultInstance)
/// \returns html code for displaying the instance
function makeHtmlDisplayableTime(r)
{
	return resultString = "<span class='timeResult' title='" + escapeHtml(r["details"]) +"' onclick='confirmRem(" + r["index"] + ")'" + ">" 
	+ r["time"] + "</span>";
}

function displayStats()
{
	saveLocal("plltimesarray", JSON.stringify(window.timesArray));
	
	var el = document.getElementById("times");
	if (window.timesArray.length == 0)
	{
		el.innerHTML = "";
		return;
	}
	
	var displayByCases = true;
	
	if (displayByCases)
	{
		// case-by-case
		var resultsByCase = []; // ["Aa": [...], "Ua": [...], ...];
		for (var i = 0; i < window.timesArray.length; i++)
		{
			var currentPll = window.timesArray[i]["pll"];
			if (resultsByCase[currentPll] == null)
				resultsByCase[currentPll] = [];
			resultsByCase[currentPll].push( window.timesArray[i] );
		}
		
		var keys = Object.keys(resultsByCase);
		keys.sort();
		
		var s = "";
		// allocate them inside times span
		for (var j = 0; j < keys.length; j++) {
			var pll = keys[j];
			var timesString = "";
			var meanForCase = 0.0;
			var i = 0;
			for (; i < resultsByCase[pll].length; i++)
			{
				timesString += makeHtmlDisplayableTime(resultsByCase[pll][i]);
				if (i != resultsByCase[pll].length - 1)
					timesString += ", ";
				// avg
				meanForCase *= i/(i+1);
				meanForCase += resultsByCase[pll][i]["ms"] / (i+1);
			}
			s += "<div class='pllNameHeader'><span class='pllNameStats'>" + pll + "</span>: " + msToHumanReadable(meanForCase) + "</div>" + timesString + "<br><br>";
		}
		el.innerHTML = s;
	}
	else
	{
		for (var i = 0; i < window.timesArray.length; i++)
		{
			el.innerHTML += makeHtmlDisplayableTime(window.timesArray[i]);
			if (i != window.timesArray.length - 1)
				el.innerHTML += ", ";
		}
	}
}

function makeResultInstance()
{
	var currentTime = document.getElementById("timer").innerHTML;
	var details = window.lastScramble;
	var index = window.timesArray.length;
	
	return {
		"time": currentTime,
		"ms": timeStringToMseconds(currentTime) * 10, // *10 because current time 1.23 display only hundreths, not thousandth of a second
		"details": details,
		"index": index,
		"pll": window.lastPllCaseName
	};
}

// converts timestring to milliseconds (int)
// 1:06.15 -> 6615
function timeStringToMseconds(s) {
		if (s == "")
			return -1;
		var parts = s.split(":");
		var secs = parseFloat(parts[parts.length - 1]);
		if (parts.length > 1) // minutes
			secs += parseInt(parts[parts.length - 2]) * 60;
		if (parts.length > 2) // hrs
			secs += parseInt(parts[parts.length - 3]) * 3600;
		if (isNaN(secs))
			return -1;
		return Math.round(secs * 100);
}

function Global() {
    this.isDarkMode = true;
}

// switches between night and day interface mode
function toggleNightmode() {
    Global.isDarkMode = !Global.isDarkMode;
    saveLocal("Global.isDarkMode", Global.isDarkMode);
    checkDarkMode();
}

// checks Global.isDarkMode and applies current mode to interface
function checkDarkMode() {
    if (Global.isDarkMode === true)
        DarkReader.enable();
    else
        DarkReader.disable();

    document.getElementById("nightBtn").innerHTML = (Global.isDarkMode === true) ? "lights ON" : "lights OFF";
}
