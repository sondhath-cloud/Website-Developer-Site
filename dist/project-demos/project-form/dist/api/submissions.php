<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$submissionsFile = '../data/submissions.json';

// GET request - return all submissions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($submissionsFile)) {
        $jsonData = file_get_contents($submissionsFile);
        $submissions = json_decode($jsonData, true) ?: [];
        echo json_encode($submissions);
    } else {
        echo json_encode([]);
    }
    exit();
}

// DELETE request - delete specific submission or all submissions
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!file_exists($submissionsFile)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'No submissions found']);
        exit();
    }
    
    $jsonData = file_get_contents($submissionsFile);
    $submissions = json_decode($jsonData, true) ?: [];
    
    // Check if deleting specific submission
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    if (preg_match('/\/(\d+)$/', $pathInfo, $matches)) {
        $index = (int)$matches[1];
        
        if ($index >= 0 && $index < count($submissions)) {
            array_splice($submissions, $index, 1);
            file_put_contents($submissionsFile, json_encode($submissions, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'message' => 'Submission deleted successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Submission not found']);
        }
    } else {
        // Delete all submissions
        file_put_contents($submissionsFile, json_encode([]));
        echo json_encode(['success' => true, 'message' => 'All submissions cleared successfully']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
?>
