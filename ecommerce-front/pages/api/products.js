import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  await mongooseConnect();

  const { search, page = 1 } = req.query;
  const productsPerPage = 10;

  let query = { stock: { $gt: 0 } };

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  try {
    const totalProductCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProductCount / productsPerPage);
    const skip = (page - 1) * productsPerPage;

    const products = await Product.find(query)
      .skip(skip)
      .limit(productsPerPage);

    res.json({ products, totalPages });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
}
