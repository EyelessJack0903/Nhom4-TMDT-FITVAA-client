import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
  const { productId } = req.query;

  if (req.method === "GET") {
    try {
      await mongooseConnect();
      const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
      return res.status(200).json({ reviews });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
