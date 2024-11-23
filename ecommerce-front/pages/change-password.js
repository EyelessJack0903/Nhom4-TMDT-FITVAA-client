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

const ChangePasswordBox = styled.div`
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

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"), // Email từ localStorage
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        window.location.href = "/";
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Wrapper>
      <Center>
        <ChangePasswordBox>
          <Title>Change Password</Title>
          <form onSubmit={handleChangePassword}>
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">Update Password</Button>
          </form>
        </ChangePasswordBox>
      </Center>
    </Wrapper>
  );
}
