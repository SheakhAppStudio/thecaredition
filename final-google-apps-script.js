/**
 * Ultra-simple Google Apps Script for Car Edition Pro Service Estimator
 * This script adds form data as a new row in the spreadsheet and sends email notifications
 */

// Handle POST requests from the service estimator form
function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    Logger.log('Request parameters: ' + JSON.stringify(e.parameter));
    
    // Get the active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    
    // Check if headers exist, if not, create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Email',
        'Phone',
        'Car Registration',
        'Vehicle Make',
        'Vehicle Model',
        'Vehicle Year',
        'Selected Services',
        'Total Price',
        'Notes',
        'Status'
      ]);
    }
    
    // Get current timestamp
    var timestamp = new Date().toISOString();
    var formattedDate = new Date(timestamp).toLocaleString();
    
    // Extract form data
    var name = e.parameter.name || 'Not provided';
    var email = e.parameter.email || 'Not provided';
    var phone = e.parameter.phone || 'Not provided';
    var carRegistration = e.parameter.carRegistration || 'Not provided';
    var vehicleMake = e.parameter.vehicleMake || 'Not provided';
    var vehicleModel = e.parameter.vehicleModel || 'Not provided';
    var vehicleYear = e.parameter.vehicleYear || 'Not provided';
    var selectedServices = e.parameter.selectedServices || 'Not provided';
    var totalPrice = e.parameter.totalPrice || 'Not provided';
    var notes = e.parameter.notes || 'None';
    
    // Append the data to the sheet
    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      carRegistration,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      selectedServices,
      totalPrice,
      notes,
      'New'
    ]);
    
    Logger.log('Data added to spreadsheet successfully');
    
    // Send email notification
    sendEmailNotification({
      timestamp: formattedDate,
      name: name,
      email: email,
      phone: phone,
      carRegistration: carRegistration,
      vehicleMake: vehicleMake,
      vehicleModel: vehicleModel,
      vehicleYear: vehicleYear,
      selectedServices: selectedServices,
      totalPrice: totalPrice,
      notes: notes
    });
    
    // Return success response
    return HtmlService.createHtmlOutput(
      '<html><body>' +
      '<h2>Form Submitted Successfully</h2>' +
      '<p>Thank you for your submission.</p>' +
      '<script>window.top.postMessage("success", "*");</script>' +
      '</body></html>'
    );
    
  } catch (error) {
    // Log the error
    Logger.log('Error processing request: ' + error);
    
    // Return error response
    return HtmlService.createHtmlOutput(
      '<html><body>' +
      '<h2>Error Submitting Form</h2>' +
      '<p>There was an error: ' + error.toString() + '</p>' +
      '<script>window.top.postMessage("error", "*");</script>' +
      '</body></html>'
    );
  }
}

// Send email notification about the new service request
function sendEmailNotification(data) {
  try {
    // Get the email address of the current user (owner of the script)
    var emailAddress = Session.getEffectiveUser().getEmail();
    
    // Create email subject
    var subject = 'New Service Request: ' + data.carRegistration + ' - ' + data.vehicleMake + ' ' + data.vehicleModel;
    
    // Create email body
    var body = '<h2>New Service Request</h2>' +
      '<p>A new service request has been submitted through the website:</p>' +
      '<table style="border-collapse: collapse; width: 100%;">' +
      '<tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Timestamp:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.timestamp + '</td></tr>' +
      '<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.name + '</td></tr>' +
      '<tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.email + '</td></tr>' +
      '<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.phone + '</td></tr>' +
      '<tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Car Registration:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.carRegistration + '</td></tr>' +
      '<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Vehicle:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.vehicleMake + ' ' + data.vehicleModel + ' (' + data.vehicleYear + ')</td></tr>' +
      '<tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Selected Services:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.selectedServices + '</td></tr>' +
      '<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Price:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">£' + data.totalPrice + '</td></tr>' +
      '<tr style="background-color: #f2f2f2;"><td style="padding: 8px; border: 1px solid #ddd;"><strong>Notes:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">' + data.notes + '</td></tr>' +
      '</table>' +
      '<p>Please respond to this customer as soon as possible.</p>';
    
    // Send the email
    MailApp.sendEmail({
      to: emailAddress,
      subject: subject,
      htmlBody: body
    });
    
    Logger.log('Email notification sent to: ' + emailAddress);
    return true;
  } catch (error) {
    Logger.log('Error sending email notification: ' + error);
    return false;
  }
}

// Handle GET requests (for testing)
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h1>Car Edition Pro Service Estimator API</h1>' +
    '<p>This is the endpoint for the service estimator form submissions.</p>' +
    '<p>Please use POST requests to submit form data.</p>'
  );
}
