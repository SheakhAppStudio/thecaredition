import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('API route: Received request to submit service request');
    
    // Parse the request body
    const data = await request.json();
    console.log('API route: Parsed request data:', data);
    
    // Validate required fields
    if (!data.phone) {
      console.error('API route: Missing phone number');
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!data.carRegistration) {
      console.error('API route: Missing car registration');
      return NextResponse.json(
        { error: 'Car registration is required' },
        { status: 400 }
      );
    }
    
    // Format data for Google Sheets
    const formattedData = {
      timestamp: new Date().toISOString(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      carRegistration: data.carRegistration,
      vehicleMake: data.vehicleMake || '',
      vehicleModel: data.vehicleModel || '',
      vehicleYear: data.vehicleYear || '',
      selectedServices: data.selectedServices || '',
      totalPrice: data.totalPrice || 0,
      notes: data.notes || '',
      status: 'New' // Default status for new requests
    };
    
    console.log('API route: Formatted data for Google Sheets:', formattedData);
    
    // Send data to Google Apps Script - using URLSearchParams for compatibility
    const params = new URLSearchParams();
    params.append('data', JSON.stringify(formattedData));
    
    console.log('API route: Sending data to Google Apps Script');
    
    // Use the latest Google Apps Script URL
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbw8fi4RazRsJF4CFF7yISdXTm8pafuPygE-ItOHQIVXdL5tvxImxAppQ_SQVlCy6_Q0/exec';
    console.log('API route: Google Apps Script URL:', googleScriptUrl);
    
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    console.log('API route: Google Apps Script response status:', response.status);
    
    // Try to log the response body if possible
    let responseText = '';
    try {
      responseText = await response.text();
      console.log('API route: Google Apps Script response:', responseText);
    } catch (err) {
      console.log('API route: Could not read response body');
    }
    
    // Return success response with the Google Apps Script response
    return NextResponse.json({ 
      success: true,
      googleResponse: responseText
    });
    
  } catch (error) {
    console.error('API route: Error submitting service request:', error);
    return NextResponse.json(
      { error: 'Failed to submit service request: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
