/* file htmlelements.js
 *
 * Constructors for common jquery/HTML elements, selects, inputs
 */

function jqLangSelect(selectedLang) {
    let langSelect = $("<select class='form-control my-1'></select>").append(
            $("<option></option>").val('en').html('English'),
            $("<option></option>").val('ru').html('Russian'));
    langSelect.val(selectedLang);
    return langSelect;
}

function jqAiSelect(difficulty = 2) {
    let aiSelect = $("<select class='form-control my-1'></select>");

    for (let i = 0; i < AiLevels.ais.length; i++) {
        aiSelect.append($("<option></option>").val(i).html(AiLevels.ais[i].name));
    }
    aiSelect.val(difficulty);

    return aiSelect;
}

function jqBoardSizeSelect(defSize = '5x5') {
    let allDims = [
        [3,3],
        [4,4],
        [5,5],
        [6,6],
        [7,7],
        //[5,3],
        //[3,4],
    ];

    let boardSizeSelect = $("<select class='form-control my-1'></select>");
    allDims.forEach(function (dim) {
        let dimString = dim[0] + 'x' + dim[1];
        boardSizeSelect.append($("<option></option>").val(dimString).html(dimString));
    });

    boardSizeSelect.val(defSize);

    return boardSizeSelect;
}
