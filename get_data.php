<?php
$jsonFile = 'data.json';
if (file_exists($jsonFile)) {
    $jsonData = file_get_contents($jsonFile);
    echo $jsonData;
}
?>
