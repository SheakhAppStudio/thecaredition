import  {dbConnect, collections } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Filter, Document } from "mongodb"; // ✅ Import Mongo types
import { authorizationCheck } from "@/lib/authorization";

interface users {
  name: string;
  fatherName: string;
  marital: string;
  nationalId: string;
  telPersonal: string;
  qualification: string;
  usersName: string;
  catgOrganization: string;
  position: string;
  telOffice: string;
  email: string;
  url: string;
  address: string;
  numberOfComputer: string;
  date: string;
  photo: string;
  tradeLic: string;
  profilePic: string;
  institutionIcon: string;
  roleId: string;
}



interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: users[];
}

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
  const usersCollection = dbConnect(collections.users);

  try {
    const {searchParams} = req.nextUrl;
    const name = searchParams.get("name") || "";
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = page * limit;
      
    const query: Filter<Document> = {};

   

    if (name) {
      const regex = { $regex: name, $options: "i" };
      if (!query.$and) {
        query.$and = [];
      }
    
      query.$and.push({
        $or: [
          { name: regex },
          { fatherName: regex }, // Added "fatherName"
          { marital: regex }, // Added "marital"
          { nationalId: regex }, // Added "nationalId"
          { qualification: regex }, // Added "qualification"
          { usersName: regex }, // Added "usersName"
          { position: regex }, // Added "position"
          { email: regex }, // Added "email"
          { address: regex }, // Added "address"
          { tradeLic: regex }, // Added "tradeLic"
        ]
      });
    }
    
    
    const insitutes = await usersCollection.aggregate<users>([
      { $match: query },
      { $sort: { date: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]).toArray();
console.log(insitutes)
    const totalCount = await usersCollection.countDocuments(query);

    const response: ApiResponse = {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: insitutes
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching insitutes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch insitutes data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
