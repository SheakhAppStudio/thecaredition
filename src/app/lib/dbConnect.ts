import { MongoClient, ServerApiVersion, Collection } from "mongodb";

const collections = {
  services: "services",
  bookings : "bookings",
  users : "users",
  blogs : "blogs",
  videos : "videos",
  shops : "shops"
};

function dbConnect<T extends Document = Document>(collectionName: string): Collection<T> {
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
  if (!uri) throw new Error("MongoDB URI is not defined in environment variables");

  const dbName = process.env.MONGODB_NAME;
  if (!dbName) throw new Error("MongoDB database name is not defined in environment variables");

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  return client.db(dbName).collection<T>(collectionName);
}

export  {dbConnect, collections};
