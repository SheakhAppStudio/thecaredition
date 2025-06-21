/**
 * Google Apps Script for Car Edition Pro Service Estimator
 * This script handles form submissions from the service estimator page
 * and logs them to a Google Spreadsheet
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
    console.error('Error processing form submission: ' + error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Error processing form: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function that can be run manually to verify spreadsheet access
function testSpreadsheetAccess() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    var testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '07700900000',
      carRegistration: 'AB12 CDE',
      vehicleMake: 'Test Make',
      vehicleModel: 'Test Model',
      vehicleYear: 2020,
      selectedServices: ['Test Service 1', 'Test Service 2'],
      totalPrice: 100,
      notes: 'This is a test entry',
      timestamp: new Date().toISOString()
    };
    
    logToSpreadsheet(testData);
    return 'Test successful! Check your spreadsheet for a new test entry.';
  } catch (error) {
    return 'Test failed: ' + error.toString();
  }
}

// Log the form data to the spreadsheet
function logToSpreadsheet(data) {
  try {
    // Log the data being processed
    Logger.log('Logging data to spreadsheet: ' + JSON.stringify(data));
    
    // Get the active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    
    // If we can't get the active sheet, try to create one
    if (!sheet) {
      Logger.log('No active sheet found, creating a new one');
      sheet = spreadsheet.insertSheet('Service Requests');
    }
    
    // Check if headers exist, if not, create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Car Registration',
        'Phone',
        'Email',
        'Name',
        'Vehicle Make',
        'Vehicle Model',
        'Vehicle Year',
        'Selected Services',
        'Total Price',
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
      sheet.setColumnWidth(2, 120);  // Car Registration
      sheet.setColumnWidth(3, 120);  // Phone
      sheet.setColumnWidth(4, 180);  // Email
      sheet.setColumnWidth(5, 150);  // Name
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
    
    // Insert the form data at row 2 to keep new entries at the top
    sheet.insertRow(2);
    sheet.getRange(2, 1, 1, 13).setValues([
      [new Date(), // Current timestamp
      data.carRegistration,
      data.phone,
      data.email,
      data.name,
      data.vehicleMake,
      data.vehicleModel,
      data.vehicleYear,
      servicesString,
      '£' + data.totalPrice,
      data.notes,
      'New', // Initial status
      ''
    ]);
    
    // Format the spreadsheet for better readability
    formatSpreadsheet();
    
    // Add conditional formatting for the status column
    var lastRow = sheet.getLastRow();
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
    
    // Send email notification
    sendEmailNotification(data);
    
    // Return success
    return true;
    : data.selectedServices;
  
  // Append the form data to the spreadsheet
  sheet.appendRow([
    new Date(), // Current timestamp
    data.name,
    data.email,
    data.phone,
    data.carRegistration,
    data.vehicleMake,
    data.vehicleModel,
    data.vehicleYear,
    servicesString,
    '£' + data.totalPrice,
    data.notes,
    'New' // Initial status
  ]);
  
  // Format the spreadsheet for better readability
  formatSpreadsheet();
  
  // Add conditional formatting for the status column
  var lastRow = sheet.getLastRow();
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
  
  // Send email notification
  sendEmailNotification(data);
  
  // Return success
  return true;
  } catch (error) {
    Logger.log('Error logging data to spreadsheet: ' + error.toString());
    // Try to log the error to the spreadsheet
    try {
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      var errorSheet = spreadsheet.getSheetByName('Errors') || spreadsheet.insertSheet('Errors');
      
      if (errorSheet.getLastRow() === 0) {
        errorSheet.appendRow(['Timestamp', 'Error', 'Data']);
        errorSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f4cccc');
      }
      
      errorSheet.appendRow([
        new Date(),
        error.toString(),
        JSON.stringify(data)
      ]);
    } catch (e) {
      Logger.log('Failed to log error: ' + e.toString());
    }
    
    throw error;
  }
}

// Send email notification about the new service request
function sendEmailNotification(data) {
  // Configure these email addresses for your business
  var businessEmail = Session.getEffectiveUser().getEmail(); // Default to the script owner's email
  var ccEmails = []; // Add additional emails to CC here
  
  // Format the selected services as a list
  var servicesHtml = '<ul>';
  if (Array.isArray(data.selectedServices)) {
    data.selectedServices.forEach(function(service) {
      servicesHtml += '<li>' + service + '</li>';
    });
  } else {
    servicesHtml += '<li>' + data.selectedServices + '</li>';
  }
  servicesHtml += '</ul>';
  
  // Create the email body
  var emailBody = '<h2>New Service Request</h2>' +
    '<p><strong>Customer:</strong> ' + data.name + '</p>' +
    '<p><strong>Email:</strong> ' + data.email + '</p>' +
    '<p><strong>Phone:</strong> ' + data.phone + '</p>' +
    '<p><strong>Vehicle:</strong> ' + data.vehicleYear + ' ' + data.vehicleMake + ' ' + data.vehicleModel + '</p>' +
    '<p><strong>Registration:</strong> ' + data.carRegistration + '</p>' +
    '<p><strong>Selected Services:</strong></p>' + servicesHtml +
    '<p><strong>Total Price:</strong> £' + data.totalPrice + '</p>' +
    '<p><strong>Notes:</strong> ' + (data.notes || 'None') + '</p>' +
    '<p>Please contact the customer to confirm their booking.</p>';
  
  // Send the email
  MailApp.sendEmail({
    to: businessEmail,
    cc: ccEmails.join(','),
    replyTo: data.email,
    subject: 'New Service Request - ' + data.vehicleMake + ' ' + data.vehicleModel,
    htmlBody: emailBody
  });
}

// Handle GET requests (for testing)
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h1>Car Edition Pro Service Estimator API</h1>' +
    '<p>This is the endpoint for the service estimator form submissions.</p>' +
    '<p>Please use POST requests to submit form data.</p>'
  );
}

// Format the spreadsheet for better readability
function formatSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  // Only proceed if there's data in the sheet
  if (sheet.getLastRow() <= 1) return;
  
  // Auto-resize columns to fit content
  sheet.autoResizeColumns(1, 11);
  
  // Format the timestamp column
  var timestampRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
  timestampRange.setNumberFormat('dd/MM/yyyy HH:mm:ss');
  
  // Format the price column
  var priceRange = sheet.getRange(2, 10, sheet.getLastRow() - 1, 1);
  priceRange.setNumberFormat('£#,##0.00');
  
  // Add alternating row colors for readability
  var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11);
  var colors = [];
  for (var i = 0; i < sheet.getLastRow() - 1; i++) {
    colors.push(i % 2 === 0 ? '#ffffff' : '#f3f3f3');
  }
  dataRange.setBackgrounds(colors.map(color => Array(11).fill(color)));
  
  // Add borders
  dataRange.setBorder(true, true, true, true, true, true, '#d0d0d0', SpreadsheetApp.BorderStyle.SOLID);
}

// Schedule a follow-up reminder
function scheduleFollowUp(data, daysToFollowUp) {
  // Default to 2 days if not specified
  daysToFollowUp = daysToFollowUp || 2;
  
  // Create a trigger to send a follow-up email
  var followUpDate = new Date();
  followUpDate.setDate(followUpDate.getDate() + daysToFollowUp);
  
  // Store the customer data in PropertiesService
  var customerId = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty(
    'followup_' + customerId,
    JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      vehicle: data.vehicleYear + ' ' + data.vehicleMake + ' ' + data.vehicleModel,
      registration: data.carRegistration,
      services: Array.isArray(data.selectedServices) ? data.selectedServices.join(', ') : data.selectedServices,
      totalPrice: data.totalPrice,
      timestamp: new Date().toISOString()
    })
  );
  
  // Create a trigger to run at the follow-up time
  ScriptApp.newTrigger('sendFollowUpEmail')
    .timeBased()
    .at(followUpDate)
    .create()
    .setDescription('followup_' + customerId);
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
    '<p><strong>Customer:</strong> ' + customerData.name + '</p>' +
    '<p><strong>Email:</strong> ' + customerData.email + '</p>' +
    '<p><strong>Phone:</strong> ' + customerData.phone + '</p>' +
    '<p><strong>Vehicle:</strong> ' + customerData.vehicle + '</p>' +
    '<p><strong>Registration:</strong> ' + customerData.registration + '</p>' +
    '<p><strong>Selected Services:</strong> ' + customerData.services + '</p>' +
    '<p><strong>Total Price:</strong> £' + customerData.totalPrice + '</p>' +
    '<p><strong>Submitted:</strong> ' + new Date(customerData.timestamp).toLocaleString() + '</p>' +
    '<p>Please contact the customer if you haven\'t already done so.</p>';
  
  // Send the email
  var businessEmail = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({
    to: businessEmail,
    subject: 'Follow-Up Reminder - ' + customerData.name + ' (' + customerData.registration + ')',
    htmlBody: emailBody
  });
  
  // Delete the trigger and customer data
  ScriptApp.deleteTrigger(trigger);
  PropertiesService.getScriptProperties().deleteProperty(customerId);
}

// Validate form data
function validateFormData(data) {
  // Log the data being validated for debugging
  Logger.log('Validating data: ' + JSON.stringify(data));
  
  var errors = [];
  
  // Ensure data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format received');
    return errors;
  }
  
  // Check required fields
  if (!data.name) errors.push('Name is required');
  if (!data.email) errors.push('Email is required');
  if (!data.phone) errors.push('Phone number is required');
  if (!data.carRegistration) errors.push('Car registration is required');
  
  // Validate email format if present
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Email format is invalid');
  }
  
  // Validate phone format if present (simple check for digits)
  if (data.phone && !/^[0-9\s\+\-\(\)]+$/.test(data.phone)) {
    errors.push('Phone number format is invalid');
  }
  
  // Validate UK car registration if present (simple check)
  if (data.carRegistration && !/^[A-Z0-9 ]{2,8}$/i.test(data.carRegistration)) {
    errors.push('Car registration format is invalid');
  }
  
  // Log validation results
  Logger.log('Validation complete. Errors: ' + (errors.length > 0 ? JSON.stringify(errors) : 'None'));
  
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

// Generate a dashboard with statistics and charts
function generateDashboard() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = spreadsheet.getActiveSheet();
  
  // Check if dashboard sheet already exists, if so, delete it
  var dashboardSheet = spreadsheet.getSheetByName('Dashboard');
  if (dashboardSheet) {
    spreadsheet.deleteSheet(dashboardSheet);
  }
  
  // Create a new dashboard sheet
  dashboardSheet = spreadsheet.insertSheet('Dashboard');
  dashboardSheet.setTabColor('#4285f4');
  
  // Set up the dashboard layout
  dashboardSheet.setColumnWidth(1, 250);
  dashboardSheet.setColumnWidth(2, 250);
  dashboardSheet.setColumnWidth(3, 250);
  dashboardSheet.setColumnWidth(4, 250);
  
  // Add title
  dashboardSheet.getRange('A1:D1').merge()
    .setValue('Service Estimator Dashboard')
    .setFontSize(18)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setBackground('#4285f4')
    .setFontColor('white');
  
  // Add last updated timestamp
  dashboardSheet.getRange('A2:D2').merge()
    .setValue('Last updated: ' + new Date().toLocaleString())
    .setFontStyle('italic')
    .setHorizontalAlignment('center');
  
  // Calculate statistics
  var dataRange = dataSheet.getDataRange();
  var values = dataRange.getValues();
  
  // Skip header row
  if (values.length <= 1) {
    dashboardSheet.getRange('A4:D4').merge()
      .setValue('No data available yet.')
      .setHorizontalAlignment('center');
    return;
  }
  
  var totalRequests = values.length - 1;
  var totalValue = 0;
  var statusCounts = {
    'New': 0,
    'Contacted': 0,
    'Booked': 0,
    'Completed': 0,
    'Cancelled': 0
  };
  var vehicleMakes = {};
  var serviceTypes = {};
  
  // Process data
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    
    // Extract price (remove £ symbol and convert to number)
    var priceStr = row[9].toString().replace('£', '').trim();
    var price = parseFloat(priceStr) || 0;
    totalValue += price;
    
    // Count statuses
    var status = row[11] || 'New';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    
    // Count vehicle makes
    var make = row[5] || 'Unknown';
    vehicleMakes[make] = (vehicleMakes[make] || 0) + 1;
    
    // Count service types (split the comma-separated list)
    var services = row[8].toString().split(',');
    for (var j = 0; j < services.length; j++) {
      var service = services[j].trim();
      if (service) {
        serviceTypes[service] = (serviceTypes[service] || 0) + 1;
      }
    }
  }
  
  // Add summary statistics
  dashboardSheet.getRange('A4').setValue('Total Requests:').setFontWeight('bold');
  dashboardSheet.getRange('B4').setValue(totalRequests);
  
  dashboardSheet.getRange('A5').setValue('Total Value:').setFontWeight('bold');
  dashboardSheet.getRange('B5').setValue('£' + totalValue.toFixed(2));
  
  dashboardSheet.getRange('A6').setValue('Average Value:').setFontWeight('bold');
  dashboardSheet.getRange('B6').setValue('£' + (totalValue / totalRequests).toFixed(2));
  
  // Add status breakdown
  dashboardSheet.getRange('A8').setValue('Status Breakdown:').setFontWeight('bold');
  var statusRow = 9;
  for (var status in statusCounts) {
    dashboardSheet.getRange(statusRow, 1).setValue(status);
    dashboardSheet.getRange(statusRow, 2).setValue(statusCounts[status]);
    statusRow++;
  }
  
  // Create status chart
  var statusRange = dashboardSheet.getRange('A8:B' + (statusRow - 1));
  var statusChart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(statusRange)
    .setPosition(10, 1, 0, 0)
    .setOption('title', 'Service Requests by Status')
    .setOption('width', 400)
    .setOption('height', 300)
    .build();
  dashboardSheet.insertChart(statusChart);
  
  // Add popular services
  dashboardSheet.getRange('C4').setValue('Popular Services:').setFontWeight('bold');
  
  // Convert to array and sort by count
  var serviceArray = [];
  for (var service in serviceTypes) {
    serviceArray.push([service, serviceTypes[service]]);
  }
  serviceArray.sort(function(a, b) {
    return b[1] - a[1];  // Sort by count descending
  });
  
  // Display top 10 services
  var serviceLimit = Math.min(10, serviceArray.length);
  for (var i = 0; i < serviceLimit; i++) {
    dashboardSheet.getRange(i + 5, 3).setValue(serviceArray[i][0]);
    dashboardSheet.getRange(i + 5, 4).setValue(serviceArray[i][1]);
  }
  
  // Create services chart
  var servicesRange = dashboardSheet.getRange('C4:D' + (4 + serviceLimit));
  var servicesChart = dashboardSheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(servicesRange)
    .setPosition(10, 5, 0, 0)
    .setOption('title', 'Most Requested Services')
    .setOption('width', 500)
    .setOption('height', 300)
    .build();
  dashboardSheet.insertChart(servicesChart);
  
  // Activate the dashboard sheet
  dashboardSheet.activate();
  
  // Show confirmation
  SpreadsheetApp.getUi().alert('Dashboard generated successfully!');
}
