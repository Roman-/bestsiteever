function Gallery() {}

Gallery.imgs = [
  //[pic, formula]
    ['01', 'x/y * 255'],
    ['07', '(x+y)%255'],
    ['06', 'x%y'],
    ['02', 'sin((x-y) / 10) * 255'],
    ['03', 'tan(x/20) * 20 + y'],
    ['20', 'tan(x/20) * 20 + sin(y/4)*255'],
    ['21', '1/sin( x/20 ) * 20 + x'],
    ['05', 'sin(x/10) * 128 + 128'],
    ['11', 'sin(10*x/y) * 255'],
    ['13', 'pow(x, sin(y/10))'],
    ['14', 'pow(1/sin(x/10), sqrt(y))'],
    ['15', '1/sin( x/20 ) * 20'],
    ['16', 'sin(1/x * cos(y/10)*1000) * 255'],
    ['17', 'y/sin(1/sin(x/10))'],
    ['12', 'sin(x*y/10)*255'],
    ['19', '((x-150)*(x-150)+(y-150)*(y-150) - 10000)'],
    ['31', 'mand(x,y)'],
    ['22', 'x^y'],
    ['32', 'mand(mand(x,y),y)'],
    ['23', 'x << y/10'],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],

];

function jqCardsDiv() {
    let div = $("<div class='row'></div>");
    Gallery.imgs.forEach(function (pair) {
        let src = "gallery/" + pair[0] + ".png";
        let formula = pair[1];
        if (formula.trim() == '') {
            return;
        }

        let img = $('<img class="card-img-top">')
            .attr('src', src).css('cursor', 'pointer')
            .click(function () {onDrawByFormula(formula)});
        let cardBody = $("<div class='card-body'></div>").append($("<p class='card-text'></p>").html(formula));
        let card = $('<div class="card col-sm-4 col-12" style="width: 18rem;"></div>').append(img, cardBody);

        div.append(card);
    });

    return div;
}
