<?php
// Method returns 100th (or bottom, if <100) score of the leaderboard
$bottom = 100;

if (!isset($_SERVER['HTTP_REFERER']) || empty($_SERVER['HTTP_REFERER']) || strpos($_SERVER['HTTP_REFERER'], "https://bestsiteever.ru/eyetest") != 0)
    die("hey there");

include_once($_SERVER['DOCUMENT_ROOT'] . "/psycles/auth/globals.php");
$conn = connect_to_db();

$sql = "select score from eyetest_leaderboard ORDER BY score DESC;";
$sql_result = $conn->query($sql);
if ($conn->errno != 0)
    die("<br>err: " . $conn->error . "<br>");

$result = 0;
$i = 0;
while ($row = $sql_result->fetch_assoc()) {
    if ($i > $bottom)
        break;
    $result = $row["score"];
    $i++;
}
$conn->close();
die ("bottom:$result");
?>
