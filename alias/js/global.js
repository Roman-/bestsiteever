// Global variables
function Global() { }

Global.version = 38; // program version. If changed, force dictionaries update.

var LayoutsEnum = Object.freeze({"main":1, "pre":2, "game":3, "list":4, "help":5});

// word set from which words are being picked; should contain fixed number of words (like, 200) for optimization
Global.wordSetIndex = 0;
Global.wordSet = ["words not loaded"];

Global.uiLang = ["EN", "RU"]; // UI language: english or Russian
Global.uiLangIndex = 0; // UI language: 0 = english, 1 = Russian
Global.uicolors = 0; // UI colors: 0 = night, 1 = day
Global.gameInterval = null;
Global.gameStartMs = null; // when did we start the game?
Global.gameWordStartMs = null; // when did we start explaining current word?
Global.durationIndex = 3; // 0  1   2   3   4    5     // 60 sec per round
Global.durationOptions =    [1, 20, 30, 60, 90, 120]; // seconds per round
Global.timerDiv = null; // timer div element to display time

// game-related
Global.currentDict = null; // dict we're currently playing
Global.currentWordsList = []; // list of words guessed in this game [{w: "word", g: "1"}, ...]
Global.currentWord = ""; // word we're currently trying to guess
