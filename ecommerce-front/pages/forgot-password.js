import { useState } from "react";
import styled from "styled-components";
import Center from "../components/Center";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const FormBox = styled.div`
  width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #444;
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Reset code sent to your email!");
        window.location.href = `/reset-password?email=${email}`;
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      alert("An error occurred while sending reset code");
    }
  };

  return (
    <Wrapper>
      <Center>
        <FormBox>
          <Title>Forgot Password</Title>
          <form onSubmit={handleForgotPassword}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Send Reset Code</Button>
          </form>
        </FormBox>
      </Center>
    </Wrapper>
  );
}
