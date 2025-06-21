import { collections, dbConnect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "next/server";


// Define interfaces for your collections
interface Admission extends Document {
  _id: ObjectId;
  studentPhoto?: string;
  studentName: string;

}






// Connect collections with types
const blogsCollection = dbConnect<Admission>(collections.blogs);


// GET — fetch admission by ID with related data
export async function GET(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

  
  

  const video = await blogsCollection.findOne({ _id: new ObjectId(id) });


    return NextResponse.json(video, { status: 200 });

  } catch (error) {
    console.error("Error fetching admission with related data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admission with related data" }, 
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
    const admission = await blogsCollection.findOne(filter);

    if (!admission) {
      return NextResponse.json({ error: "Insittue not found" }, { status: 404 });
    }

    const updateDoc = {
      $set: {
          title: update.title, // "name"
          content: update.content, // "fathersOrHusbandName" mapped to "fatherName"
          imageUrl: update.imageUrl, // "maritalStatus" mapped to "marital"

      }
    };

    const result = await blogsCollection.updateOne(filter, updateDoc);
    return NextResponse.json({ message: "admission updated successfully", ...result }, { status: 200 });
  } catch (error) {
    console.error("Error updating admission:", error);
    return NextResponse.json({ error: "Failed to update admission" }, { status: 500 });
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
 

    const result = await blogsCollection.deleteOne(filter );

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "admission marked as deleted" ,...result}, { status: 200 });
    } else {
      return NextResponse.json({ error: "admission not found or already deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting admission:", error);
    return NextResponse.json({ error: "An error occurred while deleting the admission." }, { status: 500 });
  }
}
