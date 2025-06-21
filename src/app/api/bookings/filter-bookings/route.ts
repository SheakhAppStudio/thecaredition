import { NextRequest, NextResponse } from "next/server";
import { collections, dbConnect } from "@/app/lib/dbConnect";

interface Booking {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    registrationNumber: string;
    make: string;
    model: string;
  };
  services: {
    _id: string;
    name: string;
    basePrice: number;
  }[];
  totalPrice: number;
  status: string;
  createdAt: Date;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");


    const bookingsCollection = dbConnect(collections.bookings);
    const servicesCollection = dbConnect(collections.services);

    // Build query
    const query: any = {};
    if (status) query.status = status;

    if (searchTerm) {
      // Check if text index exists
      const indexes = await bookingsCollection.indexes();
      const hasTextIndex = indexes.some(index => index.name === "booking_search_text");
      
      if (hasTextIndex) {
        query.$text = { $search: searchTerm };
      } else {
        // Fallback to regex if text index doesn't exist
        query.$or = [
          { "customer.name": { $regex: searchTerm, $options: "i" } },
          { "customer.email": { $regex: searchTerm, $options: "i" } },
          { "customer.phone": { $regex: searchTerm, $options: "i" } },
          { "vehicle.registrationNumber": { $regex: searchTerm, $options: "i" } },
          { "vehicle.make": { $regex: searchTerm, $options: "i" } },
          { "vehicle.model": { $regex: searchTerm, $options: "i" } }
        ];
      }
    }

    // Get total count (optimized)
    const totalPromise = bookingsCollection.countDocuments(query);

    // Get paginated results with services lookup
    const bookingsPromise = bookingsCollection.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "services",
          localField: "serviceIds",
          foreignField: "_id",
          as: "services"
        }
      },
      {
        $project: {
          "customer.name": 1,
          "customer.email": 1,
          "customer.phone": 1,
          "vehicle.registrationNumber": 1,
          "vehicle.make": 1,
          "vehicle.model": 1,
          "services.name": 1,
          "services.basePrice": 1,
          totalPrice: 1,
          status: 1,
          createdAt: 1
        }
      }
    ]).toArray();

    const [total, bookings] = await Promise.all([totalPromise, bookingsPromise]);

    return NextResponse.json({
      data: bookings.map(booking => ({
        ...booking,
        _id: booking._id.toString(),
        services: booking.services?.map((service: any) => ({
          ...service,
          _id: service._id.toString()
        })) || []
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings data" },
      { status: 500 }
    );
  }
}

