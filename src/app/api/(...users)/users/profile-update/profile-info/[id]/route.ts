import { ObjectId } from "mongodb";
import { dbConnect, collections } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { authorizationCheck } from "@/lib/authorization";

interface User extends Document {
  _id: ObjectId;
  name?: string;
  mobile?: string;
  email?: string;
  role?: string;
  adminPhoto?: string | string[] | null;
  permissions?: string[];
  instituteId?: string;
  password?: string;
}

const usersCollection = dbConnect<User>(collections.users);

export async function PATCH(req: NextRequest) {
  const referer = req.headers.get('referer') || '';
  const refererPath = new URL(referer).pathname;
  
  // Authorization check
  const authResult = await authorizationCheck(refererPath);
  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    // Extract ID from URL
    const id = req.nextUrl.pathname.split("/").pop();
    
    // Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid or missing user ID" }, 
        { status: 400 }
      );
    }

    // Parse and validate update data
    const update = await req.json();
    if (!update || Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    const filter = { _id: new ObjectId(id) };
    
    // Check if user exists
    const user = await usersCollection.findOne(filter);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Email uniqueness check (only if email is being updated)
    if (update.email && update.email !== user.email) {
      const existingUser = await usersCollection.findOne({ email: update.email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists, please use a different email" },
          { status: 409 } // 409 Conflict is more appropriate for duplicate resources
        );
      }
    }
    
    const updateDoc = {
      $set: {
          name: update.name, // "name"
          email: update.email,
          adminPhoto: update.adminPhoto,
          mobile: update.mobile,
      }
    };

    // Perform update if there are valid fields to update
    if (Object.keys(updateDoc).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const result = await usersCollection.updateOne(
      filter, 
      updateDoc
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No changes were made to the user" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", result },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}