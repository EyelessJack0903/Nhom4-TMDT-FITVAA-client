import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.json("Chỉ hỗ trợ POST request");
    return;
  }
  const { name, email, city, postalCode, streetAddress, country, cartProducts } = req.body;
  console.log("Dữ liệu từ Frontend:", {
    name,
    email,
    city,
    streetAddress,
    country,
    cartProducts,
  });
  await mongooseConnect();

  // Lấy thông tin sản phẩm từ cơ sở dữ liệu
  const uniqueIds = [...new Set(cartProducts)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];
  let orderDetails = [];

  for (const productID of uniqueIds) {
    const productInfo = productsInfos.find((p) => p._id.toString() === productID);
    const quantity = cartProducts.filter((id) => id === productID)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "USD",
          product_data: { name: productInfo.title },
          unit_amount: productInfo.price * 100,
        },
      });

      orderDetails.push({
        name: productInfo.title,
        price: productInfo.price,
        quantity,
      });
    }
  }

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    paid: false,
  });

  // Tạo phiên thanh toán Stripe
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=true",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=true",
    metadata: { orderId: orderDoc._id.toString() },
  });

  // Gửi email xác nhận đơn hàng
  try {
    const total = orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await fetch(process.env.PUBLIC_URL + "/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          orderDetails, 
          total, 
          city, 
          streetAddress, 
          country,
          orderId: orderDoc._id.toString(),
        }),
      });
      

    console.log("Email xác nhận đã được gửi.");
  } catch (err) {
    console.error("Lỗi khi gửi email xác nhận:", err);
  }

  res.json({
    url: session.url,
  });
}
