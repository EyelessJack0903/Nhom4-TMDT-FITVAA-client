import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import ProductsGrid from "@/components/ProductsGrid";
import Header from "@/components/Header";
import styled from "styled-components";
import { useState } from "react";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
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

export default function CategoryPage({ category, products }) {
  const [sortedProducts, setSortedProducts] = useState(products);

  // Xử lý sắp xếp khi chọn dropdown
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
      setSortedProducts(products); // Reset lại sản phẩm khi không có sắp xếp
    }
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div>
      <Header />

      {/* Header và dropdown sắp xếp */}
      <HeaderWrapper>
        <CategoryTitle>{category.name}</CategoryTitle>
        <SortDropdown onChange={handleSortChange}>
          <option value="">Sort by</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="a-to-z">Name: A to Z</option>
          <option value="z-to-a">Name: Z to A</option>
        </SortDropdown>
      </HeaderWrapper>

      {/* Grid sản phẩm */}
      <ProductsGrid products={sortedProducts} />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  await mongooseConnect();
  const { id } = params;

  // Tìm danh mục theo ID
  const category = await Category.findById(id);
  if (!category) {
    return {
      notFound: true,
    };
  }

  // Tìm tất cả sản phẩm thuộc danh mục
  const products = await Product.find({ category: category._id });

  return {
    props: {
      category: category ? JSON.parse(JSON.stringify(category)) : null,
      products: products ? JSON.parse(JSON.stringify(products)) : [],
    },
  };
}
