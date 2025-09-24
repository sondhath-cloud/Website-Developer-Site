<?php
// Contact Form Handler for SiteWorks Hosting
// Secure contact form with validation and email functionality

// Start session for CSRF protection
session_start();

// Configuration
$config = [
    'to_email' => 'your-email@example.com', // Replace with your actual email
    'from_email' => 'noreply@yourdomain.com', // Replace with your domain
    'subject_prefix' => 'Portfolio Contact: ',
    'max_message_length' => 1000,
    'required_fields' => ['name', 'email', 'subject', 'message']
];

// Security functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generate_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Rate limiting (simple implementation)
function check_rate_limit($ip) {
    $rate_limit_file = 'rate_limit.json';
    $current_time = time();
    $rate_limit_window = 300; // 5 minutes
    $max_requests = 3; // Max 3 requests per 5 minutes
    
    if (file_exists($rate_limit_file)) {
        $data = json_decode(file_get_contents($rate_limit_file), true);
        
        // Clean old entries
        $data = array_filter($data, function($timestamp) use ($current_time, $rate_limit_window) {
            return ($current_time - $timestamp) < $rate_limit_window;
        });
        
        // Check if IP has exceeded limit
        $ip_requests = array_filter($data, function($timestamp, $ip_addr) use ($ip) {
            return $ip_addr === $ip;
        }, ARRAY_FILTER_USE_BOTH);
        
        if (count($ip_requests) >= $max_requests) {
            return false;
        }
        
        // Add current request
        $data[$ip] = $current_time;
        file_put_contents($rate_limit_file, json_encode($data));
    } else {
        // Create new rate limit file
        $data = [$ip => $current_time];
        file_put_contents($rate_limit_file, json_encode($data));
    }
    
    return true;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = ['success' => false, 'message' => '', 'errors' => []];
    
    // Get client IP
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Check rate limiting
    if (!check_rate_limit($client_ip)) {
        $response['message'] = 'Too many requests. Please wait before sending another message.';
        echo json_encode($response);
        exit;
    }
    
    // Validate CSRF token
    $csrf_token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($csrf_token)) {
        $response['message'] = 'Security token mismatch. Please refresh the page and try again.';
        echo json_encode($response);
        exit;
    }
    
    // Validate required fields
    foreach ($config['required_fields'] as $field) {
        if (empty($_POST[$field])) {
            $response['errors'][$field] = ucfirst($field) . ' is required.';
        }
    }
    
    // Validate email
    if (!empty($_POST['email']) && !validate_email($_POST['email'])) {
        $response['errors']['email'] = 'Please enter a valid email address.';
    }
    
    // Validate message length
    if (!empty($_POST['message']) && strlen($_POST['message']) > $config['max_message_length']) {
        $response['errors']['message'] = 'Message is too long. Maximum ' . $config['max_message_length'] . ' characters allowed.';
    }
    
    // If no errors, process the form
    if (empty($response['errors'])) {
        // Sanitize all inputs
        $name = sanitize_input($_POST['name']);
        $email = sanitize_input($_POST['email']);
        $subject = sanitize_input($_POST['subject']);
        $project_type = sanitize_input($_POST['project_type'] ?? '');
        $message = sanitize_input($_POST['message']);
        
        // Prepare email content
        $email_subject = $config['subject_prefix'] . $subject;
        $email_body = "
New contact form submission from your portfolio website:

Name: {$name}
Email: {$email}
Subject: {$subject}
Project Type: {$project_type}

Message:
{$message}

---
Sent from: {$_SERVER['HTTP_HOST']}
IP Address: {$client_ip}
Time: " . date('Y-m-d H:i:s') . "
        ";
        
        // Email headers
        $headers = [
            'From: ' . $config['from_email'],
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];
        
        // Send email
        $mail_sent = mail($config['to_email'], $email_subject, $email_body, implode("\r\n", $headers));
        
        if ($mail_sent) {
            $response['success'] = true;
            $response['message'] = 'Thank you for your message! I\'ll get back to you as soon as possible.';
            
            // Log successful submission (optional)
            $log_entry = date('Y-m-d H:i:s') . " - Contact form submission from {$name} ({$email})\n";
            file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
            
        } else {
            $response['message'] = 'Sorry, there was an error sending your message. Please try again later or contact me directly.';
        }
    } else {
        $response['message'] = 'Please correct the errors below and try again.';
    }
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// If not POST request, return CSRF token for form
header('Content-Type: application/json');
echo json_encode(['csrf_token' => generate_csrf_token()]);
?>
