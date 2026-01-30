var N, SecondsToWait, digitIndex;	
var delayInMilliseconds = 1000; // 1000 is 1 second, <1000 is faster
var countdownTimer, readDigitTimer;
var digitsArray = [];
var digitsSnd = []; //pre-load
var voiceFolder = "f2";
var myImage = new Image(200, 200); // preload
myImage.src = 'images/speaker.png';
var imagesArray = Global.imgsRaw.split("\n");

var settingsLayout,concLayout, memoLayout, recallLayout, reviewLayout, countDownLabel;

for (var i = 0; i <= 9; i++) //pre-load
    digitsSnd.push(new Audio("digits_sounds/" + voiceFolder + "/" +i+".wav"));


// returns label (number: image) for 3-digit number that starts at \param index in numbers array
function hintForNumber(index) {
    var startIndex = digitIndex - digitIndex%3;
    var number = digitsArray[index+0] * 100 + 
                 digitsArray[index+1] * 10 + 
                 digitsArray[index+2] * 1;
    return number + ' ' +  imagesArray[number];
}

// returns html - hint (image + numbers) for last 2 3-digit numbers spoken
function getHintHtml() {
    var stringToDisplay = hintForNumber(digitIndex - digitIndex%3);
    // also display prev number
    if (digitIndex > 2)
        stringToDisplay = hintForNumber(digitIndex - 3 - digitIndex%3) + "<br>" + stringToDisplay;
    return stringToDisplay;
}

function hide(elem) {
    elem.style.display = "none";
}

function show(elem) {
    elem.style.display = "table";
    if (elem.id == "recallLayout")
        document.getElementById("userRecallArea").focus();
}

function reset() {
    //layouts		
    show(settingsLayout);
    hide(concLayout);
    hide(memoLayout);
    hide(recallLayout);
    hide(reviewLayout);
    //clear intervals
    clearInterval(countdownTimer);
    clearInterval(readDigitTimer);
}

function ReturnToWebsitePage() {
    window.location.assign("http://bestsiteever.net");

}

function ChangeSpeed(d) {
    delayInMilliseconds = d;
    if (delayInMilliseconds == 1000)
        document.getElementById("rangeSpeedText").innerHTML = "1 second";
    else
        document.getElementById("rangeSpeedText").innerHTML = delayInMilliseconds + "ms";
}

function ChangeVoice() {
    voiceFolder = document.getElementById("voiceSelector").value;
    digitsSnd = [];
        for (var i = 0; i <= 9; i++) //pre-load
            digitsSnd.push(new Audio("digits_sounds/" + voiceFolder + "/" +i+".wav"));
    Play(Math.floor(Math.random()*10));
}

function Play(n) // reads number n aloud
{
    digitsSnd[n].currentTime=0; // otherwise cases like "..., 5, 5, ..." would not work
    digitsSnd[n].play();
}

function CountdownIteration() { // show next digit in "countDownLabel" label
    SecondsToWait--;
    if (SecondsToWait == 0) { // start memo
        hide(concLayout);
        clearInterval(countdownTimer);
        StartListening();			
    }
    else {
        countDownLabel.innerHTML = SecondsToWait;
    }
}

function SkipCountdown() {
    hide(concLayout);
    clearInterval(countdownTimer);		
    StartListening();
}

function StartCountdown() {
    InitArray();
    hide(settingsLayout);
    show(concLayout);
    
    countDownLabel.innerHTML = (SecondsToWait = document.getElementById("concentrationTime").value); // get concentration time
    //AdjustTextHeight(countDownLabel, document.getElementById("clContainer"));
    countdownTimer = setInterval(CountdownIteration, delayInMilliseconds);
}

function InitArray() {
    digitsArray = [];
    N = document.getElementById("amountOfNumbers").value;
    var arrayString = "array: "; // to display in console
    for (var i = 0; i < N; i++) {
        digitsArray.push( Math.floor(Math.random() * 10) );
        arrayString += digitsArray[i]; // test
    }
    console.log("Generated sequesnce: ", arrayString);
}

function PlayNextDigit() {
    digitIndex++;
    if (digitIndex == N) {
        FinishListening();
    } else {
        Play( digitsArray[digitIndex] );
    }

}

function StartListening() {
    show(memoLayout);
    Play(digitsArray[digitIndex = 0]);
    readDigitTimer = setInterval(PlayNextDigit, delayInMilliseconds);
}

function FinishListening() {
    hide(memoLayout);
    clearInterval(readDigitTimer); // no longer read numbers
    show(recallLayout);
    document.getElementById("userRecallArea").maxLength = Math.min(digitIndex + 1, N);
    document.getElementById("userRecallArea").value = "";
}

function FinishRecall() {
    hide(recallLayout);
    show(reviewLayout);
    document.getElementById("reviewTextDiv").innerHTML = "Initial digits are on top and your answer is on bottom";
    var QuestionInnerHtml = "", AnswerInnerHtml = "";
    var s = document.getElementById("userRecallArea").value;
    if (s == "") {
        document.getElementById("ptsDiv").innerHTML = "No recall";
        hide(document.getElementById("QuestionDiv"));
        hide(document.getElementById("AnswerDiv"));
        hide(document.getElementById("reviewTextDiv"));
        return;
    }
    else {
        show(document.getElementById("QuestionDiv"));
        show(document.getElementById("AnswerDiv"));
        show(document.getElementById("reviewTextDiv"));
    }
    var stillCorrect = true;
    var i = 0, pts, corr = 0;
    for (; i < s.length; i++) {
        if (i!=0 && i%3 == 0) {
            QuestionInnerHtml += "&nbsp;";
            AnswerInnerHtml += "&nbsp;";
        }

        if (s[i] == digitsArray[i]) { // correct
            QuestionInnerHtml += "<span class=\"corr\">" + s[i] + "</span>";
            AnswerInnerHtml += "<span class=\"corr\">" + s[i] + "</span>";
            corr++;
        }
        else {
            QuestionInnerHtml += "<span class=\"err\">" + digitsArray[i] + "</span>";
            AnswerInnerHtml += "<span class=\"err\">" + s[i] + "</span>";
            if (stillCorrect == true) {
                stillCorrect = false;
                pts = i;
            }
        }
    }
    //apply span tags
    document.getElementById("QuestionDiv").innerHTML = QuestionInnerHtml;
    document.getElementById("AnswerDiv").innerHTML = AnswerInnerHtml;
    if (stillCorrect == true)
        document.getElementById("ptsDiv").innerHTML = (i) + " points";
    else
        document.getElementById("ptsDiv").innerHTML = corr + "/" + i + " (" + pts + " points)";
}

function AdjustTextHeight(spanToAdjust, container) {
    spanToAdjust.style.whiteSpace = "nowrap";
    var init = parseFloat(window.getComputedStyle(spanToAdjust).fontSize);// initial font size
    var v = spanToAdjust.offsetHeight; // initial width in pixels
    spanToAdjust.style.fontSize = Math.floor(init / v * container.offsetHeight - 0.5);
}

function GoForward() {
    if (settingsLayout.style.display == "table")
        StartCountdown();
    else if (concLayout.style.display == "table")
        SkipCountdown();
    else if (memoLayout.style.display == "table")
        FinishListening();
    else if (recallLayout.style.display == "table")
        FinishRecall();
    else
        reset();
}

function keyDown(){
    var k = window.event.keyCode;
    if (k == 13 || k == 32) { // proceed
        GoForward();
    } else if (k == 27) { // back = escape
        reset();
    } else if (k == 72) { // h = hint
        $("#memoStageHeader").html(getHintHtml);
    }
}

function keyUp() {
    var k = window.event.keyCode;
    if (k == 72) { // h = hint
        $("#memoStageHeader").html("#memo");
    }
}

function CheckInput(ob) {
    var invalidChars = /[\s]/gi
    if(invalidChars.test(ob.value)) {
        ob.value = ob.value.replace(invalidChars,"");
    }
}

