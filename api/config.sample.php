<?php
// Stripe Configuration
// Copy this file to config.php and add your actual Stripe keys

// Test keys (for development)
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_your_publishable_key_here');
define('STRIPE_SECRET_KEY', 'sk_test_your_secret_key_here');

// Live keys (for production) - uncomment when ready to go live
// define('STRIPE_PUBLISHABLE_KEY', 'pk_live_your_publishable_key_here');
// define('STRIPE_SECRET_KEY', 'sk_live_your_secret_key_here');

// Set your Stripe webhook secret (for webhook verification)
define('STRIPE_WEBHOOK_SECRET', 'whsec_your_webhook_secret_here');

// Subscription plan IDs - replace with your actual price IDs from Stripe dashboard
define('MONTHLY_PLAN_ID', 'price_your_monthly_plan_id_here'); // Monthly Web Hosting and Support
define('YEARLY_PLAN_ID', 'price_your_yearly_plan_id_here'); // Annual Web Hosting and Support

// Database configuration (if you want to store subscription data)
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type for JSON responses
header('Content-Type: application/json');

// CORS headers (if needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>

