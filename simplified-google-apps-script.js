/**
 * Simple Google Apps Script for Car Edition Pro Service Estimator
 * This script handles form submissions and logs them to a Google Spreadsheet
 */

// Handle POST requests from the service estimator form
function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request');
    Logger.log('Request parameters: ' + JSON.stringify(e.parameter));
    
    // Extract data directly from form parameters
    const data = {
      timestamp: e.parameter.timestamp || new Date().toISOString(),
      name: e.parameter.name || '',
      email: e.parameter.email || '',
      phone: e.parameter.phone || '',
      carRegistration: e.parameter.carRegistration || '',
      vehicleMake: e.parameter.vehicleMake || '',
      vehicleModel: e.parameter.vehicleModel || '',
      vehicleYear: e.parameter.vehicleYear || '',
      selectedServices: e.parameter.selectedServices || '',
      totalPrice: e.parameter.totalPrice || '',
      notes: e.parameter.notes || '',
      status: e.parameter.status || 'New'
    };
    
    Logger.log('Processed form data: ' + JSON.stringify(data));
    
    // Log the data to the spreadsheet
    logToSpreadsheet(data);
    
    // Return success response with HTML
    return HtmlService.createHtmlOutput(
      '<html><body><h2>Form Submitted Successfully</h2>' +
      '<p>Thank you for your submission. You may close this window.</p>' +
      '<script>window.parent.postMessage("success", "*");</script>' +
      '</body></html>'
    );
    
  } catch (error) {
    // Log the error
    Logger.log('Error processing form submission: ' + error);
    
    // Return error response
    return HtmlService.createHtmlOutput(
      '<html><body><h2>Error Submitting Form</h2>' +
      '<p>There was an error processing your submission: ' + error.toString() + '</p>' +
      '<script>window.parent.postMessage("error", "*");</script>' +
      '</body></html>'
    );
  }
}

// Log the form data to the spreadsheet
function logToSpreadsheet(data) {
  try {
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
      
      // Format the header row
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#f3f3f3');
    }
    
    // Format the timestamp
    var timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
    var formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    
    // Append the data to the sheet
    sheet.appendRow([
      formattedTimestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.carRegistration || '',
      data.vehicleMake || '',
      data.vehicleModel || '',
      data.vehicleYear || '',
      data.selectedServices || '',
      data.totalPrice ? '£' + data.totalPrice : '',
      data.notes || '',
      'New'
    ]);
    
    Logger.log('Data logged to spreadsheet successfully');
    return true;
  } catch (error) {
    Logger.log('Error logging to spreadsheet: ' + error);
    throw error;
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
