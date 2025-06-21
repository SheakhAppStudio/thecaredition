

import { collections, dbConnect } from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

const shopsCollection = dbConnect(collections.shops);

export async function POST(req :NextRequest) {

  try {
    const formInfo = await req.json();
    const shopCount = await shopsCollection.countDocuments()
    const result = await shopsCollection.insertOne({ ...formInfo, createdAt : new Date(), productNumber : `CE${shopCount + 1 < 10 && `0`}${shopCount+1}` });
    return NextResponse.json(result, { status: 201 }); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create admission" }, { status: 500 });
  }
}

export async function GET() {

  try {
    const result = await shopsCollection.find({}).sort({ createdAt: 1 }).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json({ error: "Failed to fetch admissions" }, { status: 500 });
  }
}
