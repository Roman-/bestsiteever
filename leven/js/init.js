$(document).ready(function() {
    $("#mainLayout").empty().append(jqLoadingSpinner());
    initMenu();

    setTimeout(loPlay, 50);
});

function initMenu() {
    $("#navbarNav").find("li.nav-item a.nav-link").attr('data-toggle', 'collapse').attr("data-target", "#navbarNav");
}
