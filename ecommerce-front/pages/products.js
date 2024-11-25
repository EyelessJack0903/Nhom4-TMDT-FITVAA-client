import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { useState } from "react";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SortDropdown = styled.select`
  padding: 5px 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e0e0e0;
  }

  &:focus {
    outline: none;
    border-color: #0070f3;
  }
`;

export default function ProductsPage({ products }) {
  const [sortedProducts, setSortedProducts] = useState(products);

  // Hàm xử lý sắp xếp
  const handleSortChange = (e) => {
    const value = e.target.value;

    if (value === "low-to-high") {
      const sorted = [...products].sort((a, b) => a.price - b.price);
      setSortedProducts(sorted);
    } else if (value === "high-to-low") {
      const sorted = [...products].sort((a, b) => b.price - a.price);
      setSortedProducts(sorted);
    } else if (value === "a-to-z") {
      const sorted = [...products].sort((a, b) => a.title.localeCompare(b.title));
      setSortedProducts(sorted);
    } else if (value === "z-to-a") {
      const sorted = [...products].sort((a, b) => b.title.localeCompare(a.title));
      setSortedProducts(sorted);
    } else {
      setSortedProducts(products); // Reset lại nếu không chọn gì
    }
  };

  return (
    <>
      <Header />
      <Center>
        <HeaderWrapper>
          <Title>All products</Title>
          <SortDropdown onChange={handleSortChange}>
            <option value="">Sort by</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="a-to-z">Name: A to Z</option>
            <option value="z-to-a">Name: Z to A</option>
          </SortDropdown>
        </HeaderWrapper>
        <ProductsGrid products={sortedProducts} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { '_id': -1 } });
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
