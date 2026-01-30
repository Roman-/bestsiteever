function Global() { }

Global.gameTimeout = 35,        // seconds
Global.maxGridSize = 7,         // 7x7
Global.gridColorFactor = 0.75,  // next diffSum = gridColorFactor * prevdiffSum
Global.startGridSize = 3,       // 3x3 grid
Global.startGridDiff = 165,     // sum of RGB diffs
Global.gridMinColorDiff = 13,   // sum of RGB diffs
Global.misclicksB4Hint = 3,     // 4 misclicks
Global.secondsB4Hint = 4.5,       // seconds before hint is displayed
Global.margin = 1,              // px between tiles
Global.canvas = null;
Global.ctx = null;
Global.gridBgCol = "#161616";
Global.canvasSize = 0;          // width and height of quadratic canvas
Global.clickable = false;       // if unclickable, clicking on the grid doesn't lead to any result
Global.twinkleTimer = null,     // timer used to twinkle hint
Global.twinkling = false;       // if we're twinkling now
Global.gh = "";                 // hash of score

Global.playerHiScore = -1;      // highest score
Global.playerName = "";   //
Global.gamesPlayed = 0;         // amount of games finished
Global.bottomScore = null;      // best score of 100th player. If got better score, can brag
Global.lbHtml = null;           // leaderboard html

var timer = null; // timer element
