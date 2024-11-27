import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db();

      // Find the user by email
      const user = await db.collection("clients").findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      if (!user.password) {
        return res.status(500).json({ error: "Password not found. Please contact support." });
      }

      // Compare the password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      console.log(`User logged in: ${email}`);

      // Return the user data (including userId as ObjectId)
      return res.status(200).json({
        message: "Login successful",
        userId: user._id.toString(),  
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "An error occurred during login" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
