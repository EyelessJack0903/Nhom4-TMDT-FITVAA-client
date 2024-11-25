import styled from "styled-components";
import Center from "./Center";
import ProductsGrid from "./ProductsGrid";

const Title = styled.h2`
  font-size: 2.5rem;
  margin: 40px 0;
  font-weight: bold;
  text-align: center;
  color: #222;
`;

const CategoryWrapper = styled.div`
  margin: 40px 0;
  padding: 0;
`;

const CategoryTitle = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  margin: 20px 0;
  color: #444;
  text-align: left;
  padding-left: 20px;
`;

export default function NewProducts({ categoriesWithProducts = [] }) {
  const filteredCategories = categoriesWithProducts.filter(
    (category) => Array.isArray(category.products) && category.products.length > 0
  );

  return (
    <Center>
      <Title>Hãy chìm đắm vào thế giới Laptop!!!</Title>
      {filteredCategories.map((category) => (
        <CategoryWrapper key={category._id}>
          <CategoryTitle>{category.name}</CategoryTitle>
          <ProductsGrid products={category.products.slice(0, 5)} />
        </CategoryWrapper>
      ))}
    </Center>
  );
}
