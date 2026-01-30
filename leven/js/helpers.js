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

// returns loading spinner to show "Loading..."
function jqLoadingSpinner() {
    return $('<div class="text-center"> <div class="spinner-border" role="status" style="width: 4rem; height: 4rem;"> <span class="sr-only">Loading...</span> </div> </div>');
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

// levenDist returns leven distance between two words
var levenDist = function()
{function W(r,t,e,o,n){return r<t||e<t?e<r?e+1:r+1:o===n?t:t+1}return function(r,t){if(r===t)return 0;if(r.length>t.length){var e=r;r=t,t=e}for(var o=r.length,n=t.length;0<o&&r.charCodeAt(o-1)===t.charCodeAt(n-1);)o--,n--;for(var h=0;h<o&&r.charCodeAt(h)===t.charCodeAt(h);)h++;if(n-=h,0===(o-=h)||n<3)return n;var a,c,f,d,u,A,C,i,g,l,v,s,p=0,D=[];for(a=0;a<o;a++)D.push(a+1),D.push(r.charCodeAt(h+a));for(var E=D.length-1;p<n-3;)for(g=t.charCodeAt(h+(c=p)),l=t.charCodeAt(h+(f=p+1)),v=t.charCodeAt(h+(d=p+2)),s=t.charCodeAt(h+(u=p+3)),A=p+=4,a=0;a<E;a+=2)A=W(d=W(f=W(c=W(C=D[a],c,f,g,i=D[a+1]),f,d,l,i),d,u,v,i),u,A,s,i),D[a]=A,u=d,d=f,f=c,c=C;for(;p<n;)for(g=t.charCodeAt(h+(c=p)),A=++p,a=0;a<E;a+=2)C=D[a],D[a]=A=W(C,c,A,g,D[a+1]),c=C;return A}}();

