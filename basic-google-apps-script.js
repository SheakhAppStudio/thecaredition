/**
 * Extremely simple Google Apps Script for Car Edition Pro Service Estimator
 * This script just adds form data as a new row in the spreadsheet
 */

// Handle POST requests from the service estimator form
function doPost(e) {
  try {
    // Log the incoming request
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
    
    // Extract data directly from parameters
    var timestamp = new Date().toISOString();
    var name = e.parameter.name || '';
    var email = e.parameter.email || '';
    var phone = e.parameter.phone || '';
    var carRegistration = e.parameter.carRegistration || '';
    var vehicleMake = e.parameter.vehicleMake || '';
    var vehicleModel = e.parameter.vehicleModel || '';
    var vehicleYear = e.parameter.vehicleYear || '';
    var selectedServices = e.parameter.selectedServices || '';
    var totalPrice = e.parameter.totalPrice || '';
    var notes = e.parameter.notes || '';
    
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
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data added to spreadsheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    Logger.log('Error processing request: ' + error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
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
