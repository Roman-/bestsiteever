// returns tree of letters (associative array)
function makeLetterTree(arr) {
    let root = {};
    arr.forEach(function (word) {
        addWordToTree(word, root);
    });

    return root;

    function addWordToTree(word, root) {
        let node = root;
        for (var i = 0; i < word.length; i++) {
            let isLast = (i == word.length -1);
            let c = word.charAt(i);
            if (node[c]) {
                // has letter
            } else {
                node[c] = {};
            }
            node = node[c];
        }
        // marking as final
        node["*"] = true;
    }
}
