import { NextRequest, NextResponse } from 'next/server';

// DVLA Vehicle Enquiry Service API configuration
const API_KEY = '9ZHydbY7cj4qMAYGTDobqazRuY8tRyDX4hbS3sT7';
const API_URL = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles';

/**
 * API route handler for vehicle lookup
 * Acts as a proxy to the DVLA Vehicle Enquiry Service API
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the registration number
    const body = await request.json();
    const { registrationNumber } = body;
    
    // Validate the registration number
    if (!registrationNumber) {
      return NextResponse.json(
        { error: 'Registration number is required' },
        { status: 400 }
      );
    }
    
    // Clean up registration number (remove spaces, convert to uppercase)
    const cleanRegNumber = registrationNumber.replace(/\s+/g, '').toUpperCase();
    
    // Make the API call to the Vehicle Enquiry Service
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        registrationNumber: cleanRegNumber
      })
    });
    
    // Get the response data
    const data = await response.json();
    
    // Handle API errors
    if (!response.ok) {
      console.error('Vehicle API error:', { status: response.status, data });
      
      // Return appropriate error response based on status code
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Vehicle not found with that registration' },
          { status: 404 }
        );
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid registration format' },
          { status: 400 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests, please try again later' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `API error (${response.status})` },
          { status: response.status }
        );
      }
    }
    
    // Transform the API response to match our expected format
    // Based on the DVLA API documentation
    const vehicleDetails = {
      registrationNumber: data.registrationNumber,
      make: data.make || 'Unknown',
      // Note: DVLA API doesn't provide model directly, we'll need to handle this separately
      model: 'Not provided by DVLA', 
      color: data.colour || 'Unknown',
      fuelType: data.fuelType || 'Unknown',
      engineCapacity: data.engineCapacity || 0,
      yearOfManufacture: data.yearOfManufacture || 0,
      taxStatus: data.taxStatus || 'Unknown',
      motStatus: data.motStatus || 'Unknown',
      monthOfFirstRegistration: data.monthOfFirstRegistration || '',
      wheelplan: data.wheelplan || '',
      typeApproval: data.typeApproval || '',
      revenueWeight: data.revenueWeight || 0,
      euroStatus: data.euroStatus || '',
      co2Emissions: data.co2Emissions || 0,
      markedForExport: data.markedForExport || false,
      dateOfLastV5CIssued: data.dateOfLastV5CIssued || '',
      // Additional fields from the documentation
      taxDueDate: data.taxDueDate || '',
      artEndDate: data.artEndDate || '',
      realDrivingEmissions: data.realDrivingEmissions || ''
    };
    
    // Return successful response with vehicle details
    return NextResponse.json(vehicleDetails);
    
  } catch (error) {
    console.error('Error in vehicle lookup API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
