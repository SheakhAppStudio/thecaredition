import { authOptions } from "@/lib/authOptions";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

interface User {
  _id: ObjectId;
  name?: string;
  mobile?: string;
  email?: string;
  role?: string;
  profilePhoto?: string | string[] | null;
  password?: string;
}

// Define all admin routes that require protection
const ADMIN_ROUTES = [
  '/dashboard',
  '/dashboard/add-services',
  '/dashboard/services-list',
  '/dashboard/customer-directory',
  '/dashboard/bookings/new',
  '/dashboard/bookings/booked-services',
  '/dashboard/bookings/waiting-response',
  '/dashboard/bookings/completed',
  '/dashboard/bookings/cancelled-jobs',
  '/dashboard/add-shop',
  '/dashboard/shop-list',
  '/dashboard/add-blog',
  '/dashboard/blog-list',
  '/dashboard/add-video',
  '/dashboard/video-list',
  '/dashboard/settings'
];

// Define public routes that don't require admin privileges
const PUBLIC_ROUTES = [
  '/dashboard/profile',
  '/dashboard/settings',
  '/api/user/profile',
  '/api/notifications'
];

type AuthorizationResult = 
  | { success: true; user: Omit<User, 'password'>; status: 200 }
  | { success: false; error: string; status: 401 | 403 | 404 | 500 };

async function authorizationCheck(refererPath?: string): Promise<AuthorizationResult> {
  try {
    const userCollection = dbConnect(collections.users);
    const session = await getServerSession(authOptions);
    
    // If no session exists, deny access
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized Access", status: 401 };
    }

    // Find user in database
    const user = await userCollection.findOne({ 
      _id: new ObjectId(session.user.id) 
    }) as unknown as User;

    if (!user) {
      return { success: false, error: "User not found", status: 404 };
    }

    // Skip permission checks for public routes
    if (refererPath && PUBLIC_ROUTES.some(route => refererPath.startsWith(route))) {
      return { 
        success: true, 
        user: { ...user }, 
        status: 200 
      };
    }

    // Check if the requested route is an admin route
    const isAdminRoute = refererPath && ADMIN_ROUTES.some(route => 
      refererPath.startsWith(route)
    );

    // If it's an admin route, verify admin privileges
    if (isAdminRoute) {
      // Define what roles are considered admin roles
      const isAdmin = ["admin"].includes(user.role || "");
      
      if (!isAdmin) {
        return { 
          success: false, 
          error: "Admin privileges required", 
          status: 403 
        };
      }
    }

    // If all checks pass, return success
    return { 
      success: true, 
      user: { ...user }, 
      status: 200 
    };

  } catch (error) {
    console.error("Authorization error:", error);
    return { 
      success: false, 
      error: "Internal server error", 
      status: 500 
    };
  }
}

export { authorizationCheck };