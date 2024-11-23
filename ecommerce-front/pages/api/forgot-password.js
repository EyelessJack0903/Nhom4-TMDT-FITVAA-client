import nodemailer from "nodemailer";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db();

      // Kiểm tra người dùng
      const user = await db.collection("clients").findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "No account found with this email" });
      }

      // Tạo mã xác nhận ngẫu nhiên
      const code = Math.floor(100000 + Math.random() * 900000);

      // Cập nhật mã xác nhận vào cơ sở dữ liệu
      await db.collection("clients").updateOne(
        { email },
        { $set: { resetCode: code } }
      );

      // Gửi email chứa mã xác nhận
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${code}`,
      };

      await transporter.sendMail(mailOptions);

      console.log(`Reset code sent to ${email}: ${code}`);
      res.status(200).json({ message: "Reset code sent to your email" });
    } catch (error) {
      console.error("Error sending reset code:", error);
      return res.status(500).json({ error: "An error occurred while sending reset code" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
