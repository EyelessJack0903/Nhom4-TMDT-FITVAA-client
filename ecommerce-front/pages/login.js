import { useState } from "react";
import styled from "styled-components";
import Center from "../components/Center";

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0 20px;
`;

const LoginBox = styled.div`
  width: 400px;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
    padding: 20px;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: calc(100% - 20px); /* Đảm bảo rằng input nằm gọn trong hộp LoginBox */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0 auto;
  display: block;

  @media (max-width: 480px) {
    padding: 8px;
  }
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

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
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

  @media (max-width: 480px) {
    font-size: 14px;
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
                    <Title>Đăng nhập</Title>
                    <form onSubmit={handleLogin}>
                        <InputWrapper>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputWrapper>
                        <Button type="submit">Login</Button>
                    </form>
                    <Link href="/register">Bạn không có tài khoản? Ấn đăng ký tại đây</Link>
                    <Link href="/forgot-password">Quên mật khẩu?</Link>
                </LoginBox>
            </Center>
        </LoginWrapper>
    );
}
