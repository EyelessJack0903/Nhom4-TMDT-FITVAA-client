import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, code } = req.body;
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email, verificationCode: parseInt(code) });

    if (user) {
      await usersCollection.updateOne({ email }, { $set: { verified: true } });
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }

    client.close();
  } else {
    res.status(405).end();
  }
}
