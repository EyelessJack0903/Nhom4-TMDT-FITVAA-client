import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";

let verificationCodes = {}; // Lưu mã xác nhận tạm thời

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "POST") {
      const { email, name, password, verificationCode } = req.body;

      console.log("Received data from frontend:", { email, name, password, verificationCode });

      if (verificationCode) {
          // Kiểm tra mật khẩu
          if (!password) {
              return res.status(400).json({ error: "Password is required for verification" });
          }

          // Kiểm tra mã xác nhận
          if (verificationCodes[email] && verificationCodes[email] === parseInt(verificationCode, 10)) {
              delete verificationCodes[email]; // Xóa mã xác nhận sau khi sử dụng

              // Hash mật khẩu
              const hashedPassword = await bcrypt.hash(password, 10);

              // Cập nhật thông tin vào bảng `clients`
              try {
                  await db.collection("clients").updateOne(
                      { email },
                      {
                          $set: {
                              password: hashedPassword, // Lưu mật khẩu đã mã hóa
                          },
                      }
                  );

                  console.log(`Client registered: ${email}`);
                  return res.status(200).json({ message: "Registration successful" });
              } catch (dbError) {
                  console.error("Database error:", dbError);
                  return res.status(500).json({ error: "Failed to save client to database" });
              }
          } else {
              return res.status(400).json({ error: "Invalid verification code" });
          }
      }

      // Bước gửi mã xác nhận
      if (!email || !name || !password) {
          return res.status(400).json({ error: "Name, email, and password are required" });
      }

      try {
          // Kiểm tra email có tồn tại trong bảng `clients`
          const existingClient = await db.collection("clients").findOne({ email });
          if (existingClient) {
              return res.status(400).json({ error: "Email already registered. Please choose another email." });
          }

          const code = Math.floor(100000 + Math.random() * 900000);
          verificationCodes[email] = code;

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
              subject: "Your Verification Code",
              text: `Your verification code is: ${code}`,
          };

          await transporter.sendMail(mailOptions);

          // Lưu email và name tạm thời vào cơ sở dữ liệu
          await db.collection("clients").insertOne({
              email,
              name,
          });

          console.log(`Verification code sent to ${email}: ${code}`);
          res.status(200).json({ message: "Verification code sent" });
      } catch (error) {
          console.error("Email error:", error);
          res.status(500).json({ error: "Failed to send email" });
      }
  } else {
      res.status(405).json({ error: "Method not allowed" });
  }
}
