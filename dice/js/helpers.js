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
    let div = $('<div class="modal" tabindex="-1" role="dialog" id="'+id+'"> <div class="modal-dialog '+addClass+'" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title">'+title+'</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" id="currentModalBody"></div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button> </div> </div> </div> </div>');
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

// returns loading spinner to show "Loading..."
function jqLoadingSpinner() {
    return $('<div class="text-center text-secondary"> <div class="spinner-border" role="status" style="width: 1em; height: 1em;"> <span class="sr-only">Loading...</span> </div> </div>');
}

