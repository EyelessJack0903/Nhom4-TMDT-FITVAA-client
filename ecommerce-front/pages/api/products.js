// Example API route: /pages/api/products.js
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  const { search, page = 1, sort = "" } = req.query;
  const productsPerPage = 10;
  const skip = (page - 1) * productsPerPage;

  const sortOptions = {
    "low-to-high": { price: 1 },
    "high-to-low": { price: -1 },
    "a-to-z": { title: 1 },
    "z-to-a": { title: -1 },
  };

  const sortQuery = sortOptions[sort] || {};

  try {
    const products = await Product.find({ title: { $regex: search, $options: "i" } })
      .sort(sortQuery)
      .skip(skip)
      .limit(productsPerPage);

    const totalProductCount = await Product.countDocuments({ title: { $regex: search, $options: "i" } });
    const totalPages = Math.ceil(totalProductCount / productsPerPage);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
