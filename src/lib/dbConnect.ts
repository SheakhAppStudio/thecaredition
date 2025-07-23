import { MongoClient, ServerApiVersion, Collection, Document } from "mongodb";

const collections = {
  services: "services",
  bookings: "bookings",
  users: "users",
  blogs: "blogs",
  videos: "videos",
  shops: "shops",
};

// Global variable to store the client
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri = process.env.NEXT_PUBLIC_MONGODB_URI!;
const dbName = process.env.MONGODB_NAME!;

if (!uri) throw new Error("MongoDB URI is not defined in environment variables");
if (!dbName) throw new Error("MongoDB name is not defined");

// Extend the global object to include _mongoClientPromise
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function dbConnect<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const client = await clientPromise;
  return client.db(dbName).collection<T>(collectionName);
}

export { dbConnect, collections };
