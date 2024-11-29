import mongoose from "mongoose";
import { mongooseConnect } from "../../lib/mongoose";  
import { Review } from "../../models/Review";  

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { rating, comment, userId, productId, userName } = req.body;

    if (!rating || !comment || !userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await mongooseConnect();

      const userObjectId = new mongoose.Types.ObjectId(userId); 
      const productObjectId = new mongoose.Types.ObjectId(productId);  

      // Tạo review
      const review = new Review({
        userId: userObjectId,
        userName,
        rating,
        comment,
        productId: productObjectId,
        createdAt: new Date(),
      });

      // Lưu review vào database
      await review.save();

      return res.status(200).json({ message: "Review submitted successfully" });
    } catch (error) {
      console.error("Error saving review:", error);
      return res.status(500).json({ error: "Failed to submit review" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
