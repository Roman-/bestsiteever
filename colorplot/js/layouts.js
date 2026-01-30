function loGallery() {
    let h2 = $("<h2></h2>").html("Colorplot gallery");
    let sub = $("<h5></h5>").html("Click on the picture to edit formula");
    $("#mainLayout").empty().append(h2, sub, jqCardsDiv());
}

function loAbout() {
    $("#mainLayout").empty().append(Glob.textIntro);
}
