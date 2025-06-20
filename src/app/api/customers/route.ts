import { collections, dbConnect } from "@/app/lib/dbConnect";
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
          { "customer.phone": { $regex: searchRegex } }
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
            status: 1,
            createdAt: 1
          }
        }
      ]).toArray()
    ]);

    // Deduplicate customers
    const uniqueCustomers = Array.from(
      new Map(
        bookings.map(booking => [
          `${booking.customer.name}-${booking.customer.email}-${booking.customer.phone}`,
          booking.customer
        ])
      ).values()
    );

    return NextResponse.json({
      data: uniqueCustomers,
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