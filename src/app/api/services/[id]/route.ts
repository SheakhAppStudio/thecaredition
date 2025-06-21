import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "next/server";


// Define interfaces for your collections
interface services extends Document {
  _id: ObjectId;
  name?: string;
  description: string;
  basePrice: string;

}






// Connect collections with types
const servicesCollection = dbConnect<services>(collections.services);


// GET — fetch services by ID with related data
export async function GET(req: NextRequest) {

  try {
      const id = req.nextUrl.pathname.split("/").pop();
  
    const video = await servicesCollection.findOne({ _id: new ObjectId(id) });
  
  
      return NextResponse.json(video, { status: 200 });
    
  
  
    }  catch (error) {
    console.error("Error fetching services with related data:", error);
    return NextResponse.json(
      { error: "Failed to fetch services with related data" }, 
      { status: 500 }
    );
  }
}

// PATCH — update student details
export async function PATCH(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
    const update = await req.json();
    const services = await servicesCollection.findOne(filter);

    if (!services) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const updateDoc = {
      $set: {
          name: update.name, // "name"
          description: update.description, // "fathersOrHusbandName" mapped to "fatherName"
          basePrice: update.basePrice, // "maritalStatus" mapped to "marital"

     
      }
    };

    const result = await servicesCollection.updateOne(filter, updateDoc);
    return NextResponse.json({ message: "services updated successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error updating services:", error);
    return NextResponse.json({ error: "Failed to update services" }, { status: 500 });
  }
}

// DELETE — soft delete by marking as "deleted"
export async function DELETE(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
 

    const result = await servicesCollection.deleteOne(filter );

    if (result.deletedCount > 0) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "services not found or already deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting services:", error);
    return NextResponse.json({ error: "An error occurred while deleting the services." }, { status: 500 });
  }
}
