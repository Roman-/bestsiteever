<?php
// Method adds to leaderboard. If leader is already there with score that's more, dont insert
// parameters(_POST):
// score - score to add
// name  - name of the player
// gamesplayed - how many games this player played by the moment of PB
// mode - game mode (future)
// hash - sophisticated hash of (name, score): md5('8' + md5(score))

if (!isset($_SERVER['HTTP_REFERER']) || empty($_SERVER['HTTP_REFERER']) || strpos($_SERVER['HTTP_REFERER'], "https://bestsiteever.ru/eyetest") != 0)
    die("hey there");

include_once($_SERVER['DOCUMENT_ROOT'] . "/psycles/auth/globals.php");
include_once("ipinfo.php");

if (!isset($_POST["score"]) || $_POST["score"] > 99 || $_POST["score"] <= 0)
    die("bad score");

if (!isset($_POST["name"]) || $_POST["name"]=='')
    die("name not set");

$conn = connect_to_db();

$playername = $_POST["name"];
$score = $_POST["score"];
$userip = getUserIP();
$info = ip_info($userip);
$country = $info["country_code"].' / '.$info["city"];

$serverhash = md5('8'.md5($score));
if ($serverhash !== $_POST["h"])
    die("very name (or hash): server is $serverhash, my hash is ".$_POST["h"]);

// first, see if there's a player with the same name
if (bestScoreOfPlayer($conn, $playername) >= $score)
    die("already have player with score > current");

$stmt = $conn->prepare("INSERT INTO eyetest_leaderboard (score, country, name, gamesplayed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score=?, country=?, gamesplayed=?");

if ($conn->error != "")
    die($conn->error);
$stmt->bind_param("issiisi", $score, $country, $playername, $_POST["gamesplayed"]
                           , $score, $country, $_POST["gamesplayed"]);
$stmt->execute();
$insertionresult = $stmt->error;
if ($insertionresult != "")
    die("Error occured when inserting: " . htmlspecialchars($insertionresult));
$stmt->close();

die('success\nadded');

function bestScoreOfPlayer($conn, $name) {
    $bestScore = 0;
    $query = "select score from eyetest_leaderboard WHERE name = ?;";
    if($stmt = $conn->prepare($query)) {
        $stmt->bind_param('s',$name);
        $stmt->execute();
        $result = $stmt->get_result();

       while ($row = $result->fetch_assoc()) {
            $bestScore = $row["score"];
       }

       $stmt->free_result();
       $stmt->close();
    }
    return $bestScore;
}
?>
