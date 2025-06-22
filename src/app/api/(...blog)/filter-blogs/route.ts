import { NextRequest, NextResponse } from "next/server";
import { collections, dbConnect } from "@/lib/dbConnect";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");


    const blogsCollection = dbConnect(collections.blogs);


    // Build query
    const query: any = {};
  
  if (searchTerm) {
      // Check if text index exists
      const indexes = await blogsCollection.indexes();
      const hasTextIndex = indexes.some(index => index.name === "booking_search_text");
      
      if (hasTextIndex) {
        query.$text = { $search: searchTerm };
      } else {
        // Fallback to regex if text index doesn't exist
        query.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { createdAt: { $regex: searchTerm, $options: "i" } },
        ];
      }
    }

    // Get total count (optimized)
    const totalPromise = blogsCollection.countDocuments(query);

    // Get paginated results with services lookup
    const bookingsPromise = blogsCollection.aggregate([
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]).toArray();
console.log(bookingsPromise)
    const [total, bookings] = await Promise.all([totalPromise, bookingsPromise]);
console.log({
      data: bookings,
      pagination: {
        page,
        limit,
        total : total,
        totalPages: Math.ceil(total / limit)
      }
    })
    return NextResponse.json({
      data: bookings,
      pagination: {
        page,
        limit,
        total : total,
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

