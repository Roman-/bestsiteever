/// \value stringified json object or standard type
/// \returns true if succeed
function saveLocal(name, value) {
    // If the platform supports localStorage, then save the value
    try {
        localStorage.setItem(name, value);
        return true;
    }
    catch(e) {
        // Most likely cause of errors is a very old browser that doesn't support localStorage (fail silently)
        console.warn("saving error");
        return false;
    }
}

/// \returns loaded value or specified defaultValue in case of error
function loadLocal(name, defaultValue) {
    // If the platform supports localStorage, then load the selection
    try {
        return localStorage.getItem(name);
    }
    catch(e) {
        // Either no selection in localStorage or browser does not support localStorage (fail silently)
        console.warn("can\'t load from localstorage");
        return defaultValue;
    }
}

function loadPlayerData() {
    Global.playerHiScore = loadLocal("playerHiScore", -1);
    Global.playerName = loadLocal("playerName", "");
    Global.gamesPlayed = loadLocal("gamesPlayed", 0);

    $("#playerName").val(Global.playerName);
}

function savePlayerData() {
    saveLocal("playerHiScore", Global.playerHiScore);
    saveLocal("playerName", Global.playerName);
    saveLocal("gamesPlayed", Global.gamesPlayed);
}

function eraseUserData() {
    saveLocal("playerHiScore", -1);
}

function loadBottomScore() {
    sendPost("getbottom.php", "",
        function(response) {
            var checkString = "bottom:";
            if (response.indexOf(checkString) == 0) {
                Global.bottomScore = parseInt(response.substr(checkString.length));
            } else {
                // console.error("error while getting bottom: " + response);
            }
        },
        function(msg){
            // console.error("error while getting bottom: " + msg);
        });
}

function loadLeaderboard() {
    sendPost("getleaderboard.php", "",
        function(response) {
            var checkString = "<table id='leaderboard'";
            if (response.indexOf(checkString) == 0) {
                $("#lbTableWrap").html(response);
                $("#leaderBoardDownwards").html("<h1>Leaderboard:</h1>" + response);
            } else {
                $("#lbTableWrap").html("Can\'t load leaderboard :(");
                // console.error("error while loading LB (load is success but didnt started with <table>: " + response);
                $("#leaderBoardDownwards").html("");
            }
        },
        function(msg){
            $("#lbTableWrap").html("Can\'t load leaderboard :(");
            $("#leaderBoardDownwards").html("");
            // console.error("Can\'t load leaderboard: " + msg);
        });
}

function f6(a,e){var r=a[0],o=a[1],n=a[2],t=a[3];r=ff(r,o,n,t,e[0],7,-680876936),t=ff(t,r,o,n,e[1],12,-389564586),n=ff(n,t,r,o,e[2],17,606105819),o=ff(o,n,t,r,e[3],22,-1044525330),r=ff(r,o,n,t,e[4],7,-176418897),t=ff(t,r,o,n,e[5],12,1200080426),n=ff(n,t,r,o,e[6],17,-1473231341),o=ff(o,n,t,r,e[7],22,-45705983),r=ff(r,o,n,t,e[8],7,1770035416),t=ff(t,r,o,n,e[9],12,-1958414417),n=ff(n,t,r,o,e[10],17,-42063),o=ff(o,n,t,r,e[11],22,-1990404162),r=ff(r,o,n,t,e[12],7,1804603682),t=ff(t,r,o,n,e[13],12,-40341101),n=ff(n,t,r,o,e[14],17,-1502002290),r=gg(r,o=ff(o,n,t,r,e[15],22,1236535329),n,t,e[1],5,-165796510),t=gg(t,r,o,n,e[6],9,-1069501632),n=gg(n,t,r,o,e[11],14,643717713),o=gg(o,n,t,r,e[0],20,-373897302),r=gg(r,o,n,t,e[5],5,-701558691),t=gg(t,r,o,n,e[10],9,38016083),n=gg(n,t,r,o,e[15],14,-660478335),o=gg(o,n,t,r,e[4],20,-405537848),r=gg(r,o,n,t,e[9],5,568446438),t=gg(t,r,o,n,e[14],9,-1019803690),n=gg(n,t,r,o,e[3],14,-187363961),o=gg(o,n,t,r,e[8],20,1163531501),r=gg(r,o,n,t,e[13],5,-1444681467),t=gg(t,r,o,n,e[2],9,-51403784),n=gg(n,t,r,o,e[7],14,1735328473),r=hh(r,o=gg(o,n,t,r,e[12],20,-1926607734),n,t,e[5],4,-378558),t=hh(t,r,o,n,e[8],11,-2022574463),n=hh(n,t,r,o,e[11],16,1839030562),o=hh(o,n,t,r,e[14],23,-35309556),r=hh(r,o,n,t,e[1],4,-1530992060),t=hh(t,r,o,n,e[4],11,1272893353),n=hh(n,t,r,o,e[7],16,-155497632),o=hh(o,n,t,r,e[10],23,-1094730640),r=hh(r,o,n,t,e[13],4,681279174),t=hh(t,r,o,n,e[0],11,-358537222),n=hh(n,t,r,o,e[3],16,-722521979),o=hh(o,n,t,r,e[6],23,76029189),r=hh(r,o,n,t,e[9],4,-640364487),t=hh(t,r,o,n,e[12],11,-421815835),n=hh(n,t,r,o,e[15],16,530742520),r=ii(r,o=hh(o,n,t,r,e[2],23,-995338651),n,t,e[0],6,-198630844),t=ii(t,r,o,n,e[7],10,1126891415),n=ii(n,t,r,o,e[14],15,-1416354905),o=ii(o,n,t,r,e[5],21,-57434055),r=ii(r,o,n,t,e[12],6,1700485571),t=ii(t,r,o,n,e[3],10,-1894986606),n=ii(n,t,r,o,e[10],15,-1051523),o=ii(o,n,t,r,e[1],21,-2054922799),r=ii(r,o,n,t,e[8],6,1873313359),t=ii(t,r,o,n,e[15],10,-30611744),n=ii(n,t,r,o,e[6],15,-1560198380),o=ii(o,n,t,r,e[13],21,1309151649),r=ii(r,o,n,t,e[4],6,-145523070),t=ii(t,r,o,n,e[11],10,-1120210379),n=ii(n,t,r,o,e[2],15,718787259),o=ii(o,n,t,r,e[9],21,-343485551),a[0]=f2(r,a[0]),a[1]=f2(o,a[1]),a[2]=f2(n,a[2]),a[3]=f2(t,a[3])}function cmn(a,e,r,o,n,t){return e=f2(f2(e,a),f2(o,t)),f2(e<<n|e>>>32-n,r)}function ff(a,e,r,o,n,t,f){return cmn(e&r|~e&o,a,e,n,t,f)}function gg(a,e,r,o,n,t,f){return cmn(e&o|r&~o,a,e,n,t,f)}function hh(a,e,r,o,n,t,f){return cmn(e^r^o,a,e,n,t,f)}function ii(a,e,r,o,n,t,f){return cmn(r^(e|~o),a,e,n,t,f)}function f4(a){txt="";var e,r=a.length,o=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=a.length;e+=64)f6(o,f5(a.substring(e-64,e)));a=a.substring(e-64);var n=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<a.length;e++)n[e>>2]|=a.charCodeAt(e)<<(e%4<<3);if(n[e>>2]|=128<<(e%4<<3),e>55)for(f6(o,n),e=0;e<16;e++)n[e]=0;return n[14]=8*r,f6(o,n),o}function f5(a){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=a.charCodeAt(e)+(a.charCodeAt(e+1)<<8)+(a.charCodeAt(e+2)<<16)+(a.charCodeAt(e+3)<<24);return r}var hex_chr="0123456789abcdef".split("");function rhex(a){for(var e="",r=0;r<4;r++)e+=hex_chr[a>>8*r+4&15]+hex_chr[a>>8*r&15];return e}if(0!=f1("hello").indexOf("5d4140"))function f2(a,e){var r=(65535&a)+(65535&e);return(a>>16)+(e>>16)+(r>>16)<<16|65535&r}function mh835(){return f1("8"+f1(""+gridScore))}function f3(a){for(var e=0;e<a.length;e++)a[e]=rhex(a[e]);return a.join("")}function f1(a){return f3(f4(a))}function f2(a,e){return a+e&4294967295}
