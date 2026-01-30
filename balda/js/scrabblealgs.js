// returns array of moves sorted best-to-worst
// move is object {i: int, j: int, move: string(letter), word: string(resultingWord)}
// \param board 2d array with letters
function findAllMoves(board, tree, wordsUsed) {
    let allMoves = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            searchMove(board, i, j, tree, wordsUsed).forEach(function (moveObj) {
                allMoves.push(moveObj);
            });
        }
    }
    return allMoves.sort(function (m1, m2) {return m2['word'].length - m1['word'].length});
}

// returns array of words sorted best-to-worst
// \param board 2d array with letters
function findAllWords(board, tree, wordsUsed) {
    let allWords = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            listWords(board, i, j, tree).forEach(function (moveObj) {
                allWords.push(moveObj);
            });
        }
    }

    return allWords.sort(function (m1, m2) {return m2['word'].length - m1['word'].length});
}

// returns true if placing letter in [i, j] on the board is legal
// return object {"legal": true/false, "reason": string, "path" - path object} - reason if move is not.
function isMoveLegal(board, tree, i, j, letter, word, dict, wordsUsed) {
    if (!isInBounds([i,j], board.length)) {
        return {
            'legal' : false,
            'reason' : 'index ['+i+', '+j+'] out of bounds (board size = '+board.length+')',
            'path': []
        };
    }
    if (board[i][j] !== ' ') {
        return {
            'legal' : false,
            'reason' : 'cell ['+i+', '+j+'] is occupied by <'+board[i][j]+'>',
            'path': []
        };
    }

    if (wordsUsed.indexOf(word) != -1) {
        return {
            'legal' : false,
            'reason' : 'word "'+word+'" was already used!',
            'path': []
        };
    }

    // check against dict
    if (dict.indexOf(word) == -1) {
        return {
            'legal' : false,
            'reason' : '"'+word+'" is not a noun',
            'path': []
        };
    }

    let allMoves = findAllMoves(board, tree, wordsUsed);
    if (allMoves.length == "") {
        return {
            'legal' : false,
            'reason' : 'there are no moves left!',
            'path': []
        };
    }

    let movesWithThisWord = [];
    let result = false;
    allMoves.forEach(function (m) {
        if (m['i'] == i && m['j'] == j && m['word'] == word && m['letter'] == letter) {
            result = {
                'legal' : true,
                'reason' : ('best move was' + moveObjToString(allMoves[0])),
                'path': m['path']
            }
        }
        if (m['word'] == word)
            movesWithThisWord.push(m);
    });
    if (result)
        return result;

    let reason = "Can\'t form a word";
    if (false && movesWithThisWord.length > 0) {
        reason += ". Possible moves with word \""+word+"\": ";
        movesWithThisWord.forEach(function (m) {
            reason += moveObjToString(m);
        })
    }
    return {
        'legal' : false,
        'reason' : reason,
        'path': []
    };
}

// path = [ {i: int, j: int, l: string(letter)} ]
function makeWordFromPath(path) {
    let word = "";
    path.forEach(function (wp) {
        word += wp['l']
    });
    return word;
}

// \param path - array of indeces [[0,0,'a'], [0,1,'b'], ...] that we've been through so far
// \returns array of elements: {"word": word; "path": [...]}
function listWords(board, i, j, node, path = [], indeces = [[i, j]]) {
    // if node is a final letter of the word, add the word to the result list
    let result = (node["*"]) ? [{"path": path, "word": makeWordFromPath(path)}] : [];

    // right, left, up and down
    indeces = indeces || [[i+1, j],[i-1, j],[i, j-1],[i, j+1]].filter(function (pair) {return isInBounds(pair, board.length);});

    indeces.forEach(function (indexPair) {
        let newI = indexPair[0], newJ = indexPair[1];
        let letter = board[newI][newJ];
        if (isLetter(letter) && node[letter]) {
            // temporary mark cell as used
            let newPath = path.concat([{'i': newI, 'j': newJ, 'l': letter}]);
            board[newI][newJ] = "*";
            result = result.concat(listWords(board, newI, newJ, node[letter], newPath, null));
            board[newI][newJ] = letter;
        }
    });
    return result;
}

// \param path - array of indeces [[0,0,'a'], [0,1,'b'], ...] that we've been through so far
// \param disallowedWords - list of words that has been used already
function searchMove(board, i, j, node, wordsUsed = [], path = [], indeces = [[i, j]]) {
    // if node is a final letter of the word, add the word to the result list
    let result = [];

    // right, left, up and down
    indeces = indeces || [[i+1, j],[i-1, j],[i, j-1],[i, j+1]].filter(function (pair) {return isInBounds(pair, board.length);});

    indeces.forEach(function (indexPair) {
        let newI = indexPair[0], newJ = indexPair[1];
        let letter = board[newI][newJ];
        if (isLetter(letter) && node[letter]) {
            // temporary mark cell as used
            let newPath = path.concat([{'i': newI, 'j': newJ, 'l': letter}]);
            board[newI][newJ] = "*";
            // here try to searchMove from there
            result = result.concat(searchMove(board, newI, newJ, node[letter], wordsUsed, newPath, null));
            board[newI][newJ] = letter;
        } else if (" " === letter) {
            // put all possible letter there to compare result
            board[newI][newJ] = "*";
            for (var myMove in node) {
                if (myMove == "*")
                    continue;
                let newPath = path.concat([{'i': newI, 'j': newJ, 'l': myMove}]);
                let resultWords = listWords(board, newI, newJ, node[myMove], newPath, null);
                resultWords.forEach(function (wp) {
                    if (wordsUsed.indexOf(wp["word"]) == -1) {
                        result.push({
                            "i": newI,
                            "j": newJ,
                            "letter": myMove,
                            "word": wp["word"],
                            "path": wp["path"],
                        });
                    }
                });
            }
            board[newI][newJ] = " ";
        }
    });
    return result;
}
