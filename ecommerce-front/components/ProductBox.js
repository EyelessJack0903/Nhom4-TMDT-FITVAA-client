import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

// Khung chứa hình ảnh (luôn cố định tỷ lệ)
const ProductImageWrapper = styled(Link)`
  background-color: #f8f8f8; 
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px; 
  height: 150px;
  overflow: hidden; 
  
  img {
    width: auto;
    height: 100%;
    object-fit: cover; 
  }
`;

// Phần thông tin sản phẩm
const ProductInfoBox = styled.div`
  margin-top: 10px;
  text-align: center;
  min-height: 100px; 
`;

const Title = styled(Link)`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  margin: 5px 0;
  display: block;
  min-height: 50px; 
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StyledButton = styled(Button)`
  font-size: 0.9rem;
`;

export default function ProductBox({ _id, title, price, images }) {
  const { addProduct } = useContext(CartContext);
  const url = `/product/${_id}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Khung hình ảnh */}
      <ProductImageWrapper href={url}>
        <img src={images?.[0]} alt={title} />
      </ProductImageWrapper>

      {/* Phần thông tin */}
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>${price}</Price>
          <StyledButton small primary outline onClick={() => addProduct(_id)}>
            Add to cart
          </StyledButton>
        </PriceRow>
      </ProductInfoBox>
    </div>
  );
}
