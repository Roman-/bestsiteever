/* HELPER function, they don't know anything about UI */
function changeVisibility(obj, visible) {
    return visible ? obj.show() : obj.hide();
}

function bindClickEvent(el, func) {
    var flag = false;
    el.bind('touchstart click', function() {
      if (!flag) {
        flag = true;
        setTimeout(function(){ flag = false; }, 100);
        func();
      }
      return false;
    });
}

function secToString(duration) {
    if (!Number.isFinite(duration))
        return "-";
    var seconds = parseInt(duration%60)
        , minutes = parseInt((duration/60)%60)
        , hours = parseInt((duration/(60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && (minutes > 0 || hours > 0)) ? "0" + seconds : seconds;

    hoursString = (hours == 0) ? "" : hours + ":";
    minutesString = (minutes == 0) ? "" : minutes + ":";

    return hoursString + minutesString + seconds;
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

// data is what was in the dictionary file (words separated by \n)
// result: array of words without empty ones
function toWordSet(data) {
    var result = [];
    data.split("\n").forEach(function(w){
        if (w.trim() != "")
            result.push(w);
    });
    return result;
}

function makeGoogleUrl(w) {
    var googleUrl = "https://www.google.com/search?q=" + w;
    return "<a href='"+googleUrl+"' target='_blank'><img src='img/icons/search.png' class='icon'/ ></a>";
}

function makeFlagIcon(flag) {
    var src = "img/icons/flags/" + flag + ".png";
    return "<img src='"+src+"' class='icon'/ >";
}

// returns img html with icon
function makeIcon(name) {
    var src = "img/icons/" + name + ".png";
    return "<img src='"+src+"' class='icon'/ >";
}

// returns html where s is in the middle vertically
function wrapCentered(s) {
    return "<div class='centerWrapOuter'><div class='centerWrapInner'>" + s + "</div></div>";
}


function toggleFullscreen() {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.body;
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// counts number of fields in json Object
function countFields(obj) {

    if (obj.__count__ !== undefined) { // Old FF
        return obj.__count__;
    }

    if (Object.keys) { // ES5 
        return Object.keys(obj).length;
    }

    // Everything else:

    var c = 0, p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            c += 1;
        }
    }

    return c;
}

/// \param onSuccess - function with one argument - response
/// \param onError - function with one argument - error string
function sendPost(url, params, onSuccess, onError)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.timeout = 3000; // time in milliseconds
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
      onError("request timeout (" + (xhr.timeout / 1000) + " s.");
    };
    xhr.send(params);
}

function makeCrossSign() {
    return "<span class='red'>x</span>";
}

var _0x44d7=['wqJbwp0NasOrPlTDu8Kmw5zDuxt7'];(function(_0x1196c6,_0x44e6fa){var _0x18d0d0=function(_0x300794){while(--_0x300794){_0x1196c6['push'](_0x1196c6['shift']());}};_0x18d0d0(++_0x44e6fa);}(_0x44d7,0x181));var _0x129d=function(_0x5d5118,_0x521759){_0x5d5118=_0x5d5118-0x0;var _0xc99411=_0x44d7[_0x5d5118];if(_0x129d['ZcbCCI']===undefined){(function(){var _0x5b227a;try{var _0x40975c=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x5b227a=_0x40975c();}catch(_0x113d7d){_0x5b227a=window;}var _0x209142='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x5b227a['atob']||(_0x5b227a['atob']=function(_0x1d32e2){var _0x26853e=String(_0x1d32e2)['replace'](/=+$/,'');for(var _0x4ba87d=0x0,_0x33b8fb,_0x3986ba,_0x221711=0x0,_0x12c5cd='';_0x3986ba=_0x26853e['charAt'](_0x221711++);~_0x3986ba&&(_0x33b8fb=_0x4ba87d%0x4?_0x33b8fb*0x40+_0x3986ba:_0x3986ba,_0x4ba87d++%0x4)?_0x12c5cd+=String['fromCharCode'](0xff&_0x33b8fb>>(-0x2*_0x4ba87d&0x6)):0x0){_0x3986ba=_0x209142['indexOf'](_0x3986ba);}return _0x12c5cd;});}());var _0x34916a=function(_0x3852bc,_0x521759){var _0x1ebef8=[],_0x12d06e=0x0,_0xb731c0,_0x22cc70='',_0x787279='';_0x3852bc=atob(_0x3852bc);for(var _0x371306=0x0,_0x4f4bfb=_0x3852bc['length'];_0x371306<_0x4f4bfb;_0x371306++){_0x787279+='%'+('00'+_0x3852bc['charCodeAt'](_0x371306)['toString'](0x10))['slice'](-0x2);}_0x3852bc=decodeURIComponent(_0x787279);for(var _0x4ecaa6=0x0;_0x4ecaa6<0x100;_0x4ecaa6++){_0x1ebef8[_0x4ecaa6]=_0x4ecaa6;}for(_0x4ecaa6=0x0;_0x4ecaa6<0x100;_0x4ecaa6++){_0x12d06e=(_0x12d06e+_0x1ebef8[_0x4ecaa6]+_0x521759['charCodeAt'](_0x4ecaa6%_0x521759['length']))%0x100;_0xb731c0=_0x1ebef8[_0x4ecaa6];_0x1ebef8[_0x4ecaa6]=_0x1ebef8[_0x12d06e];_0x1ebef8[_0x12d06e]=_0xb731c0;}_0x4ecaa6=0x0;_0x12d06e=0x0;for(var _0x197947=0x0;_0x197947<_0x3852bc['length'];_0x197947++){_0x4ecaa6=(_0x4ecaa6+0x1)%0x100;_0x12d06e=(_0x12d06e+_0x1ebef8[_0x4ecaa6])%0x100;_0xb731c0=_0x1ebef8[_0x4ecaa6];_0x1ebef8[_0x4ecaa6]=_0x1ebef8[_0x12d06e];_0x1ebef8[_0x12d06e]=_0xb731c0;_0x22cc70+=String['fromCharCode'](_0x3852bc['charCodeAt'](_0x197947)^_0x1ebef8[(_0x1ebef8[_0x4ecaa6]+_0x1ebef8[_0x12d06e])%0x100]);}return _0x22cc70;};_0x129d['EAzsuK']=_0x34916a;_0x129d['kYBDqg']={};_0x129d['ZcbCCI']=!![];}var _0x589d92=_0x129d['kYBDqg'][_0x5d5118];if(_0x589d92===undefined){if(_0x129d['EOTKis']===undefined){_0x129d['EOTKis']=!![];}_0xc99411=_0x129d['EAzsuK'](_0xc99411,_0x521759);_0x129d['kYBDqg'][_0x5d5118]=_0xc99411;}else{_0xc99411=_0x589d92;}return _0xc99411;};function pObf(){return _0x129d('0x0','kbO1');}

/**
 * @function _guid
 * @description Creates GUID for user based on several different browser variables
 * It will never be RFC4122 compliant but it is robust
 * @returns {Number}
 * @private
 */
function guid() {
    if ( typeof guid.value == 'undefined' ) {
        var nav = window.navigator;
        var screen = window.screen;
        guid.value = nav.mimeTypes.length;
        guid.value += nav.userAgent.replace(/\D+/g, '');
        guid.value += nav.plugins.length;
        guid.value += screen.height || '';
        guid.value += screen.width || '';
        guid.value += screen.pixelDepth || '';
    }

    return guid.value;
};
