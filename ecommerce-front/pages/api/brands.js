import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; 

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Only GET requests are allowed" });
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(); 

    const brands = await db.collection("brands").find().toArray();

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch brands." });
  }
}
