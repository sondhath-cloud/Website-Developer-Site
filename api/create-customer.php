<?php
require_once 'config.php';

// Include Stripe PHP library
require_once '../stripe-php-master/init.php';

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;

// Set your secret key
Stripe::setApiKey(STRIPE_SECRET_KEY);

// Handle POST request to create customer
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['email'])) {
            throw new Exception('Email is required');
        }
        
        // Validate email
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }
        
        // Create customer in Stripe
        $customer = Customer::create([
            'email' => $input['email'],
            'name' => $input['name'] ?? '',
            'metadata' => [
                'source' => 'website_subscription',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
        
        // Return success response
        echo json_encode([
            'success' => true,
            'customer_id' => $customer->id,
            'message' => 'Customer created successfully'
        ]);
        
    } catch (ApiErrorException $e) {
        // Stripe API error
        echo json_encode([
            'success' => false,
            'message' => 'Stripe error: ' . $e->getMessage()
        ]);
    } catch (Exception $e) {
        // General error
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>
