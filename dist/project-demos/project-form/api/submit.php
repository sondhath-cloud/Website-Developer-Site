<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Server-side storage only (OneDrive integration disabled for now)

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

// Add timestamp
$data['timestamp'] = date('Y-m-d H:i:s');

// Read existing submissions
$submissionsFile = '../data/submissions.json';
$submissions = [];

if (file_exists($submissionsFile)) {
    $jsonData = file_get_contents($submissionsFile);
    $submissions = json_decode($jsonData, true) ?: [];
}

// Add new submission
$submissions[] = $data;

// Ensure data directory exists
$dataDir = dirname($submissionsFile);
if (!is_dir($dataDir)) {
    if (!mkdir($dataDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error creating data directory']);
        exit();
    }
    // Set permissions after creation
    chmod($dataDir, 0777);
}

// Save to local file
$result = file_put_contents($submissionsFile, json_encode($submissions, JSON_PRETTY_PRINT));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error saving submission']);
    exit();
}

// Save individual submission file for backup
$individual_filename = '../data/submission-' . date('Y-m-d-H-i-s') . '.json';
file_put_contents($individual_filename, json_encode($data, JSON_PRETTY_PRINT));

// Prepare response
$response = [
    'success' => true,
    'message' => 'Form submitted successfully! Data saved to server.',
    'submissionId' => count($submissions),
    'localSave' => true,
    'individualFile' => $individual_filename
];

echo json_encode($response);
?>
