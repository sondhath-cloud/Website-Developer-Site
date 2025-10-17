# Stripe Subscription Setup Guide

## Overview
This guide will help you set up the Stripe subscription system for your website. The system includes monthly and yearly subscription plans with secure payment processing.

## Prerequisites
- Stripe account (free at stripe.com)
- PHP hosting with cURL support
- Composer (for PHP dependencies)

## Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Access your Stripe Dashboard

### 1.2 Get API Keys
1. In Stripe Dashboard, go to **Developers > API Keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Keep these keys secure - never share the secret key publicly

### 1.3 Create Subscription Products
1. Go to **Products** in your Stripe Dashboard
2. Click **Add Product**
3. Create two products:

**Monthly Plan:**
- Name: "Monthly Subscription"
- Price: $29.00
- Billing period: Monthly
- Copy the Price ID (starts with `price_`)

**Yearly Plan:**
- Name: "Yearly Subscription" 
- Price: $299.00
- Billing period: Yearly
- Copy the Price ID (starts with `price_`)

## Step 2: Configure Your Website

### 2.1 Update Configuration File
Edit `api/config.php` and replace the placeholder values:

```php
// Replace with your actual Stripe keys
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_your_actual_key_here');
define('STRIPE_SECRET_KEY', 'sk_test_your_actual_key_here');

// Replace with your actual price IDs
define('MONTHLY_PLAN_ID', 'price_your_monthly_price_id_here');
define('YEARLY_PLAN_ID', 'price_your_yearly_price_id_here');
```

### 2.2 Install Stripe PHP Library
You have two options:

**Option A: Using Composer (Recommended)**
```bash
cd /path/to/your/website
composer require stripe/stripe-php
```

**Option B: Manual Download**
1. Download the Stripe PHP library from GitHub
2. Extract and place the `stripe-php` folder in your `api/` directory
3. Update the require statements in your PHP files to point to the correct path

### 2.3 Update Success/Cancel URLs
In `api/create-subscription.php`, update the success and cancel URLs to match your domain:

```php
'success_url' => 'https://yourdomain.com/success.html?session_id={CHECKOUT_SESSION_ID}',
'cancel_url' => 'https://yourdomain.com/cancel.html',
```

## Step 3: Test the Integration

### 3.1 Test Mode
- Use Stripe's test mode for development
- Test cards: Use `4242 4242 4242 4242` for successful payments
- Use `4000 0000 0000 0002` for declined payments

### 3.2 Test the Flow
1. Visit your website
2. Click on "Subscribe" in the navigation
3. Choose a plan (Monthly or Yearly)
4. Fill out the subscription form
5. Complete the Stripe checkout process
6. Verify you're redirected to the success page

## Step 4: Go Live

### 4.1 Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode**
2. Get your live API keys (starts with `pk_live_` and `sk_live_`)
3. Update `api/config.php` with live keys
4. Update success/cancel URLs to your live domain

### 4.2 Create Live Products
1. Create the same products in live mode
2. Update the price IDs in your configuration

## Step 5: Optional Enhancements

### 5.1 Webhook Setup (Recommended)
Set up webhooks to handle subscription events:

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhook.php`
3. Select events: `checkout.session.completed`, `customer.subscription.created`
4. Copy the webhook secret and add it to your config

### 5.2 Database Integration
If you want to store subscription data:

1. Create a database table for customers/subscriptions
2. Update the PHP files to save data after successful payments
3. Add customer portal functionality for subscription management

## Troubleshooting

### Common Issues

**"Stripe key not found" error:**
- Check that your API keys are correctly set in `config.php`
- Ensure you're using the right keys for test/live mode

**"Price not found" error:**
- Verify your price IDs are correct
- Make sure the products exist in your Stripe account

**CORS errors:**
- Ensure your hosting supports the required headers
- Check that the API endpoints are accessible

**Payment fails:**
- Use test cards in test mode
- Check that your Stripe account is properly set up
- Verify webhook endpoints are working

### Testing Checklist
- [ ] API keys are correctly configured
- [ ] Price IDs match your Stripe products
- [ ] Success/cancel URLs are accessible
- [ ] Test payments work with test cards
- [ ] Form validation works correctly
- [ ] Error handling displays proper messages

## Security Notes

- Never commit API keys to version control
- Use environment variables for production keys
- Always validate input data
- Use HTTPS in production
- Regularly rotate your API keys

## Support

For Stripe-specific issues:
- Check [Stripe Documentation](https://stripe.com/docs)
- Contact Stripe Support through your dashboard

For implementation issues:
- Check browser console for JavaScript errors
- Check server logs for PHP errors
- Verify file permissions and paths
