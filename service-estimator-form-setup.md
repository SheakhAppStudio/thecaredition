# Service Estimator Form Integration Guide

This guide explains how to set up the customer data collection form for the Service Estimator section of your Car Edition Pro website. The form will collect customer information and send it to a Google Spreadsheet using Google Apps Script.

## What I've Added

1. A customer data collection form component that appears after selecting services
2. Integration with Google Apps Script to store submissions in a spreadsheet
3. Email notification system for new service requests

## Setup Instructions

### 1. Create a Google Spreadsheet

1. Go to [Google Drive](https://drive.google.com) and create a new Google Spreadsheet
2. Name it something like "Car Edition Pro - Service Requests"

### 2. Set Up Google Apps Script

1. In your Google Spreadsheet, click on **Extensions** > **Apps Script**
2. Delete any code in the script editor
3. Copy and paste the entire contents of the `google-apps-script.js` file into the script editor
4. Click the **Save** button (disk icon) and name your project (e.g., "Service Estimator Form Handler")

### 3. Deploy the Script as a Web App

1. Click on **Deploy** > **New deployment**
2. Select **Web app** as the deployment type
3. Configure the deployment:
   - Description: "Service Estimator Form Handler"
   - Execute as: "Me" (your Google account)
   - Who has access: "Anyone" (this allows your website to send data to the script)
4. Click **Deploy**
5. Authorize the script when prompted
6. Copy the Web app URL that's provided after deployment (it will look like `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

### 4. Update Your Website Code

1. Open the file `/src/app/service-estimator/page.tsx`
2. Find the line that contains `https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec`
3. Replace `YOUR_GOOGLE_SCRIPT_ID` with the actual script ID from the URL you copied (it's the long string between `/s/` and `/exec`)

## How It Works

1. When a user enters their vehicle registration and selects services, they can click "Book a Service"
2. The customer form appears, asking for their contact details
3. When they submit the form, the data is sent to your Google Apps Script
4. The script logs the data to your spreadsheet and sends you an email notification
5. You can then contact the customer to confirm their booking

## Customization

### Email Notifications

By default, email notifications are sent to the Google account that owns the script. To change this or add additional recipients:

1. Open the Google Apps Script editor
2. Find the `sendEmailNotification` function
3. Update the `businessEmail` and `ccEmails` variables with your desired email addresses

### Form Fields

If you want to add or remove fields from the form:

1. Update the `CustomerForm.tsx` component to include your new fields
2. Update the `CustomerData` interface to include the new field types
3. Update the Google Apps Script to handle the new fields in the spreadsheet

## Testing

1. Run your website locally
2. Navigate to the Service Estimator page
3. Enter a vehicle registration and select some services
4. Click "Book a Service" and fill out the form
5. Submit the form and check your Google Spreadsheet to see if the data was recorded

## Troubleshooting

- If the form submission fails, check the browser console for error messages
- Ensure your Google Apps Script is deployed correctly and accessible
- Make sure you've replaced the placeholder script ID in your code
- Check that your Google account has permission to send emails through Apps Script
