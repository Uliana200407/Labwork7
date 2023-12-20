<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $timestamp = microtime(true);
    $datetime = new DateTime("@$timestamp");
    $formatted_time = $datetime->format('H:i:s.') . sprintf("%03d", round(($timestamp - floor($timestamp)) * 1000));

    $id = $_POST['id'];
    $timestamp = $_POST['timestamp'];
    $content = $_POST['content'];

    $data = [];
    $jsonFile = 'data.json';

    if (file_exists($jsonFile)) {
        $jsonData = file_get_contents($jsonFile);
        $data = json_decode($jsonData, true);
    }

    $newSection = [
        'id' => $id,
        'timestamp' => $timestamp,
        'server_timestamp' => $formatted_time,
        'content' => $content
    ];

    $data[] = $newSection;

    file_put_contents($jsonFile, json_encode($data));
    echo json_encode($newSection);
}
?>
