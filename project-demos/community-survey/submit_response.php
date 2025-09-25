<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

try {
    // Create data directory if it doesn't exist
    $dataDir = __DIR__ . '/survey_data';
    if (!file_exists($dataDir)) {
        if (!mkdir($dataDir, 0755, true)) {
            throw new Exception('Failed to create data directory');
        }
    }

    // Create timestamp and response ID
    $responseId = uniqid('resp_', true);
    $timestamp = date('Y-m-d H:i:s');
    
    // Save the complete response data as JSON
    $responseData = [
        'response_id' => $responseId,
        'timestamp' => $timestamp,
        'data' => $data
    ];
    
    // Save individual response
    $responseFile = $dataDir . '/response_' . $responseId . '.json';
    file_put_contents($responseFile, json_encode($responseData, JSON_PRETTY_PRINT), LOCK_EX);
    
    // Also append to a simple CSV file for easy viewing
    saveSimpleCSV($dataDir, $responseData);
    
    echo json_encode(['success' => true, 'message' => 'Response saved successfully']);

} catch (Exception $e) {
    error_log("Error in submit_response.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

function saveSimpleCSV($dataDir, $responseData) {
    $csvFile = $dataDir . '/all_responses.csv';
    
    // Create header if file doesn't exist
    if (!file_exists($csvFile)) {
        $header = "Response ID,Timestamp,Selected Priorities,Custom Priorities,Total Comparisons,Completed Comparisons\n";
        file_put_contents($csvFile, $header, LOCK_EX);
    }
    
    // Prepare data for CSV
    $selectedPriorities = isset($responseData['data']['selectedPriorities']) ? 
        count($responseData['data']['selectedPriorities']) : 0;
    $customPriorities = isset($responseData['data']['customPriorities']) ? 
        count($responseData['data']['customPriorities']) : 0;
    $totalComparisons = $responseData['data']['totalComparisons'] ?? 0;
    $completedComparisons = $responseData['data']['completedComparisons'] ?? 0;
    
    // Escape any commas in the data
    $csvLine = sprintf(
        "%s,%s,%d,%d,%d,%d\n",
        $responseData['response_id'],
        $responseData['timestamp'],
        $selectedPriorities,
        $customPriorities,
        $totalComparisons,
        $completedComparisons
    );
    
    // Append to CSV file
    file_put_contents($csvFile, $csvLine, FILE_APPEND | LOCK_EX);
}