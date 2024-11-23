import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
`;

const AuthButton = styled.div`
  color: #aaa;
  text-decoration: none;
  background-color: #333;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
    color: #fff;
  }

  &:hover > ul {
    display: block;
  }
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #333;
  border-radius: 5px;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 1000;

  & > li {
    padding: 10px;
    color: #fff;
    cursor: pointer;

    &:hover {
      background-color: #444;
    }
  }
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
  };

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>Nhóm 4</Logo>
          <StyledNav>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All products</NavLink>
            <NavLink href={"/categories"}>Categories</NavLink>
            <NavLink href={"/cart"}>Cart ({cartProducts?.length})</NavLink>
            {userName ? (
              <AuthButton>
                Hello, {userName}
                <DropdownMenu>
                  <li onClick={() => window.location.href = "/change-password"}>Change Password</li>
                  <li onClick={handleLogout}>Log Out</li>
                </DropdownMenu>
              </AuthButton>
            ) : (
              <AuthButton onClick={() => window.location.href = "/login"}>
                Login/Register
              </AuthButton>
            )}
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
