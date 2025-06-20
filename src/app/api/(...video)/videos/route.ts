

import { collections, dbConnect } from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

const videosCollection = dbConnect(collections.videos);

export async function POST(req :NextRequest) {

  try {
    const formInfo = await req.json();
    const result = await videosCollection.insertOne({ ...formInfo, createdAt : new Date() });
    return NextResponse.json(result, { status: 201 }); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create admission" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {

  try {
    const result = await videosCollection.find({}).sort({ date: 1 }).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json({ error: "Failed to fetch admissions" }, { status: 500 });
  }
}
