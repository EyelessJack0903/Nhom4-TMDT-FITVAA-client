import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode, password }), 
      });
  
      if (res.ok) {
        alert("Registration successful!");
        window.location.href = "/login"; // Chuyển hướng sang trang login
      } else {
        const data = await res.json();
        alert(data.error || "Invalid verification code");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Error occurred during verification!");
    }
  };
  
  
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Email Verification</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
