import styled from "styled-components";
import ProductBox from "@/components/ProductBox";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px; /* Khoảng cách giữa các sản phẩm */
  margin: 0; /* Loại bỏ khoảng cách bên ngoài */
  padding: 0; /* Loại bỏ khoảng cách bên trong */
`;


export default function ProductsGrid({ products }) {
  return (
    <StyledProductsGrid>
      {products.map((product) => (
        <ProductBox key={product._id} {...product} />
      ))}
    </StyledProductsGrid>
  );
}
