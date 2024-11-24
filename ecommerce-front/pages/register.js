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

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;

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

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [step, setStep] = useState(1); // 1: Điền thông tin, 2: Nhập mã xác nhận

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Data sent to API:", { email, name, password });
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, password }),
            });

            if (res.ok) {
                setStep(2);
                alert("Verification code sent to your email!");
            } else {
                const data = await res.json();
                if (data.error === "Email already registered. Please choose another email.") {
                    alert("This email is already registered. Please choose a different email.");
                } else {
                    alert(data.error || "Failed to send verification code");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error occurred!");
        }
    };

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
                window.location.href = "/login";
            } else {
                const data = await res.json();
                alert(data.error || "Invalid verification code");
            }
        } catch (error) {
            console.error(error);
            alert("Error occurred during verification!");
        }
    };

    return (
        <LoginWrapper>
            <Center>
                <LoginBox>
                    <Title>{step === 1 ? "Register" : "Verify Your Email"}</Title>
                    <form onSubmit={step === 1 ? handleRegister : handleVerify}>
                        {step === 1 ? (
                            <>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

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
                                <Button type="submit">Send Verification Code</Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    type="text"
                                    placeholder="Enter Verification Code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                />
                                <Button type="submit">Verify and Register</Button>
                            </>
                        )}
                    </form>
                    <Link href="/login">Already have an account? Login here</Link>
                </LoginBox>
            </Center>
        </LoginWrapper>
    );
}
