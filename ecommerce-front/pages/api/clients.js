import { mongooseConnect } from "../../lib/mongoose";
import { Client } from "@/models/Client";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    
    const { userId } = req.query;

    // Tìm client theo userId
    const client = await Client.findById(userId, "name"); 
    
    if (!client) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ name: client.name });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
}
