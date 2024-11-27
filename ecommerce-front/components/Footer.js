import styled from "styled-components";
import Link from "next/link";
const StyledFooter = styled.footer`
  background-color: #222;
  color: #aaa;
  padding: 20px 0;
  text-align: center;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #aaa;
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;

  a {
    color: #aaa;
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
`;

const FooterLogo = styled(Link)`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  margin-bottom: 15px;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <FooterWrapper>
        <FooterLogo href="/">Nhóm 4</FooterLogo>
        <FooterText>Ứng dụng Thương Mại Điện Tử - Môn học Xây Dựng Ứng Dụng Thương Mại Điện Tử</FooterText>
        <FooterText>Copyright © 2024 Nhóm 4</FooterText>
      </FooterWrapper>
    </StyledFooter>
  );
}
