import { authorizationCheck } from "@/lib/authorization";
import { collections, dbConnect } from "@/lib/dbConnect";
import { getVehicleByRegistration } from "@/services/vehicleApi";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface Booking extends Document {
  _id: ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: string;
  serviceIds: ObjectId[];
  otherService: string;
  totalPrice: number;
  status: string;
  createdAt?: Date;
}

interface VehicleDetails {
  registrationNumber: string;
  make: string;
  model: string;
  color: string;
  fuelType: string;
  engineCapacity: number;
  yearOfManufacture: number;
  [key: string]: any; // For additional properties
}

const bookingsCollection = await dbConnect<Booking>(collections.bookings);

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

export async function GET(req: NextRequest) {
  const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
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
          { "vehicle": { $regex: searchRegex } }
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
            "vehicle": 1,
            status: 1,
            createdAt: 1
          }
        }
      ]).toArray()
    ]);

    // Group by customer and collect unique vehicles
    const customerMap = new Map<string, {
      name: string;
      email: string;
      phone: string;
      vehicles: Map<string, VehicleDetails>; // Using Map to ensure unique registration numbers
    }>();

    // Process bookings and fetch vehicle details
    for (const booking of bookings) {
      const key = `${booking.customer.email}`.toLowerCase(); // Using email as unique identifier
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
          vehicles: new Map()
        });
      }

      const customerEntry = customerMap.get(key);
      
      if (booking.vehicle && customerEntry) {
        try {
          const cleanReg = booking.vehicle.replace(/\s+/g, '').toUpperCase();
          
          // Only fetch vehicle details if we haven't seen this registration before
          if (!customerEntry.vehicles.has(cleanReg)) {
            const vehicleData = await getVehicleByRegistration(cleanReg);
            if (vehicleData?.registrationNumber) {
              customerEntry.vehicles.set(cleanReg, vehicleData);
            }
          }
        } catch (error) {
          console.error(`Error fetching vehicle details for ${booking.vehicle}:`, error);
        }
      }
    }

    // Convert to final output format
    const customersWithVehicles = Array.from(customerMap.values()).map(customer => ({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      vehicles: Array.from(customer.vehicles.values())
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