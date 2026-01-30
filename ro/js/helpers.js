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
    let div = $('<div class="modal" tabindex="-1" role="dialog" id="'+id+'"> <div class="modal-dialog '+addClass+'" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title">'+title+'</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body" id="currentModalBody"></div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div> </div> </div> </div>');
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

function msToHumanReadable(duration) {
    if (!Number.isFinite(duration))
        return "-";
    var milliseconds = parseInt((duration%1000)/10)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && (minutes > 0 || hours > 0)) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

    hoursString = (hours == 0) ? "" : hours + ":";
    minutesString = (minutes == 0) ? "" : minutes + ":";

    return hoursString + minutesString + seconds + "." + milliseconds;
}

// returns $("<tr>") object with tds
function jqTr(tdHtmls) {
    let tr = $("<tr></tr>");
    tdHtmls.forEach(function (tdhtml) {
        tr.append($("<td></td>").html(tdhtml));
    });
    return tr;
}

// returns true if from mobile device
function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
