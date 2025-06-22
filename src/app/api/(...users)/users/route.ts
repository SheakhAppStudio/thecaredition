
import { NextRequest, NextResponse } from 'next/server';
import  { dbConnect, collections } from "@/lib/dbConnect";
import { authorizationCheck } from '@/lib/authorization';


// GET method to fetch all users
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
    // Fetch all users from the database
    const users = await dbConnect(collections.users).find().toArray();

    if (users && users.length > 0) {
      return NextResponse.json(users, { status: 200 });
    } else {
      return NextResponse.json(
        { message: 'No users found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users.' },
      { status: 500 }
    );
  }
}
