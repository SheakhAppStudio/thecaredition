import { NextResponse } from 'next/server';
import { collections, dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
  
    
    const { ids } = await req.json();
    
    // if (!ids || !Array.isArray(ids)) {
    //   return NextResponse.json(
    //     { error: 'Invalid service IDs provided' },
    //     { status: 400 }
    //   );
    // }

    // Convert string IDs to MongoDB ObjectId
    const objectIds = ids.map((id :string) => new ObjectId(id));

    // Fetch services that match any of the provided IDs
    const services = await dbConnect(collections?.services).find({
      _id: { $in: objectIds }
    }).project({
      _id: 1,
      name: 1,
      description: 1,
      basePrice: 1
    }).toArray();

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}