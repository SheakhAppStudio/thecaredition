import { authorizationCheck } from "@/lib/authorization";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
interface Booking {
  _id: ObjectId;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    registrationNumber: string;
    make: string;
    model: string;
    yearOfManufacture: number;
  };
  serviceIds: ObjectId[];
  services?: Service[];
  otherService: string;
  totalPrice: number;
  status: string;
  createdAt?: string;
}

interface Service {
  _id: ObjectId;
  name: string;
  description: string;
  basePrice: number;
  category?: string;
  duration?: number;
}
    const bookingsCollection = dbConnect(collections.bookings);
    
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
    const admission = await bookingsCollection.findOne(filter);

    if (!admission) {
      return NextResponse.json({ error: "Bookings not found" }, { status: 404 });
    }

    const updateDoc = {
      $set: {
          status: update.status, // "name"  
      }
    };

    const result = await bookingsCollection.updateOne(filter, updateDoc);
    return NextResponse.json({ message: "admission updated successfully", result }, { status: 200 });
  } catch (error) {
    console.error("Error updating admission:", error);
    return NextResponse.json({ error: "Failed to update admission" }, { status: 500 });
  }
}