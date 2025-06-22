import { ObjectId } from "mongodb";
import{ dbConnect,  collections } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { authorizationCheck } from "@/lib/authorization";

// Connect collections
const usersCollection = dbConnect(collections.users);


// GET — fetch admission by ID
export async function GET(req: NextRequest) {
  const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Pass referer path to authorization check
  const authResult = await authorizationCheck(refererPath);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const users = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!users) {
      return NextResponse.json({ error: "users not found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch userss" }, { status: 500 });
  }
}

// PATCH — update student details
export async function PATCH(req: NextRequest) {
  const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Pass referer path to authorization check
  const authResult = await authorizationCheck(refererPath);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
    const update = await req.json();
    const users = await usersCollection.findOne(filter);

    if (!users) {
      return NextResponse.json({ error: "Insittue not found" }, { status: 404 });
    }
  
    const updateDoc = {
      $set: {
          name: update.name, // "name"
          email: update.email, // "name"
          adminPhoto: update.adminPhoto, // "fathersOrHusbandName" mapped to "fatherName"
          mobile: update.mobile, // "maritalStatus" mapped to "marital"
          permissions: update.permissions, // "nationalId"


      }
    };

    const result = await usersCollection.updateOne(filter, updateDoc);
    return NextResponse.json({ message: "users updated successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error updating users:", error);
    return NextResponse.json({ error: "Failed to update users" }, { status: 500 });
  }
}

// DELETE — soft delete by marking as "deleted"
export async function DELETE(req: NextRequest) {
  const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Pass referer path to authorization check
  const authResult = await authorizationCheck(refererPath);
  
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const filter = { _id: new ObjectId(id) };
 

    const result = await usersCollection.deleteOne(filter);

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "users marked as deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "users not found or already deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json({ error: "An error occurred while deleting the users." }, { status: 500 });
  }
}
