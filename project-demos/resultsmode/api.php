<?php
// ResultsMode App Demo - PHP Backend API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$dbname = 'sondraha_resultsmode';
$username = 'sondraha_resultsmode';
$password = 'QvQ7aDzazpQt2hySAZB6';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api.php', '', $path);
$path = str_replace('/resultsmode', '', $path); // Handle subdirectory

// Route handling
switch ($method) {
    case 'GET':
        handleGet($pdo, $path);
        break;
    case 'POST':
        handlePost($pdo, $path);
        break;
    case 'PUT':
        handlePut($pdo, $path);
        break;
    case 'DELETE':
        handleDelete($pdo, $path);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGet($pdo, $path) {
    switch ($path) {
        case '/departments':
            getDepartments($pdo);
            break;
        case '/members':
            getMembers($pdo);
            break;
        case '/stakeholders':
            getStakeholders($pdo);
            break;
        case '/connections':
            getConnections($pdo);
            break;
        case '/impacts':
            getImpacts($pdo);
            break;
        case '/plans':
            getPlans($pdo);
            break;
        case '/ideas':
            getIdeas($pdo);
            break;
        case '/job-aids':
            getJobAids($pdo);
            break;
        case '/training':
            getTraining($pdo);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
}

function handlePost($pdo, $path) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($path) {
        case '/departments':
            createDepartment($pdo, $input);
            break;
        case '/members':
            createMember($pdo, $input);
            break;
        case '/stakeholders':
            createStakeholder($pdo, $input);
            break;
        case '/connections':
            createConnection($pdo, $input);
            break;
        case '/impacts':
            createImpact($pdo, $input);
            break;
        case '/plans':
            createPlan($pdo, $input);
            break;
        case '/ideas':
            createIdea($pdo, $input);
            break;
        case '/job-aids':
            createJobAid($pdo, $input);
            break;
        case '/training':
            createTraining($pdo, $input);
            break;
        case '/csv-import':
            importCSV($pdo, $input);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
}

function handlePut($pdo, $path) {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = extractIdFromPath($path);
    
    switch (true) {
        case strpos($path, '/departments/') === 0:
            updateDepartment($pdo, $id, $input);
            break;
        case strpos($path, '/members/') === 0:
            updateMember($pdo, $id, $input);
            break;
        case strpos($path, '/stakeholders/') === 0:
            updateStakeholder($pdo, $id, $input);
            break;
        case strpos($path, '/connections/') === 0:
            updateConnection($pdo, $id, $input);
            break;
        case strpos($path, '/impacts/') === 0:
            updateImpact($pdo, $id, $input);
            break;
        case strpos($path, '/plans/') === 0:
            updatePlan($pdo, $id, $input);
            break;
        case strpos($path, '/ideas/') === 0:
            updateIdea($pdo, $id, $input);
            break;
        case strpos($path, '/job-aids/') === 0:
            updateJobAid($pdo, $id, $input);
            break;
        case strpos($path, '/training/') === 0:
            updateTraining($pdo, $id, $input);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
}

function handleDelete($pdo, $path) {
    $id = extractIdFromPath($path);
    
    switch (true) {
        case strpos($path, '/departments/') === 0:
            deleteDepartment($pdo, $id);
            break;
        case strpos($path, '/members/') === 0:
            deleteMember($pdo, $id);
            break;
        case strpos($path, '/stakeholders/') === 0:
            deleteStakeholder($pdo, $id);
            break;
        case strpos($path, '/connections/') === 0:
            deleteConnection($pdo, $id);
            break;
        case strpos($path, '/impacts/') === 0:
            deleteImpact($pdo, $id);
            break;
        case strpos($path, '/plans/') === 0:
            deletePlan($pdo, $id);
            break;
        case strpos($path, '/ideas/') === 0:
            deleteIdea($pdo, $id);
            break;
        case strpos($path, '/job-aids/') === 0:
            deleteJobAid($pdo, $id);
            break;
        case strpos($path, '/training/') === 0:
            deleteTraining($pdo, $id);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
    }
}

function extractIdFromPath($path) {
    $parts = explode('/', $path);
    return end($parts);
}

// Department functions
function getDepartments($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM departments ORDER BY name");
        $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($departments);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function createDepartment($pdo, $data) {
    try {
        $stmt = $pdo->prepare("INSERT INTO departments (name, members, coverage) VALUES (?, 0, 0)");
        $stmt->execute([$data['name']]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Department created successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateDepartment($pdo, $id, $data) {
    try {
        $stmt = $pdo->prepare("UPDATE departments SET name = ?, members = ?, coverage = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['members'], $data['coverage'], $id]);
        echo json_encode(['message' => 'Department updated successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteDepartment($pdo, $id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM departments WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Department deleted successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Member functions
function getMembers($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM members ORDER BY name");
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($members);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function createMember($pdo, $data) {
    try {
        $stmt = $pdo->prepare("INSERT INTO members (name, email, phone, department, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['department'], $data['role']]);
        
        // Update department member count
        $stmt = $pdo->prepare("UPDATE departments SET members = members + 1, coverage = LEAST(100, coverage + 20) WHERE name = ?");
        $stmt->execute([$data['department']]);
        
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Member created successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateMember($pdo, $id, $data) {
    try {
        $stmt = $pdo->prepare("UPDATE members SET name = ?, email = ?, phone = ?, department = ?, role = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['department'], $data['role'], $id]);
        echo json_encode(['message' => 'Member updated successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteMember($pdo, $id) {
    try {
        // Get member info before deletion
        $stmt = $pdo->prepare("SELECT department FROM members WHERE id = ?");
        $stmt->execute([$id]);
        $member = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Delete member
        $stmt = $pdo->prepare("DELETE FROM members WHERE id = ?");
        $stmt->execute([$id]);
        
        // Update department member count
        if ($member) {
            $stmt = $pdo->prepare("UPDATE departments SET members = GREATEST(0, members - 1), coverage = GREATEST(0, coverage - 20) WHERE name = ?");
            $stmt->execute([$member['department']]);
        }
        
        echo json_encode(['message' => 'Member deleted successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// CSV Import function
function importCSV($pdo, $data) {
    try {
        $csvData = $data['csvData'];
        $lines = explode("\n", $csvData);
        $headers = str_getcsv($lines[0]);
        
        if (!in_array('Department/Agency', $headers)) {
            http_response_code(400);
            echo json_encode(['error' => 'CSV must have "Department/Agency" header']);
            return;
        }
        
        $deptIndex = array_search('Department/Agency', $headers);
        $addedCount = 0;
        
        for ($i = 1; $i < count($lines); $i++) {
            $line = trim($lines[$i]);
            if (empty($line)) continue;
            
            $values = str_getcsv($line);
            $deptName = trim($values[$deptIndex]);
            
            if (!empty($deptName)) {
                // Check if department already exists
                $stmt = $pdo->prepare("SELECT id FROM departments WHERE name = ?");
                $stmt->execute([$deptName]);
                
                if (!$stmt->fetch()) {
                    $stmt = $pdo->prepare("INSERT INTO departments (name, members, coverage) VALUES (?, 0, 0)");
                    $stmt->execute([$deptName]);
                    $addedCount++;
                }
            }
        }
        
        echo json_encode(['message' => "$addedCount departments imported successfully", 'count' => $addedCount]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Placeholder functions for other entities (similar structure)
function getStakeholders($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM stakeholders ORDER BY name");
        $stakeholders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($stakeholders);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function createStakeholder($pdo, $data) {
    try {
        $stmt = $pdo->prepare("INSERT INTO stakeholders (name, organization, role, influence, interest) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['organization'], $data['role'], $data['influence'], $data['interest']]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Stakeholder created successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateStakeholder($pdo, $id, $data) {
    try {
        $stmt = $pdo->prepare("UPDATE stakeholders SET name = ?, organization = ?, role = ?, influence = ?, interest = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['organization'], $data['role'], $data['influence'], $data['interest'], $id]);
        echo json_encode(['message' => 'Stakeholder updated successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteStakeholder($pdo, $id) {
    try {
        $stmt = $pdo->prepare("DELETE FROM stakeholders WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Stakeholder deleted successfully']);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Similar placeholder functions for other entities...
function getConnections($pdo) { echo json_encode([]); }
function createConnection($pdo, $data) { echo json_encode(['message' => 'Connection created']); }
function updateConnection($pdo, $id, $data) { echo json_encode(['message' => 'Connection updated']); }
function deleteConnection($pdo, $id) { echo json_encode(['message' => 'Connection deleted']); }

function getImpacts($pdo) { echo json_encode([]); }
function createImpact($pdo, $data) { echo json_encode(['message' => 'Impact created']); }
function updateImpact($pdo, $id, $data) { echo json_encode(['message' => 'Impact updated']); }
function deleteImpact($pdo, $id) { echo json_encode(['message' => 'Impact deleted']); }

function getPlans($pdo) { echo json_encode([]); }
function createPlan($pdo, $data) { echo json_encode(['message' => 'Plan created']); }
function updatePlan($pdo, $id, $data) { echo json_encode(['message' => 'Plan updated']); }
function deletePlan($pdo, $id) { echo json_encode(['message' => 'Plan deleted']); }

function getIdeas($pdo) { echo json_encode([]); }
function createIdea($pdo, $data) { echo json_encode(['message' => 'Idea created']); }
function updateIdea($pdo, $id, $data) { echo json_encode(['message' => 'Idea updated']); }
function deleteIdea($pdo, $id) { echo json_encode(['message' => 'Idea deleted']); }

function getJobAids($pdo) { echo json_encode([]); }
function createJobAid($pdo, $data) { echo json_encode(['message' => 'Job aid created']); }
function updateJobAid($pdo, $id, $data) { echo json_encode(['message' => 'Job aid updated']); }
function deleteJobAid($pdo, $id) { echo json_encode(['message' => 'Job aid deleted']); }

function getTraining($pdo) { echo json_encode([]); }
function createTraining($pdo, $data) { echo json_encode(['message' => 'Training created']); }
function updateTraining($pdo, $id, $data) { echo json_encode(['message' => 'Training updated']); }
function deleteTraining($pdo, $id) { echo json_encode(['message' => 'Training deleted']); }
?>
