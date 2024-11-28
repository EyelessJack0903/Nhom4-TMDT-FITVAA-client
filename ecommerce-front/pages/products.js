import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { useState, useEffect } from "react";

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

export default function ProductsPage({ products }) {
  const [sortedProducts, setSortedProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm xử lý sắp xếp
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
      sorted = products; // Reset lại nếu không chọn gì
    }

    setSortedProducts(sorted);
  };

  // Hàm phân trang
  useEffect(() => {
    const productsPerPage = 10;
    const totalProductCount = products.length;
    const totalPageCount = Math.ceil(totalProductCount / productsPerPage);
    setTotalPages(totalPageCount);

    // Lấy sản phẩm cho trang hiện tại
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);
    setSortedProducts(paginatedProducts);
  }, [currentPage, products]);

  const handlePagination = (page) => {
    setCurrentPage(page);
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

        {/* Pagination */}
        <PaginationWrapper>
          <PaginationButton
            disabled={currentPage <= 1}
            onClick={() => handlePagination(currentPage - 1)}
          >
            Previous
          </PaginationButton>
          <span>{currentPage} / {totalPages}</span>
          <PaginationButton
            disabled={currentPage >= totalPages}
            onClick={() => handlePagination(currentPage + 1)}
          >
            Next
          </PaginationButton>
        </PaginationWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();

  // Lọc sản phẩm còn hàng
  const products = await Product.find({ stock: { $gt: 0 } }, null, { sort: { '_id': -1 } });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
