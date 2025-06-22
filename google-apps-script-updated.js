/**
 * Google Apps Script for Car Edition Pro Service Estimator
 * This script handles form submissions from the service estimator page
 * and logs them to a Google Spreadsheet as a booking admin system
 */

// Create the menu item for manual operations
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Service Estimator')
      .addItem('Clear Test Data', 'clearTestData')
      .addSeparator()
      .addSubMenu(ui.createMenu('Update Status')
        .addItem('Mark as Contacted', 'markAsContacted')
        .addItem('Mark as Booked', 'markAsBooked')
        .addItem('Mark as Completed', 'markAsCompleted')
        .addItem('Mark as Cancelled', 'markAsCancelled'))
      .addSeparator()
      .addItem('Format Spreadsheet', 'formatSpreadsheet')
      .addItem('Generate Dashboard', 'generateDashboard')
      .addItem('Sort by Newest First', 'sortByNewest')
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
  
  // Handle POST requests from the service estimator form
  function doPost(e) {
    try {
      // Log the incoming request for debugging
      Logger.log('Received POST request');
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
      
      // Validate the form data
      var validationErrors = validateFormData(data);
      if (validationErrors.length > 0) {
        Logger.log('Validation errors: ' + JSON.stringify(validationErrors));
        return ContentService.createTextOutput(JSON.stringify({
          'result': 'error',
          'message': 'Validation errors',
          'errors': validationErrors
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Log the data to the spreadsheet
      logToSpreadsheet(data);
      Logger.log('Data logged to spreadsheet successfully');
      
      // Schedule a follow-up reminder for 2 days later
      scheduleFollowUp(data, 2);
      Logger.log('Follow-up scheduled');
      
      // Return success response
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Form data received successfully'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (error) {
      // Log the error
      Logger.log('Error processing form submission: ' + error);
      
      // Return error response
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Error processing form: ' + error.toString()
      })).setMimeType(ContentService.MimeType.JSON);
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
        sheet.setColumnWidth(9, 250);  // Selected Services
        sheet.setColumnWidth(10, 100); // Total Price
        sheet.setColumnWidth(11, 200); // Notes
        sheet.setColumnWidth(12, 100); // Status
        sheet.setColumnWidth(13, 250); // Action Buttons
      }
      
      // Format the selected services as a comma-separated string
      var servicesString = Array.isArray(data.selectedServices) 
        ? data.selectedServices.join(', ') 
        : data.selectedServices;
      
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
        servicesString,
        data.totalPrice ? '£' + data.totalPrice : '',
        data.notes || '',
        'New'
      ]);
      
      // Get the row we just added
      var lastRow = sheet.getLastRow();
      
      // Format the spreadsheet for better readability
      formatSpreadsheet();
      
      // Add conditional formatting for the status column
      updateStatusFormatting(sheet);
      
      // Send email notification
      sendEmailNotification(data);
      
      return true;
    } catch (error) {
      Logger.log('Error logging data to spreadsheet: ' + error);
      throw error;
    }
  }
  
  // Update status formatting
  function updateStatusFormatting(sheet) {
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return;
    
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
  }
  
  // Sort the spreadsheet by newest entries first
  function sortByNewest() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) return;
    
    // Sort by timestamp (column 1) in descending order
    var range = sheet.getRange(2, 1, lastRow - 1, 13);
    range.sort({column: 1, ascending: false});
    
    SpreadsheetApp.getUi().alert('Spreadsheet sorted by newest entries first.');
  }
  
  // Send email notification about the new service request
  function sendEmailNotification(data) {
    try {
      // Get the recipient email address (the script owner's email)
      var recipientEmail = Session.getEffectiveUser().getEmail();
      
      // Format the timestamp
      var timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
      var formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      
      // Create the email subject
      var subject = 'New Service Request - ' + data.carRegistration;
      if (data.name) {
        subject += ' - ' + data.name;
      }
      
      // Create the email body
      var body = '<h2>New Service Request</h2>' +
                 '<p><strong>Timestamp:</strong> ' + formattedTimestamp + '</p>' +
                 '<p><strong>Car Registration:</strong> ' + data.carRegistration + '</p>';
                 
      if (data.name) {
        body += '<p><strong>Customer:</strong> ' + data.name + '</p>';
      }
      
      body += '<p><strong>Phone:</strong> ' + data.phone + '</p>';
      
      if (data.email) {
        body += '<p><strong>Email:</strong> ' + data.email + '</p>';
      }
      
      body += '<p><strong>Vehicle:</strong> ' + data.vehicleMake;
      if (data.vehicleModel) {
        body += ' ' + data.vehicleModel;
      }
      if (data.vehicleYear) {
        body += ' (' + data.vehicleYear + ')';
      }
      body += '</p>' +
              '<p><strong>Selected Services:</strong> ' + data.selectedServices + '</p>' +
              '<p><strong>Total Price:</strong> £' + data.totalPrice + '</p>';
              
      if (data.notes) {
        body += '<p><strong>Notes:</strong> ' + data.notes + '</p>';
      }
      
      body += '<p>Please respond to this customer as soon as possible.</p>';
      
      // Send the email
      MailApp.sendEmail({
        to: recipientEmail,
        subject: subject,
        htmlBody: body
      });
      
      return true;
    } catch (error) {
      Logger.log('Error sending email notification: ' + error);
      return false;
    }
  }
  
  // Format the spreadsheet for better readability
  function formatSpreadsheet() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    
    // Only proceed if there's data in the sheet
    if (sheet.getLastRow() <= 1) return;
    
    // Auto-resize columns to fit content
    sheet.autoResizeColumns(1, 13);
    
    // Format the timestamp column
    var timestampRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
    timestampRange.setNumberFormat('dd/MM/yyyy HH:mm:ss');
    
    // Format the price column
    var priceRange = sheet.getRange(2, 10, sheet.getLastRow() - 1, 1);
    priceRange.setNumberFormat('£#,##0.00');
    
    // Add alternating row colors for readability
    var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 13);
    var colors = [];
    for (var i = 0; i < sheet.getLastRow() - 1; i++) {
      colors.push(i % 2 === 0 ? '#ffffff' : '#f3f3f3');
    }
    dataRange.setBackgrounds(colors.map(color => Array(13).fill(color)));
    
    // Add borders
    dataRange.setBorder(true, true, true, true, true, true, '#d0d0d0', SpreadsheetApp.BorderStyle.SOLID);
    
    // Update status formatting
    updateStatusFormatting(sheet);
  }
  
  // Schedule a follow-up reminder
  function scheduleFollowUp(data, daysToFollowUp) {
    try {
      // Create a unique ID for this customer
      var customerId = 'customer_' + new Date().getTime();
      
      // Store customer data in script properties
      var customerData = {
        timestamp: data.timestamp || new Date().toISOString(),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        registration: data.carRegistration || '',
        vehicle: (data.vehicleMake || '') + (data.vehicleModel ? ' ' + data.vehicleModel : '') + (data.vehicleYear ? ' (' + data.vehicleYear + ')' : ''),
        services: data.selectedServices || '',
        totalPrice: data.totalPrice || '0',
        notes: data.notes || ''
      };
      
      // Store the data as a JSON string
      PropertiesService.getScriptProperties().setProperty(customerId, JSON.stringify(customerData));
      
      // Calculate the follow-up date
      var followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + daysToFollowUp);
      
      // Create a trigger to send a follow-up email
      ScriptApp.newTrigger('sendFollowUpEmail')
        .timeBased()
        .at(followUpDate)
        .create()
        .setDescription(customerId);
      
      return true;
    } catch (error) {
      Logger.log('Error scheduling follow-up: ' + error);
      return false;
    }
  }
  
  // Send a follow-up email
  function sendFollowUpEmail(e) {
    // Get the trigger ID and customer ID
    var triggerId = e.triggerUid;
    var trigger = ScriptApp.getProjectTriggers().find(t => t.getUniqueId() === triggerId);
    
    if (!trigger) return;
    
    var customerId = trigger.getDescription();
    if (!customerId.startsWith('followup_')) return;
    
    // Get the customer data
    var customerDataJson = PropertiesService.getScriptProperties().getProperty(customerId);
    if (!customerDataJson) return;
    
    var customerData = JSON.parse(customerDataJson);
    
    // Create the follow-up email
    var emailBody = '<h2>Follow-Up Reminder</h2>' +
      '<p>This is a reminder to follow up with the following customer who submitted a service request:</p>' +
      '<p><strong>Car Registration:</strong> ' + customerData.registration + '</p>' +
      '<p><strong>Phone:</strong> ' + customerData.phone + '</p>' +
      '<p><strong>Customer:</strong> ' + customerData.name + '</p>' +
      '<p><strong>Email:</strong> ' + customerData.email + '</p>' +
      '<p><strong>Vehicle:</strong> ' + customerData.vehicle + '</p>' +
      '<p><strong>Selected Services:</strong> ' + customerData.services + '</p>' +
      '<p><strong>Total Price:</strong> £' + customerData.totalPrice + '</p>' +
      '<p><strong>Submitted:</strong> ' + new Date(customerData.timestamp).toLocaleString() + '</p>' +
      '<p>Please contact the customer if you haven\'t already done so.</p>';
    
    // Send the email
    var businessEmail = Session.getEffectiveUser().getEmail();
    MailApp.sendEmail({
      to: businessEmail,
      subject: 'Follow-Up Reminder - ' + customerData.registration + ' - ' + customerData.name,
      htmlBody: emailBody
    });
    
    // Delete the trigger and customer data
    ScriptApp.deleteTrigger(trigger);
    PropertiesService.getScriptProperties().deleteProperty(customerId);
  }
  
  // Validate form data
  function validateFormData(data) {
    var errors = [];
    
    // Check required fields
    if (!data.phone) errors.push('Phone number is required');
    if (!data.carRegistration) errors.push('Car registration is required');
    
    // Validate phone format (simple check for digits)
    if (data.phone && !/^[0-9\s\+\-\(\)]+$/.test(data.phone)) {
      errors.push('Phone number format is invalid');
    }
    
    // Validate email format if provided
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.push('Email format is invalid');
    }
    
    // Validate UK car registration (simple check)
    if (data.carRegistration && !/^[A-Z0-9 ]{2,8}$/i.test(data.carRegistration)) {
      errors.push('Car registration format is invalid');
    }
    
    return errors;
  }
  
  // Update status functions
  function updateSelectedRowsStatus(status) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var selection = sheet.getSelection();
    var ranges = selection.getActiveRangeList().getRanges();
    
    if (ranges.length === 0) {
      SpreadsheetApp.getUi().alert('Please select at least one row to update.');
      return;
    }
    
    // Get the status column index (12th column)
    var statusColumn = 12;
    
    // Update each selected row
    for (var i = 0; i < ranges.length; i++) {
      var range = ranges[i];
      var startRow = range.getRow();
      var numRows = range.getNumRows();
      
      // Skip header row if selected
      if (startRow === 1) {
        startRow = 2;
        numRows--;
      }
      
      if (numRows > 0) {
        var statusRange = sheet.getRange(startRow, statusColumn, numRows, 1);
        var values = [];
        for (var j = 0; j < numRows; j++) {
          values.push([status]);
        }
        statusRange.setValues(values);
      }
    }
    
    // Show confirmation
    SpreadsheetApp.getUi().alert('Status updated to \'' + status + '\' for selected rows.');
  }
  
  // Mark selected rows as Contacted
  function markAsContacted() {
    updateSelectedRowsStatus('Contacted');
  }
  
  // Mark selected rows as Booked
  function markAsBooked() {
    updateSelectedRowsStatus('Booked');
  }
  
  // Mark selected rows as Completed
  function markAsCompleted() {
    updateSelectedRowsStatus('Completed');
  }
  
  // Mark selected rows as Cancelled
  function markAsCancelled() {
    updateSelectedRowsStatus('Cancelled');
  }
  
  // Handle GET requests (for testing)
  function doGet() {
    return HtmlService.createHtmlOutput(
      '<h1>Car Edition Pro Service Estimator API</h1>' +
      '<p>This is the endpoint for the service estimator form submissions.</p>' +
      '<p>Please use POST requests to submit form data.</p>'
    );
  }