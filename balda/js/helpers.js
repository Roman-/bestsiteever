// generates random integer number
// if one argument is given, generates number from 0 (inclusive) to argument1 upperBound (non-inclusive)
// if two numbers are given, generates random integer number from arg1 (inclusive) to arg2 (non-inclusive)
function randomNumber(n1, n2 = NaN) {
    if (isNaN(n2))
        return Math.floor(Math.random()*n1);
    else
        return n1 + Math.floor(Math.random()*(n2-n1));
}

// returns random element from array arr
function randomElement(arr) {
    return arr[ randomNumber(arr.length) ];
}

// shuffles array in place. \param a an array containing the items.
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// shows modal bootstrap dialog
// \param content: either string or jquery object
// fullscreen: display fullscreen modal
// TODO build by components instead of HTML string
function showBsModal(content, title = 'Info', fullscreen = false, id='newBsModal') {
    let addClass = fullscreen ?  'modal-full' : '';
    let div = $('<div class="modal" tabindex="-1" role="dialog" id="'+id+'"> <div class="modal-dialog '+addClass+'" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title">'+title+'</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" id="currentModalBody"></div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button> </div> </div> </div> </div>');
    div.modal('show').on('hidden.bs.modal', function () {
        $(this).remove(); // remove this dialog from html document
    });
    $("#currentModalBody").append( (typeof content === 'string') ? $("<p>" + content + "</p>") : content );
    return div;
};


/// \param onSuccess - function with one argument - response
/// \param onError - function with one argument - error string
function sendPost(url, params, onSuccess, onError = null) {
    if (!onError)
        onError = function (res) {console.error(res);}
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.timeout = 5000; // time in milliseconds
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                onSuccess(xhr.responseText);
            } else {
              onError("XMLHttpRequest status "+xhr.status+": " + xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        onError(xhr.statusText);
    };
    xhr.ontimeout = function (e) {
      onError("Connection timeout (" + (xhr.timeout / 1000) + " seconds)");
    };
    xhr.send(params);
}

// for downloading file locally
// returns jquery <a> object that allows to download plain text file
function makeTextDownloadA(data, filename = 'file.txt', MIME_TYPE = 'text/plain') {
    window.URL = window.webkitURL || window.URL;
    var bb = new Blob([data], {type: MIME_TYPE});
    var a = $("<a>Download</a>")
      .attr('download', 'file.txt')
      .attr('href', window.URL.createObjectURL(bb));
    $("#mainLayWrap").append(a);
}

// returns loading spinner to show "Loading..."
function jqLoadingSpinner() {
    return $('<div class="text-center"> <div class="spinner-border" role="status" style="width: 4em; height: 4em;"> <span class="sr-only">Loading...</span> </div> </div>');
}


function exit( status ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}

// returns true if a string is one latin letter
function isLetter(str) {
  return str.length === 1 && (str.match(/[a-z]/i) || str.match(/[а-я]/i));
}

// returns true if index pair is in board bounds
function isInBounds(indexPair, boardSize) {
    return (indexPair[0] >= 0 && indexPair[0] < boardSize &&
            indexPair[1] >= 0 && indexPair[1] < boardSize);
}

// returns string describing board
function boardToString(board) {
    let s = "";
    board.forEach(function (row) {
        row.forEach(function (col) {
            s += col;
        });
        s += "\n";
    });
    return s;
}

// returns true if there are no empty cells on the board
function allCellsOccupied(board) {
    let result = true;
    board.forEach(function (row) {
        row.forEach(function (col) {
            if (col.trim() == "") {
                result = false; // at least this one is empty
            }
        });
    });
    return result;
}

// converts path (array of {i,j,l}) to string
function pathToString(path) {
    let s = "";
    path.forEach(function (wp) {
        s += "[" + wp['i'] + "," + wp['j'] + "] ";
    });
    return s;
}

// converts game move object to string
function moveObjToString(move) {
    return "'" + move['letter'] + "' => [" + move['i'] + ", " + move['j'] + "] => " + move['word'] + ". Path = " + pathToString(move["path"]);
}

// returns player score (total number of letters)
function countScore(wordList) {
    let sum = 0;
    wordList.forEach(function (w) {
        sum += w.length;
    });
    return sum;
}

// converts array of moves to list of words
function movesToWordList(moves) {
    let res = [];
    moves.forEach(function (m) {
        let w = m['word'];
        if (res.indexOf(w) == -1)
            res.push(w);
    });
    return res;
}

// returns font-awesome jquery icon (i tag)
function faIcon(name) {
    return $("<i class='fa fa-"+name+"'></i>");
}

// uppercase accented -> uppercase non-accented
Glob.accentMap = {
    "Ё": "Е",
    "ё": "е",
};

String.prototype.replaceAccents = function() {
    return this.replace(/[^A-Za-z0-9\[\] ]/g, function(a){return Glob.accentMap[a]||a})
};

// converts string board dims to [width, height]
function boardDimsToWh(dimsString) {
    const defWh = [5, 5];
    if (!dimsString || (typeof dimsString != 'string'))
        return defWh;
    let dims = dimsString.split('x');
    if (dims.length != 2 || isNaN(dims[0]) || isNaN(dims[1]))
        return defWh;
    return [dims[0], dims[1]];
}

// returns word (string) from move object, highlighting letter where board is empty
function hlLetterWhereCellEmpty(moveObj, board) {
    let s = "";

    for (let l = 0; l < moveObj.word.length; l++) {
        let letter = moveObj.word.charAt(l);
        let coords = moveObj['path'][l];
        let isEmpty = board[coords.i][coords.j].trim().replace("&nbsp;", "") == "";
        s += (isEmpty) ? ("<b>" + letter + "</b>") : letter;
    }
    return s;
}

function winningString(words1, words2) {
}
