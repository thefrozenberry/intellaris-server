# Setting Up SMS OTP Delivery with Twilio Verify

This guide explains how to set up the Twilio Verify integration for sending OTP SMS messages to Indian phone numbers.

## Why Twilio Verify?

We're using Twilio Verify instead of standard SMS because:
1. It's specifically designed for OTP delivery and verification
2. It handles international phone numbers properly, including Indian numbers (+91)
3. It provides templates in multiple languages
4. It has built-in rate limiting and fraud prevention

## Prerequisites

1. A Twilio account - you can sign up for a free trial at [Twilio](https://www.twilio.com/try-twilio)
2. A Verify Service created in your Twilio account

## Step 1: Create a Verify Service in Twilio

1. Sign in to your [Twilio Console](https://console.twilio.com)
2. Navigate to Verify → Services
3. Click "Create Verification Service"
4. Give it a name (e.g., "MyApp OTP Verification")
5. Configure the verification service with your preferred settings
6. Make note of the Service SID (it starts with "VA...")

## Step 2: Get Your Twilio Credentials

After signing up and creating a Verify service:

1. Go to your [Twilio Console Dashboard](https://console.twilio.com)
2. Find your **Account SID** and **Auth Token** (you'll need to click "show" to reveal the Auth Token)
3. Note down your Verify Service SID from Step 1

## Step 3: Configure Your Environment Variables

1. Copy the `.env.example` file to `.env` if you haven't already
2. Add your Twilio credentials to the `.env` file:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
```

## Step 4: Testing the OTP Delivery

You can test the OTP delivery by using the OTP generation endpoint. The system will:

1. Request a verification code to be sent to the user's phone number
2. Twilio will send the verification SMS to the mobile number
3. The user will receive a code (e.g., "123456")
4. The user will enter this code to verify their phone number
5. Your application will validate the code through Twilio Verify API

### Working with Indian Phone Numbers

Twilio Verify automatically handles Indian phone numbers, but make sure:
- Numbers always have the +91 country code prefix
- For 10-digit Indian mobile numbers, our system will automatically add the +91 prefix

## Limitations of Twilio Trial Accounts

With a Twilio trial account:
- You may need to verify the phone numbers you want to send to
- You'll have a limited credit amount for testing
- Your account's SMS capabilities will be restricted to verified numbers

To verify a phone number in your Twilio account:
1. Go to [Verified Caller IDs](https://console.twilio.com/us1/develop/phone-numbers/manage/verified)
2. Click "Add a new Caller ID"
3. Follow the verification process

## Troubleshooting

If OTP delivery fails:

1. Check your console logs for error messages
2. Verify that your Twilio credentials are correct in the `.env` file
3. Make sure the recipient phone number is in the correct format with +91 prefix
4. Check your Twilio dashboard for any error messages or account limitations

## Moving to Production

When moving to production:

1. Upgrade your Twilio account to a paid account
2. Update your `.env` file with the production credentials
3. Set `NODE_ENV=production` to disable console logging of verification requests 