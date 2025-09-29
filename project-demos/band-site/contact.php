<?php
// Contact form handler for Blamshifters website
// This will work perfectly with your SiteWorks hosting

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Sanitize and validate input data
    $name = trim(filter_input(INPUT_POST, "name", FILTER_SANITIZE_STRING));
    $email = trim(filter_input(INPUT_POST, "email", FILTER_SANITIZE_EMAIL));
    $subject = trim(filter_input(INPUT_POST, "subject", FILTER_SANITIZE_STRING));
    $message = trim(filter_input(INPUT_POST, "message", FILTER_SANITIZE_STRING));
    
    // Validation
    $errors = array();
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If no errors, send email
    if (empty($errors)) {
        
        // Email configuration
        $to = "booking@blameshifters.com"; // Change this to your email
        $email_subject = "Website Contact: " . $subject;
        
        // Email content
        $email_body = "You have received a new message from the Blameshifters website.\n\n";
        $email_body .= "Name: " . $name . "\n";
        $email_body .= "Email: " . $email . "\n";
        $email_body .= "Subject: " . $subject . "\n\n";
        $email_body .= "Message:\n" . $message . "\n";
        
        // Email headers
        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send email
        if (mail($to, $email_subject, $email_body, $headers)) {
            // Success - redirect back to contact page with success message
            header("Location: index.html?success=1#contact");
            exit();
        } else {
            // Error sending email
            $errors[] = "Sorry, there was an error sending your message. Please try again.";
        }
    }
    
    // If there are errors, redirect back with error message
    if (!empty($errors)) {
        $error_message = implode(", ", $errors);
        header("Location: index.html?error=" . urlencode($error_message) . "#contact");
        exit();
    }
    
} else {
    // If not POST request, redirect to home page
    header("Location: index.html");
    exit();
}
?>
