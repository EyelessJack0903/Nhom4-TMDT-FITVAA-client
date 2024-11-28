import styled from "styled-components";
import Button from "@/components/Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

// Khung chứa toàn bộ các sản phẩm (wrapper container)
const ProductListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; // Cho phép các sản phẩm xuống hàng khi không đủ không gian
  gap: 20px; // Khoảng cách giữa các sản phẩm
  justify-content: center; // Căn giữa các sản phẩm trong hàng
  margin: 20px 0; // Khoảng cách trên và dưới của container
`;

// Khung chứa mỗi sản phẩm
const ProductBoxWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

// Khung chứa hình ảnh
const ProductImageWrapper = styled(Link)`
  background-color: #f8f8f8;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  padding: 20px;
  text-align: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100px;
`;

// Tiêu đề sản phẩm
const Title = styled(Link)`
  font-weight: 600;
  font-size: 0.8rem;
  color: #333;
  text-decoration: none;
  margin: 10px 0;
  display: block;
  min-height: 50px;
  text-overflow: ellipsis;
  white-space: normal;  // Thay đổi để cho phép xuống dòng
  overflow: hidden;
  word-wrap: break-word; // Thêm thuộc tính này để tự động xuống dòng khi cần thiết
`;


// Dòng giá và nút "Add to Cart"
const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  width: 100%;
`;

// Giá sản phẩm
const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-right: 15px;
`;

// Nút "Add to cart"
const StyledButton = styled(Button)`
  font-size: 0.9rem;
  padding: 8px 15px;
  margin-top: 10px;
`;

// Thông báo hết hàng
const SoldOutText = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: red;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: inline-block;
`;

export default function ProductBox({ _id, title, price, images, stock }) {
  const { addProduct } = useContext(CartContext);
  const url = `/product/${_id}`;

  return (
    <ProductBoxWrapper>
      {/* Khung hình ảnh */}
      <ProductImageWrapper href={url}>
        <img src={images?.[0]} alt={title} />
      </ProductImageWrapper>

      {/* Phần thông tin */}
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>${price}</Price>
          {stock > 0 ? (
            <StyledButton small primary outline onClick={() => addProduct(_id)}>
              Add to cart
            </StyledButton>
          ) : (
            <SoldOutText>Sold Out</SoldOutText>
          )}
        </PriceRow>
      </ProductInfoBox>
    </ProductBoxWrapper>
  );
}

// Component chứa các sản phẩm
export function ProductList({ products }) {
  return (
    <ProductListWrapper>
      {products.map((product) => (
        <ProductBox key={product._id} {...product} />
      ))}
    </ProductListWrapper>
  );
}
