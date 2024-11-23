import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
      const db = client.db();
      const usersCollection = db.collection("users");

      const existingUser = await usersCollection.findOne({ email: user.email });

      if (!existingUser) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        await usersCollection.insertOne({
          email: user.email,
          verified: false,
          verificationCode,
        });

        await transporter.sendMail({
          to: user.email,
          from: process.env.EMAIL_FROM,
          subject: "Email Verification Code",
          text: `Your verification code is ${verificationCode}`,
        });

        console.log(`Verification code sent to ${user.email}: ${verificationCode}`);
      }
      client.close();
      return true;
    },
  },
};

export default NextAuth(authOptions);
