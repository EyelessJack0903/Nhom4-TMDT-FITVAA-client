import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";

const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 3;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  ${props => (props.mobileNavActive ? `
    display: block;
  ` : `
    display: none;
  `)}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;

  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;

  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;

  @media screen and (min-width: 768px) {
    display: none;
  }
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
  const [mobileNavActive, setMobileNavActive] = useState(false);
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
          <Logo href="/">Ecommerce</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/cart">Cart ({cartProducts?.length})</NavLink>
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
          <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
