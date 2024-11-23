import { useState } from "react";
import styled from "styled-components";
import Center from "../components/Center";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginBox = styled.div`
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

const Link = styled.a`
  display: block;
  margin-top: 15px;
  text-align: center;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("userName", data.name); // Lưu tên người dùng
                localStorage.setItem("userEmail", data.email); // Lưu email người dùng
                alert("Login successful!");
                window.location.href = "/";
            } else {
                const data = await res.json();
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login");
        }
    };

    return (
        <LoginWrapper>
            <Center>
                <LoginBox>
                    <Title>Login</Title>
                    <form onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit">Login</Button>
                    </form>
                    <Link href="/register">Don't have an account? Register here</Link>
                    <Link href="/forgot-password">Forgot Password?</Link>
                </LoginBox>
            </Center>
        </LoginWrapper>
    );
}
