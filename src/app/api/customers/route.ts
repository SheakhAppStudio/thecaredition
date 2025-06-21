import { authorizationCheck } from "@/lib/authorization";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface Booking extends Document {
  _id: ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    registrationNumber: string;
    make: string;
    model: string;
    yearOfManufacture: number;
  };
  serviceIds: ObjectId[];
  services?: Service[];
  otherService: string;
  totalPrice: number;
  status: string;
  createdAt?: Date;
}

interface Service {
  _id: ObjectId;
  name: string;
  description: string;
  basePrice: number;
  category?: string;
  duration?: number;
}

const bookingsCollection = dbConnect<Booking>(collections.bookings);

// Create indexes when the module loads (run once)
async function createIndexes() {
  try {
    await bookingsCollection.createIndex({
      "customer.name": "text",
      "customer.email": "text",
      "customer.phone": "text"
    });
    await bookingsCollection.createIndex({ createdAt: -1 });
    console.log("Indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

// Run index creation
createIndexes();

export async function POST(req: NextRequest) {
    const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Pass referer path to authorization check
  const authResult = await authorizationCheck(refererPath);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const formInfo = await req.json();
    const result = await bookingsCollection.insertOne({ 
      ...formInfo, 
      isCertified: "student", 
      createdAt: new Date() 
    });
    return NextResponse.json(result, { status: 201 }); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Pass referer path to authorization check
  const authResult = await authorizationCheck(refererPath);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query with text search if available, fallback to regex
    const query: any = {};
    if (searchTerm) {
      const indexes = await bookingsCollection.indexes();
      const hasTextIndex = indexes.some(index => index.name === "customer.name_text_customer.email_text_customer.phone_text");
      
      if (hasTextIndex) {
        query.$text = { $search: searchTerm };
      } else {
        const searchRegex = new RegExp(searchTerm, 'i');
        query.$or = [
          { "customer.name": { $regex: searchRegex } },
          { "customer.email": { $regex: searchRegex } },
          { "customer.phone": { $regex: searchRegex } },
          { "vehicle.registrationNumber": { $regex: searchRegex } }
        ];
      }
    }

    // Execute both queries in parallel
    const [total, bookings] = await Promise.all([
      bookingsCollection.countDocuments(query),
      bookingsCollection.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            "customer.name": 1,
            "customer.email": 1,
            "customer.phone": 1,
            "vehicle.registrationNumber": 1,
            status: 1,
            createdAt: 1
          }
        }
      ]).toArray()
    ]);

    // Group by customer and collect all vehicle registration numbers
    const customerMap = new Map();
    
    bookings.forEach(booking => {
      const key = `${booking.customer.name}-${booking.customer.email}-${booking.customer.phone}`;
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
          vehicles: new Set()
        });
      }
      
      // Add vehicle registration number if it exists
      if (booking.vehicle?.registrationNumber) {
        customerMap.get(key).vehicles.add(booking.vehicle.registrationNumber);
      }
    });

    // Convert Set to array for each customer
    const customersWithVehicles = Array.from(customerMap.values()).map(customer => ({
      ...customer,
      vehicles: Array.from(customer.vehicles)
    }));

    return NextResponse.json({
      data: customersWithVehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching customer info:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer info" }, 
      { status: 500 }
    );
  }
}