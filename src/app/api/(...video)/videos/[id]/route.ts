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
const videosCollection = dbConnect<Admission>(collections.videos);


// GET — fetch admission by ID with related data
export async function GET(req: NextRequest) {

  try {
    const id = req.nextUrl.pathname.split("/").pop();

  const video = await videosCollection.findOne({ _id: new ObjectId(id) });


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
    const admission = await videosCollection.findOne(filter);
    console.log(update,id)
    if (!admission) {
      return NextResponse.json({ error: "Insittue not found" }, { status: 404 });
    }

    const updateDoc = {
      $set: {
          title: update.title, // "name"
          description: update.description, // "fathersOrHusbandName" mapped to "fatherName"
          videoYoutubeLink: update.videoYoutubeLink, // "maritalStatus" mapped to "marital"
          videoEmbedLink: update.videoEmbedLink, // "nationalId"
          videoThumbnail: update.videoThumbnail, // "mobile" mapped to "telPersonal"
         
      }
    };

    const result = await videosCollection.updateOne(filter, updateDoc);
    console.log(result)
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
 

    const result = await videosCollection.deleteOne(filter );
    // const result = {deletedCount : 1}
    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "video marked as deleted",...result }, { status: 200 });
    } else {
      return NextResponse.json({ error: "video not found or already deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ error: "An error occurred while deleting the video." }, { status: 500 });
  }
}
