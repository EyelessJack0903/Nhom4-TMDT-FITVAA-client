import { useState } from "react";
import { useRouter } from "next/router";
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { email } = router.query;
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });

      if (res.ok) {
        alert("Password reset successful!");
        window.location.href = "/login";
      } else {
        const data = await res.json();
        alert(data.error || "An error occurred during password reset");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred during password reset");
    }
  };

  return (
    <Wrapper>
      <Center>
        <FormBox>
          <Title>Reset Password</Title>
          <form onSubmit={handleResetPassword}>
            <Input
              type="text"
              placeholder="Nhập mã reset password"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Nhập password mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit">Reset Password</Button>
          </form>
        </FormBox>
      </Center>
    </Wrapper>
  );
}
