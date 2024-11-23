import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const userEmail = req.headers["x-user-email"]; 

    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.collection("clients").findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
