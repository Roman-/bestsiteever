<?php
// Method returns html table of leaderboard
// if (!isset($_SERVER['HTTP_REFERER']) || empty($_SERVER['HTTP_REFERER']) || strpos($_SERVER['HTTP_REFERER'], "https://bestsiteever.ru/eyetest") != 0)
    // die("hey there");

include_once($_SERVER['DOCUMENT_ROOT'] . "/psycles/auth/globals.php");

$conn = connect_to_db();

    $bestScore = 0;
    $query = "SELECT * FROM eyetest_leaderboard ORDER BY score DESC;";
    if ($stmt = $conn->prepare($query)) {
        $stmt->execute();
        $result = $stmt->get_result();

       echo "<table id='leaderboard'>";
       echo "<thead><tr><th>#</th><th>Name</th><th>Score</th><th>Date</th></tr></thead>";

        $i = 0;
       while ($row = $result->fetch_assoc()) {
           if ($i++ > 99)
               break;
           $name = htmlspecialchars($row["name"]);
           $datetime = displayDateTimeNicely($row["datetime"]);

           echo "<tr><td>$i</td><td class='playername'>$name</td><td class='scoretd'>$row[score]</td><td>$datetime</td></tr>";
       }

       echo "</table>";

       $stmt->free_result();
       $stmt->close();
    } else {
        die("failed to prepare query");
    }

    function getCountryCode($s) {
        return $s;
        $pos = strpos($s, " / ");
        return ($pos === FALSE ? ":)" : substr($s, 0, $pos));
    }

    function displayDateTimeNicely($datetime) {
        $d = strtotime($datetime);
        return date("d M", $d);
    }
    $conn->close();
    die();
?>
