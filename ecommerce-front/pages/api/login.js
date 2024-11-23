import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db();

      // Tìm người dùng trong bảng `clients`
      const user = await db.collection("clients").findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      if (!user.password) {
        console.error(`Password not found for user: ${email}`);
        return res.status(500).json({ error: "Password not found. Please contact support." });
      }

      // So sánh mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      console.log(`User logged in: ${email}`);
      return res.status(200).json({
        message: "Login successful",
        email: user.email,
        name: user.name, // Trả về tên người dùng
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "An error occurred during login" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
