<?php
require_once 'config.php';

// Include Stripe PHP library
require_once '../stripe-php-master/init.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

// Set your secret key
Stripe::setApiKey(STRIPE_SECRET_KEY);

// Handle POST request to create subscription checkout session
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['customer_id']) || !isset($input['plan_type'])) {
            throw new Exception('Customer ID and plan type are required');
        }
        
        // Determine plan ID based on plan type
        $price_id = '';
        switch ($input['plan_type']) {
            case 'monthly':
                $price_id = MONTHLY_PLAN_ID;
                break;
            case 'yearly':
                $price_id = YEARLY_PLAN_ID;
                break;
            default:
                throw new Exception('Invalid plan type');
        }
        
        // Create checkout session
        $checkout_session = Session::create([
            'customer' => $input['customer_id'],
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $price_id,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => 'https://sondrahathaway.com/subscribe.html?payment=success&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'https://sondrahathaway.com/subscribe.html?payment=cancelled',
            'metadata' => [
                'customer_id' => $input['customer_id'],
                'plan_type' => $input['plan_type']
            ]
        ]);
        
        // Return success response with checkout URL
        echo json_encode([
            'success' => true,
            'checkout_url' => $checkout_session->url,
            'session_id' => $checkout_session->id,
            'message' => 'Checkout session created successfully'
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
