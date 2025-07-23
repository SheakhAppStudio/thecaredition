import { NextRequest, NextResponse } from "next/server";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

interface Service extends Document {
  _id: ObjectId;
  name: string;
  basePrice: number;
  description: string;
  createdAt?: Date;
}



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");



    const servicesCollection = await dbConnect<Service>(collections.services);

    // Build query
    const query: Record<string, any> = {};

    // Text search
    if (searchTerm.trim()) {
      const indexes = await servicesCollection.indexes();
      const hasTextIndex = indexes.some(index => 
        index.name === "name_text_description_text"
      );

      if (hasTextIndex) {
        query.$text = { $search: searchTerm };
      } else {
        query.$or = [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } }
        ];
      }
    }

 

    // Execute queries in parallel
    const [total, services] = await Promise.all([
      servicesCollection.countDocuments(query),
      servicesCollection.aggregate([
        { $match: query },
        { $sort:  { name: 1 } },
        { $skip: (Number(page) - 1) * Number(limit) },
        { $limit: Number(limit) },
        {
          $project: {
            name: 1,
            description: 1,
            basePrice: 1,
            createdAt: 1
          }
        }
      ]).toArray()
    ]);
console.log(page ,(page - 1) * limit, limit, total, services.length, services);
    // Format response
    const response = {
      data : services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services data" },
      { status: 500 }
    );
  }
}