/**
 * Google Apps Script for Car Edition Pro Chatbot
 * This script handles chatbot submissions and logs them to a Google Spreadsheet
 */

// Create the menu item for chatbot operations
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Chatbot')
    .addItem('Clear Test Data', 'clearTestData')
    .addSeparator()
    .addSubMenu(ui.createMenu('Update Status')
      .addItem('Mark as Contacted', 'markAsContacted')
      .addItem('Mark as Booked', 'markAsBooked')
      .addItem('Mark as Completed', 'markAsCompleted')
      .addItem('Mark as Cancelled', 'markAsCancelled'))
    .addSeparator()
    .addItem('Format Spreadsheet', 'formatSpreadsheet')
    .addToUi();
}

// Clear all test data from the sheet
function clearTestData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  SpreadsheetApp.getUi().alert('Test data cleared successfully!');
}

// Handle POST requests from the chatbot
function doPost(e) {
  try {
    // Log the incoming request for debugging
    Logger.log('Received POST request from chatbot');
    Logger.log('Request parameters: ' + JSON.stringify(e.parameter));
    Logger.log('Post data: ' + JSON.stringify(e.postData));
    
    // Parse the JSON data from the request
    var data;
    
    // Check if data is coming from URLSearchParams (e.parameter.data)
    if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
      Logger.log('Parsed data from parameter: ' + JSON.stringify(data));
    } 
    // Or directly from the request body (e.postData.contents)
    else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
      Logger.log('Parsed data from postData: ' + JSON.stringify(data));
    } 
    else {
      throw new Error('No data received in the request');
    }
    
    // Validate the chatbot data
    var validationErrors = validateChatbotData(data);
    if (validationErrors.length > 0) {
      Logger.log('Validation errors: ' + JSON.stringify(validationErrors));
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Validation errors',
        'errors': validationErrors
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Log the data to the spreadsheet
    logChatbotDataToSpreadsheet(data);
    Logger.log('Chatbot data logged to spreadsheet successfully');
    
    // Schedule a follow-up reminder for 1 day later
    scheduleFollowUp(data, 1);
    Logger.log('Follow-up scheduled');
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Chatbot data received successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    console.error('Error processing chatbot submission: ' + error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Error processing chatbot data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Validate the chatbot data
function validateChatbotData(data) {
  var errors = [];
  
  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email is not valid');
  }
  
  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone number is required');
  }
  
  if (!data.carRegistration || data.carRegistration.trim() === '') {
    errors.push('Car registration is required');
  }
  
  return errors;
}

// Check if email is valid
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Log chatbot data to the spreadsheet
function logChatbotDataToSpreadsheet(data) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  // Check if the sheet is empty and set up headers if needed
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
      'Engine Size',
      'Query',
      'Notes',
      'Status',
      'Action Buttons'
    ]);
    
    // Format the header row
    sheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#f3f3f3');
    
    // Freeze the header row
    sheet.setFrozenRows(1);
    
    // Set column widths for better readability
    sheet.setColumnWidth(1, 150);  // Timestamp
    sheet.setColumnWidth(2, 150);  // Name
    sheet.setColumnWidth(3, 180);  // Email
    sheet.setColumnWidth(4, 120);  // Phone
    sheet.setColumnWidth(5, 120);  // Car Registration
    sheet.setColumnWidth(6, 120);  // Vehicle Make
    sheet.setColumnWidth(7, 120);  // Vehicle Model
    sheet.setColumnWidth(8, 100);  // Vehicle Year
    sheet.setColumnWidth(9, 100);  // Engine Size
    sheet.setColumnWidth(10, 250); // Query
    sheet.setColumnWidth(11, 200); // Notes
    sheet.setColumnWidth(12, 100); // Status
    sheet.setColumnWidth(13, 250); // Action Buttons
  }
  
  // Extract notes from the query if present
  var notes = '';
  var query = data.query;
  
  if (data.query && data.query.includes('|')) {
    var parts = data.query.split('|');
    query = parts[0].trim();
    notes = parts[1].replace('Additional notes:', '').trim();
  }
  
  // Insert the chatbot data at row 2 to keep new entries at the top
  sheet.insertRow(2);
  sheet.getRange(2, 1, 1, 13).setValues([
    [new Date(), // Current timestamp
    data.name,
    data.email,
    data.phone,
    data.carRegistration,
    data.vehicleMake || '',
    data.vehicleModel || '',
    data.vehicleYear || '',
    data.engineSize || '',
    query,
    notes,
    'New', // Initial status
    ''
  ]]);
  
  // Format the spreadsheet for better readability
  formatSpreadsheet();
}

// Format the spreadsheet for better readability
function formatSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return; // No data to format
  }
  
  // Format the timestamp column
  var timestampRange = sheet.getRange(2, 1, lastRow - 1, 1);
  timestampRange.setNumberFormat('dd/MM/yyyy HH:mm:ss');
  
  // Add conditional formatting for the status column
  var statusRange = sheet.getRange(2, 12, lastRow - 1, 1);
  
  // Clear any existing conditional formatting rules
  var rules = sheet.getConditionalFormatRules();
  sheet.setConditionalFormatRules([]);
  
  // Add rule for 'New' status (yellow background)
  var newRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('New')
    .setBackground('#fff2cc')
    .setRanges([statusRange])
    .build();
  
  // Add rule for 'Contacted' status (light blue background)
  var contactedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Contacted')
    .setBackground('#cfe2f3')
    .setRanges([statusRange])
    .build();
  
  // Add rule for 'Booked' status (light green background)
  var bookedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Booked')
    .setBackground('#d9ead3')
    .setRanges([statusRange])
    .build();
  
  // Add rule for 'Completed' status (gray background)
  var completedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Completed')
    .setBackground('#efefef')
    .setRanges([statusRange])
    .build();
  
  // Add rule for 'Cancelled' status (light red background)
  var cancelledRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Cancelled')
    .setBackground('#f4cccc')
    .setRanges([statusRange])
    .build();
  
  // Set the new conditional format rules
  sheet.setConditionalFormatRules([newRule, contactedRule, bookedRule, completedRule, cancelledRule]);
  
  // Add action buttons to each row
  for (var i = 2; i <= lastRow; i++) {
    var status = sheet.getRange(i, 12).getValue();
    var actionsCell = sheet.getRange(i, 13);
    
    if (status === 'New') {
      actionsCell.setValue('=HYPERLINK("#", "Contact") & " | " & HYPERLINK("#", "Cancel")');
    } else if (status === 'Contacted') {
      actionsCell.setValue('=HYPERLINK("#", "Book") & " | " & HYPERLINK("#", "Cancel")');
    } else if (status === 'Booked') {
      actionsCell.setValue('=HYPERLINK("#", "Complete") & " | " & HYPERLINK("#", "Cancel")');
    } else {
      actionsCell.setValue('');
    }
  }
}

// Schedule a follow-up reminder
function scheduleFollowUp(data, days) {
  var triggerDate = new Date();
  triggerDate.setDate(triggerDate.getDate() + days);
  
  // Create a trigger to send a follow-up email
  ScriptApp.newTrigger('sendFollowUpEmail')
    .timeBased()
    .at(triggerDate)
    .create();
  
  // Store the customer data in Properties service for the trigger
  var customerProps = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    carRegistration: data.carRegistration,
    timestamp: new Date().toString()
  };
  
  PropertiesService.getScriptProperties().setProperty(
    'followup_' + data.email + '_' + new Date().getTime(),
    JSON.stringify(customerProps)
  );
}

// Send a follow-up email
function sendFollowUpEmail() {
  var scriptProps = PropertiesService.getScriptProperties();
  var allProps = scriptProps.getProperties();
  
  // Find properties that start with 'followup_'
  for (var key in allProps) {
    if (key.indexOf('followup_') === 0) {
      try {
        var customerData = JSON.parse(allProps[key]);
        var timestamp = new Date(customerData.timestamp);
        var now = new Date();
        
        // Check if this follow-up is due (24 hours old)
        if ((now.getTime() - timestamp.getTime()) >= 24 * 60 * 60 * 1000) {
          // Send follow-up email
          var emailSubject = 'Follow-up on your Car Edition inquiry';
          var emailBody = 'Dear ' + customerData.name + ',\n\n' +
                         'Thank you for your recent inquiry with The Car Edition. ' +
                         'We wanted to follow up and see if you have any questions or if you would like to schedule a service.\n\n' +
                         'Your inquiry details:\n' +
                         'Vehicle Registration: ' + customerData.carRegistration + '\n\n' +
                         'Please feel free to reply to this email or call us at 01234 567890.\n\n' +
                         'Best regards,\n' +
                         'The Car Edition Team';
          
          // Send the email
          MailApp.sendEmail(customerData.email, emailSubject, emailBody);
          
          // Delete the property after sending the email
          scriptProps.deleteProperty(key);
        }
      } catch (e) {
        console.error('Error processing follow-up: ' + e);
        // Delete invalid properties
        scriptProps.deleteProperty(key);
      }
    }
  }
}

// Mark a row as contacted
function markAsContacted() {
  updateStatus('Contacted');
}

// Mark a row as booked
function markAsBooked() {
  updateStatus('Booked');
}

// Mark a row as completed
function markAsCompleted() {
  updateStatus('Completed');
}

// Mark a row as cancelled
function markAsCancelled() {
  updateStatus('Cancelled');
}

// Update the status of the selected row
function updateStatus(status) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getActiveRange();
  
  if (range.getRow() > 1) {
    sheet.getRange(range.getRow(), 12).setValue(status);
    formatSpreadsheet();
  } else {
    SpreadsheetApp.getUi().alert('Please select a data row first');
  }
}
