import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  await mongooseConnect();

  const { search } = req.query;

  let query = { stock: { $gt: 0 } };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  try {
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
}
