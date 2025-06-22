import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Chatbot API route: Received request to submit chat inquiry');
    
    // Parse the request body
    const data = await request.json();
    console.log('Chatbot API route: Parsed request data:', data);
    
    // Validate required fields
    if (!data.phone) {
      console.error('Chatbot API route: Missing phone number');
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!data.carRegistration) {
      console.error('Chatbot API route: Missing car registration');
      return NextResponse.json(
        { error: 'Car registration is required' },
        { status: 400 }
      );
    }
    
    // Format data for Google Sheets - using the same format as service estimator
    const formattedData = {
      timestamp: new Date().toISOString(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      carRegistration: data.carRegistration,
      vehicleMake: data.vehicleMake || '',
      vehicleModel: data.vehicleModel || '',
      vehicleYear: data.vehicleYear || '',
      selectedServices: data.query || '', // Use the query field for services
      totalPrice: 0, // No price calculation in chatbot
      notes: `Inquiry from chatbot: ${data.query || ''}`,
      status: 'New (Chat)' // Mark as coming from chat
    };
    
    console.log('Chatbot API route: Formatted data for Google Sheets:', formattedData);
    
    // Send data to Google Apps Script - using URLSearchParams for compatibility
    const params = new URLSearchParams();
    params.append('data', JSON.stringify(formattedData));
    
    console.log('Chatbot API route: Sending data to Google Apps Script');
    
    // Use the same Google Apps Script URL as the service estimator
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbw8fi4RazRsJF4CFF7yISdXTm8pafuPygE-ItOHQIVXdL5tvxImxAppQ_SQVlCy6_Q0/exec';
    console.log('Chatbot API route: Google Apps Script URL:', googleScriptUrl);
    
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    console.log('Chatbot API route: Google Apps Script response status:', response.status);
    
    // Try to log the response body if possible
    let responseText = '';
    try {
      responseText = await response.text();
      console.log('Chatbot API route: Google Apps Script response:', responseText);
    } catch (err) {
      console.log('Chatbot API route: Could not read response body');
    }
    
    // Return success response with the Google Apps Script response
    return NextResponse.json({ 
      success: true,
      googleResponse: responseText
    });
    
  } catch (error) {
    console.error('Chatbot API route: Error submitting chat inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit chat inquiry: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
