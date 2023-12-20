<?php
$jsonFile = 'data.json';
if (file_exists($jsonFile)) {
    unlink($jsonFile);
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Already empty!']);
}
?>
