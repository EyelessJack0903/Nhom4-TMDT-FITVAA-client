import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { name, email, orderDetails, total, city, streetAddress, country, orderId } = req.body;
  
      // Thiết lập cấu hình gửi email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // CSS styling
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <h1 style="color: #333;">Cảm ơn bạn, ${name}!</h1>
            <p style="color: #555;">Đơn hàng của bạn đã được ghi nhận. Chi tiết đơn hàng:</p>
            <p style="color: #555; font-size: 14px;"><strong>Mã đơn hàng:</strong> ${orderId}</p>
          </div>
          <div style="padding: 20px;">
            <h3 style="color: #333;">Chi tiết sản phẩm</h3>
            <ul style="list-style: none; padding: 0;">
              ${orderDetails
                .map(
                  (item) => `
                <li style="margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #ddd;">
                  <span style="font-weight: bold;">${item.name}</span>
                  <span style="float: right;">$${item.price} x ${item.quantity}</span>
                </li>
              `
                )
                .join("")}
            </ul>
            <p style="text-align: right; font-size: 18px; font-weight: bold; color: #333;">Tổng cộng: $${total}</p>
          </div>
          <div style="padding: 20px;">
            <h3 style="color: #333;">Địa chỉ giao hàng</h3>
            <p style="margin: 5px 0;"><strong>Đường:</strong> ${streetAddress}</p>
            <p style="margin: 5px 0;"><strong>Thành phố:</strong> ${city}</p>
            <p style="margin: 5px 0;"><strong>Quốc gia:</strong> ${country}</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #777;">Chúng tôi sẽ liên hệ với bạn khi đơn hàng được xử lý. Cảm ơn bạn đã mua sắm!</p>
          </div>
        </div>
      `;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Xác nhận đơn hàng",
        html: emailContent,
      };
  
      try {
        await transporter.sendMail(mailOptions);
        console.log("Thông tin nhận được từ Frontend:", {
          name,
          email,
          orderId, // Ghi log để kiểm tra ID đơn hàng
          city,
          streetAddress,
          country,
        });
        res.status(200).json({ message: "Email xác nhận đã gửi thành công!" });
      } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        res.status(500).json({ message: "Không thể gửi email." });
      }
    } else {
      res.status(405).json({ message: "Phương thức không được hỗ trợ." });
    }
  }
  