import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  const { brandId } = req.query;

  if (!brandId) {
    res.status(400).json({ message: "brandId is required" });
    return;
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Get brand information by brandId
    const brand = await db.collection("brands").findOne({ _id: new ObjectId(brandId) });
    if (!brand) {
      res.status(404).json({ message: "Brand not found" });
      return;
    }

    // Fetch products associated with the brand
    const products = await db
      .collection("products")
      .find({ brand: new ObjectId(brandId) })
      .toArray();

    // Fetch subBrands associated with this brand (assuming subBrands is an array field in the brand document)
    const subBrands = brand.subBrands || [];

    res.status(200).json({
      brandName: brand.name,
      products,
      subBrands,
    });
  } catch (error) {
    console.error("Error fetching products or brand:", error);
    res.status(500).json({ message: "Unable to fetch products or brand" });
  }
}
