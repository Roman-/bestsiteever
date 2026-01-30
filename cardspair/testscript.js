var valuesArray = ['A234567890JQK'];
var suitsArray = ['♦♠♥♣'];

var cell00 = document.getElementById('00');
var cell10 = document.getElementById('10');
var cell01 = document.getElementById('01');
var cell11 = document.getElementById('11');

var values1 = document.getElementById('val1');
var suits1 = document.getElementById('suits1');
var values2 = document.getElementById('val2');
var suits2 = document.getElementById('suits2');

function initInputs() {
    window.values1.value = window.values2.value = window.valuesArray;
    window.suits1.value = window.suits2.value = window.suitsArray;
}


function randomElement(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}

function fromInput(el) {
    var result = randomElement(el.value);
    if (result == '0')
        result = '10';
    return result;
}

function classNameOf(suit) {
    var reds = "♢♡♦♥";
    for (var i = 0; i < reds.length; i++)
        if (suit == reds[i])
            return 'redcard';
    var blacks = "♠♣♧♤";
    for (var i = 0; i < blacks.length; i++)
        if (suit == blacks[i])
            return 'blackcard';
    return 'unknowncard';
}

function generateDrill() {
    // first card
    var suit1 = fromInput(suits1);
    var className1 = classNameOf(suit1);

    //var value1 = '\u1F0A1';
    var value1 =  String.fromCodePoint(0x1F0A1);
    cell00.innerHTML = "<span class='" + className1 + "'>" + value1 + "</span>";

    // second card
    var suit2 = fromInput(suits2);
    var className2 = classNameOf(suit2);
    cell01.innerHTML = "<span class='" + className2 + "'>" + fromInput(values2) + "</span>";
    cell11.innerHTML = "<span class='" + className2 + "'>" + suit2 + "</span>";

    surprize();
}


document.getElementById("bodyId").addEventListener("keydown", function(event) {
    if (event.keyCode == 32 || event.keyCode == 13) // space
    {
        generateDrill();
        return;
    }
});

function surprize() {
    if (Math.random() < 0.003) {
        cell01.innerHTML = "<span class='joker'>🂿</span>";
        cell11.innerHTML = "<span class='jokerDescr'>(it\'s a freakin\' joker)</span>";
        return;
    }
    if (Math.random() < 0.004) {
        cell01.innerHTML = "<span class='joker'>F</span>";
        cell11.innerHTML = "<span class='joker'>🖕</span>";
        return;
    }

}
