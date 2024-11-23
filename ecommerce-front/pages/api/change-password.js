import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db();

      // Tìm người dùng trong cơ sở dữ liệu
      const user = await db.collection("clients").findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Kiểm tra mật khẩu hiện tại
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu
      await db.collection("clients").updateOne(
        { email },
        { $set: { password: hashedNewPassword } }
      );

      console.log(`Password updated for user: ${email}`);
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "An error occurred during password update" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
