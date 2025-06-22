// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { collections, dbConnect } from "@/lib/dbConnect";
import { getVehicleByRegistration } from "@/services/vehicleApi";
import { ObjectId } from "mongodb";
interface services extends Document {
  _id: ObjectId;
  name?: string;
  description: string;
  basePrice: string;

}
export async function GET() {
  try {
    const bookingsCollection = await dbConnect(collections.bookings);
const servicesCollection = dbConnect<services>(collections.services);
    // Get counts for different statuses
    const totalNewRequest = await bookingsCollection.countDocuments({ status: "New Request" });
    const totalCompleted = await bookingsCollection.countDocuments({ status: "Completed" });
    const totalWaitingResponse = await bookingsCollection.countDocuments({ status: "Waiting Response" });
    const totalCancelledJons = await bookingsCollection.countDocuments({ status: "Cancelled Jobs" });

    // Get recent bookings
    const recentBookings = await bookingsCollection.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 }
    ]).toArray();
   const enhancedBookings = await Promise.all(
      recentBookings.map(async (booking: any) => {
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
      totalNewRequest,
      totalCompleted,
      totalWaitingResponse,
      totalCancelledJons
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings data" },
      { status: 500 }
    );
  }
}