<?php
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="experience-responses-' . date('Y-m-d') . '.csv"');
header('Access-Control-Allow-Origin: *');

$submissionsFile = '../data/submissions.json';

if (!file_exists($submissionsFile)) {
    http_response_code(404);
    echo "No submissions found";
    exit();
}

$jsonData = file_get_contents($submissionsFile);
$submissions = json_decode($jsonData, true) ?: [];

if (empty($submissions)) {
    echo "No submissions to export";
    exit();
}

// CSV headers
$headers = [
    'Submission ID', 'Submitted Date', 'Project Count', 'Procurement Count', 'Budget Count',
    'Project Names', 'Project Budgets', 'Project Statuses', 'Procurement Types', 
    'Procurement Values', 'Procurement Statuses', 'Budget Types', 'Cost Savings', 'Budget Statuses'
];

// Output CSV headers
echo '"' . implode('","', $headers) . '"' . "\n";

// Output data rows
foreach ($submissions as $index => $submission) {
    $projects = $submission['projects'] ?? [];
    $procurements = $submission['procurements'] ?? [];
    $budgets = $submission['budgets'] ?? [];
    
    $row = [
        $index + 1,
        $submission['timestamp'],
        count($projects),
        count($procurements),
        count($budgets),
        implode('; ', array_column($projects, 'name')),
        implode('; ', array_column($projects, 'budget')),
        implode('; ', array_column($projects, 'status')),
        implode('; ', array_column($procurements, 'type')),
        implode('; ', array_column($procurements, 'value')),
        implode('; ', array_column($procurements, 'status')),
        implode('; ', array_column($budgets, 'type')),
        implode('; ', array_column($budgets, 'costSavings')),
        implode('; ', array_column($budgets, 'status'))
    ];
    
    // Escape quotes and wrap in quotes
    $escapedRow = array_map(function($field) {
        return '"' . str_replace('"', '""', $field) . '"';
    }, $row);
    
    echo implode(',', $escapedRow) . "\n";
}
?>
