import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db();

      // Kiểm tra mã xác nhận từ cơ sở dữ liệu
      const user = await db.collection("clients").findOne({ email });

      if (!user || user.resetCode !== parseInt(resetCode, 10)) {
        return res.status(400).json({ error: "Invalid reset code" });
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới và xóa mã reset
      await db.collection("clients").updateOne(
        { email },
        { $set: { password: hashedPassword, resetCode: null } }
      );

      console.log(`Password reset successfully for ${email}`);
      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ error: "An error occurred during password reset" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
