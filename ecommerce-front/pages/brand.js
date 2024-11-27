import styled from "styled-components";
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";
const BrandWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

const BrandTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const BrandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const BrandItem = styled.div`
  text-align: center;
  cursor: pointer;
`;

const BrandImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const BrandName = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

export default function Brand({ brands }) {
  if (!brands || brands.length === 0) {
    return (
      <>
        <Header />
        <BrandWrapper>
          <BrandTitle>Không có thương hiệu nào!</BrandTitle>
        </BrandWrapper>
      </>
    );
  }

  return (
    <>
      <Header />
      <BrandWrapper>
        <BrandTitle>Các thương hiệu</BrandTitle>
        <BrandGrid>
          {brands.map((brand) => (
            <Link href={`/brand/${brand._id}`} key={brand._id}>
              <BrandItem>
                <BrandImage src={brand.logo} alt={brand.name} />
                <BrandName>{brand.name}</BrandName>
              </BrandItem>
            </Link>
          ))}
        </BrandGrid>
      </BrandWrapper>
    </>
  );
}

export async function getServerSideProps() {
    try {
      const baseUrl = process.env.PUBLIC_URL;
  
      if (!baseUrl) {
        throw new Error("PUBLIC_URL is not defined");
      }
  
      const res = await fetch(`${baseUrl}/api/brands`);
      const brands = await res.json();
      return { props: { brands } };
    } catch (error) {
      console.error("Error fetching brands:", error.message);
      return { props: { brands: [] } }; // Trả về mảng rỗng nếu lỗi
    }
  }
  
