import { mongooseConnect } from "@/lib/mongoose";
import { buffer } from "micro";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require("stripe")(process.env.STRIPE_SK);

const endpointSecret = "whsec_88d0f8e191d0a669c91a263d79dcb7f236bb0cc51fb2930c387d24a283a06479";

export default async function handler(req, res) {
  await mongooseConnect();

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        try {
          // Cập nhật trạng thái đơn hàng
          const updatedOrder = await Order.findByIdAndUpdate(orderId, { paid: true }, { new: true });

          if (updatedOrder) {
            console.log(`Đơn hàng ${orderId} đã được thanh toán.`);

            // Gửi email xác nhận
            await fetch(process.env.PUBLIC_URL + "/api/send-order-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: updatedOrder.name,
                email: updatedOrder.email,
                orderDetails: updatedOrder.line_items,
                total: updatedOrder.line_items.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity / 100, 0),
                city: updatedOrder.city,
                streetAddress: updatedOrder.streetAddress,
                country: updatedOrder.country,
                orderId,
              }),
            });

            console.log("Email xác nhận đã được gửi.");

            // Giảm stock
            const uniqueIds = updatedOrder.line_items.map((item) => item.price_data.product_data.name);
            const productsInfos = await Product.find({ title: { $in: uniqueIds } });

            for (const product of productsInfos) {
              const quantity = updatedOrder.line_items.find((item) => item.price_data.product_data.name === product.title)?.quantity || 0;

              if (quantity > 0 && product.stock >= quantity) {
                await Product.findByIdAndUpdate(product._id, { $inc: { stock: -quantity } });
                console.log(`Stock của sản phẩm ${product.title} đã được giảm.`);
              } else {
                console.log(`Không đủ stock cho sản phẩm ${product.title}.`);
              }
            }
          }
        } catch (err) {
          console.error(`Lỗi khi xử lý đơn hàng ${orderId}:`, err);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send("ok");
}

export const config = {
  api: { bodyParser: false },
};
