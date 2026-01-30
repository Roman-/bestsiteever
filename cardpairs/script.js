Glob = function (){};
Glob.deckIndex = 0;
Glob.deck = null;
Glob.autoInterval = null;

$(document).ready(function() {
    $("#showDrillBtn").click(generateDrill).focus();
    $("#showDrillBtn").focus();
    $("#autoDrill").click(drillClicked).focus();
    $(".cardsPairSetup").change(resetDeck);
});

function drillClicked() {
    if (Glob.autoInterval) {
        clearInterval(Glob.autoInterval);
        Glob.autoInterval = null;
        $("#autoDrill").html("play");
    } else {
        // start
        if ($('#secondsInterval').val() < 1)
            $('#secondsInterval').val(1000);
        let ms = $('#secondsInterval').val();
        setStatus('autoplay starts in ' + (ms/1000) + " seconds");
        $("#autoDrill").html("stop");
        function triggerClick() {
            $("#showDrillBtn").trigger('click');
        }
        Glob.autoInterval = setInterval(triggerClick, ms);
    }
}

function resetDeck() {
    Glob.deck = null;
    setStatus('deck reset');

    clearInterval(Glob.autoInterval);
    Glob.autoInterval = null;
}

function setStatus(text) {
    $("span#status").html(text);
}

// initializes flashcard-based index.
// deck is array of [s1,v1,s2,v2]
function initDeck() {
    clearspaces();
    Glob.deck = [];
    Glob.deckIndex = 0;

    let vals1 = $("#val1").val().split('');
    let suits1 = $("#suits1").val().split('');
    let vals2 = $("#val2").val().split('');
    let suits2 = $("#suits2").val().split('');


    vals1.forEach(function (v1) {
      suits1.forEach(function (s1) {
        vals2.forEach(function (v2) {
          suits2.forEach(function (s2) {
              if (v1 == '0')
                  v1 = '10'
              if (v2 == '0')
                  v2 = '10'

              if (v1 != v2 || s1 != s2)
                  Glob.deck.push([v1, s1, v2, s2]);
          })
        })
      })
    });
    if (Glob.deck.length == 0) {
        setStatus("cant init deck");
        Glob.deck = [['f', 'c', 'u', 'k']];
        return;
    }
    setStatus("init deck: " + Glob.deck.length + " pairs");

    shuffle(Glob.deck);
}

function clearspaces() {
    $("input[type=text]").each(function (index){
        $(this).val( $(this).val().replace(/\s/g,'') );
    });
}

function resetInputs() {
    var valuesArray = 'A234567890JQK';
    var suitsArray = '♦♠♥♣';
    $("#val1").val(valuesArray);
    $("#val2").val(valuesArray);
    $("#suits1").val(suitsArray);
    $("#suits2").val(suitsArray);
    resetDeck();
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
    if (Glob.deck === null)
        initDeck();
    let quad = Glob.deck[Glob.deckIndex];
    setStatus((Glob.deckIndex+1) + "/" + Glob.deck.length);
    Glob.deckIndex = (Glob.deckIndex+1) % Glob.deck.length;


    // first card
    var value1= quad[0];
    var suit1 = quad[1];
    var className1 = classNameOf(suit1);
    $("#00").html("<span class='" + className1 + "'>" + value1 + "</span>");
    $("#10").html("<span class='" + className1 + "'>" + suit1 + "</span>");

    // second card
    var value2 = quad[2];
    var suit2 = quad[3];
    var className2 = classNameOf(suit2);
    $("#01").html("<span class='" + className2 + "'>" + value2 + "</span>");
    $("#11").html("<span class='" + className2 + "'>" + suit2 + "</span>");

    // surprize();
}
document.getElementById("bodyId").addEventListener("keydown", function(event) {
    if (event.keyCode == 32 || event.keyCode == 13) // space
    {
        generateDrill();
        return;
    }
});

/*
function surprize() {
    if (Math.random() < 0.001) {
        cell01.innerHTML = "<span class='joker'>🂿</span>";
        cell11.innerHTML = "<span class='jokerDescr'>(it\'s a freakin\' joker)</span>";
        return;
    }
    if (Math.random() < 0.002) {
        cell01.innerHTML = "<span class='joker'>F</span>";
        cell11.innerHTML = "<span class='joker'>🖕</span>";
        return;
    }

}
*/
