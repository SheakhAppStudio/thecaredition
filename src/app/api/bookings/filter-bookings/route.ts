import { NextRequest, NextResponse } from "next/server";
import { collections, dbConnect } from "@/lib/dbConnect";
import { authorizationCheck } from "@/lib/authorization";
import { getVehicleByRegistration } from "@/services/vehicleApi";
import { ObjectId } from "mongodb";
// Define interfaces for your collections
interface services extends Document {
  _id: ObjectId;
  name?: string;
  description: string;
  basePrice: string;

}

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
    const status = searchParams.get("status") || "";
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const bookingsCollection = dbConnect(collections.bookings);
    const servicesCollection = dbConnect<services>(collections.services);

    // Build query
    const query: any = {};
    if (status) query.status = status;

    if (searchTerm) {
      const indexes = await bookingsCollection.indexes();
      const hasTextIndex = indexes.some(index => index.name === "booking_search_text");
      
      if (hasTextIndex) {
        query.$text = { $search: searchTerm };
      } else {
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

    // Get total count
    const totalPromise = bookingsCollection.countDocuments(query);

    // Get paginated results
    const bookingsPromise = bookingsCollection.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          "customer": 1,
          "vehicle": 1,
          "serviceIds": 1,
          "totalPrice": 1,
          "status": 1,
          "createdAt": 1
        }
      }
    ]).toArray();

    const [total, bookings] = await Promise.all([totalPromise, bookingsPromise]);

    // Enhance bookings with vehicle data and services
    const enhancedBookings = await Promise.all(
      bookings.map(async (booking: any) => {
        try {
          // Get vehicle data
          const cleanReg = booking?.vehicle?.replace(/\s+/g, '').toUpperCase().toString();
          const vehicleData = await getVehicleByRegistration(cleanReg);

          // Get services data
          let services : services[] = [];
          if (booking.serviceIds && booking.serviceIds.length > 0) {
            const serviceIds = booking.serviceIds.map((id: string) => new ObjectId(id));
            services = await servicesCollection.find({
              _id: { $in: serviceIds }
            }).toArray();
          }

          return {
            ...booking,
            _id: booking._id.toString(),
            vehicle: {
              ...vehicleData
            },
            services: services.map((service: any) => ({
              ...service,
              _id: service._id.toString()
            }))
          };
        } catch (error) {
          console.error(`Error enhancing booking ${booking._id}:`, error);
          // Return basic booking data if enhancement fails
          return {
            ...booking,
            _id: booking._id.toString(),
            services: []
          };
        }
      })
    );

    return NextResponse.json({
      data: enhancedBookings,
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