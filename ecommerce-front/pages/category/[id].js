import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import ProductsGrid from "@/components/ProductsGrid";
import Header from "@/components/Header";
import styled from "styled-components";
import { useState } from "react";
import Center from "@/components/Center";  // Assuming you have this component

// Styled components
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f9f9f9;
  margin: 0 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #e0e0e0;
  }

  &:disabled {
    cursor: not-allowed;
    background: #ddd;
  }
`;

export default function CategoryPage({ category, products, totalPages, currentPage }) {
  const [sortedProducts, setSortedProducts] = useState(products);

  // Hàm xử lý sắp xếp khi chọn dropdown
  const handleSortChange = (e) => {
    const value = e.target.value;

    let sorted = [];
    if (value === "low-to-high") {
      sorted = [...products].sort((a, b) => a.price - b.price);
    } else if (value === "high-to-low") {
      sorted = [...products].sort((a, b) => b.price - a.price);
    } else if (value === "a-to-z") {
      sorted = [...products].sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === "z-to-a") {
      sorted = [...products].sort((a, b) => b.title.localeCompare(a.title));
    } else {
      sorted = products; // Reset lại sản phẩm khi không có sắp xếp
    }

    setSortedProducts(sorted);
  };

  return (
    <div>
      <Header />

      {/* Header và dropdown sắp xếp */}
      <Center>
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

        {/* Pagination */}
        <PaginationWrapper>
          <PaginationButton disabled={currentPage <= 1} onClick={() => window.location.href = `/category/${category._id}?page=${currentPage - 1}`}>
            Previous
          </PaginationButton>
          <span>{currentPage} / {totalPages}</span>
          <PaginationButton disabled={currentPage >= totalPages} onClick={() => window.location.href = `/category/${category._id}?page=${currentPage + 1}`}>
            Next
          </PaginationButton>
        </PaginationWrapper>
      </Center>
    </div>
  );
}

export async function getServerSideProps({ params, query }) {
  await mongooseConnect();
  const { id } = params;
  const { page = 1 } = query;

  // Tìm danh mục theo ID
  const category = await Category.findById(id);
  if (!category) {
    return { notFound: true };
  }

  // Lọc sản phẩm còn hàng và phân trang
  const productsPerPage = 10;
  const skip = (page - 1) * productsPerPage;

  const products = await Product.find({ category: category._id, stock: { $gt: 0 } })
    .skip(skip)
    .limit(productsPerPage)
    .sort({ _id: -1 });  // Sort các sản phẩm theo ID giảm dần

  const totalProducts = await Product.countDocuments({ category: category._id, stock: { $gt: 0 } });
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return {
    props: {
      category: category ? JSON.parse(JSON.stringify(category)) : null,
      products: JSON.parse(JSON.stringify(products)),
      totalPages,
      currentPage: parseInt(page),
    },
  };
}
