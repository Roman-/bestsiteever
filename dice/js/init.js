var faIconsDice = ['dice-one', 'dice-two','dice-three','dice-four','dice-five','dice-six'];

$(document).ready(function() {
    initMenu();


    $("#mainRow").append(makeBeautifulIcons());
    loRoll(1, false);

});

// returns array of jq objects that are fa icons to cache
function iconsToCache() {
    function iTagByName(n) {
        return $("<i class='fa fa-"+n+"'></i>");
    }
    let result = [];

    faIconsDice.forEach(function (n) {
        result.push(iTagByName(n));
    });
    result.push(iTagByName("circle"));
    result.push(iTagByName("ban"));

    return result;
}

function makeBeautifulIcons() {
    let div = $("<div class='col-12 text-center text-secondary'></div>").css('font-size', '1.5em');
    // add all icons to main screen
    iconsToCache().forEach(function (i) {
        div.append(i.addClass('mx-2'));
    });
    return div;
}

function initMenu() {
    $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
}

function divClassByNumber(n) {
    switch(n) {
        case 1: return 'col-12';
        case 2: return 'col-6';
        case 3: return 'col-4';
        case 4: return 'col-3';
        case 5:
        case 6: return 'col-2';
        default: {
            console.error("divClassByNumber", n);
            return 'col-1';
        }
    }
}

// returns array of DIVs spreaded equally depending on N
function divsColumns(n) {
    let divs = [];
    for (let i = 0; i < n; i++) {
        let div = $("<div></div>").addClass(divClassByNumber(n)).addClass('text-center').css('font-size', '4em');
        divs.push(div);
    }
    return divs;
}

// reutrns <i class='fa fa-dice'> or fa-coin
function contentByScore(score, isCoin) {
    if (isCoin) {
        return score ? "<i class='fa fa-circle'></i>" : "<i class='fa fa-ban text-secondary'></i>";
    } else {
        return "<i class='fa fa-" + faIconsDice[score-1] + "'></i>"
    }
}

// returns <i> with no value
function emptyIcon(isCoin) {
    let iconName = isCoin ? "question-circle": "dice-d6";
    return $("<i class='fa fa-"+iconName+" text-secondary'></i>");
}

function pageTitleByNum(n, isCoin) {
    let s = (n == 1) ? "A" : n;
    let thing = isCoin ? (" coin" + ((n>1) ? "s":"")) : " dice";
    return s + thing;
}

function loRoll(n, isCoin = false) {
    // locate N divs in row
    setTitle(pageTitleByNum(n, isCoin));
    $("#mainRow").empty();
    $("#scoreSum").empty().html("<i class='fa fa-arrow-down'></i>");
    let divs = divsColumns(n);
    divs.forEach(function (div) {
        $("#mainRow").append(div.html(emptyIcon(isCoin)));
    });

    function onRollDice() {
        $("#scoreSum").html('&nbsp;');
        let sumScore = 0;
        divs.forEach(function (div) {
            div.html(jqLoadingSpinner());

            let score = isCoin ? randomNumber(2) : randomNumber(1, 7);
            let ms = 200 + Math.round(Math.random() * 200);
            setTimeout(function () {
                div.html(contentByScore(score, isCoin));
            }, ms);
            sumScore += score;
        });

        setTimeout(function () {
            $("#scoreSum").html(sumScore);
        }, 400);
    }
    $("#rollBtn").off('click').on('click', onRollDice);
}

// sets top bar title
function setTitle(s) {
    $("#titleSpan").html(s);
}
