import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Title = styled.h1`
  font-size: 2rem;
  margin: 20px 0;
  text-align: center;
  color: #333;
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

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/products?search=${query}&page=${currentPage}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products);
          setTotalPages(data.totalPages);
          setLoading(false);
        });
    }
  }, [query, currentPage]);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <Center>
        <Title>Kết quả tìm kiếm cho: "{query}"</Title>
        {loading ? (
          <p>Đang tải...</p>
        ) : products.length > 0 ? (
          <>
            <ProductsGrid products={products} />
            {/* Pagination */}
            <PaginationWrapper>
              <PaginationButton
                disabled={currentPage <= 1}
                onClick={() => handlePagination(currentPage - 1)}
              >
                Previous
              </PaginationButton>
              <span>
                {currentPage} / {totalPages}
              </span>
              <PaginationButton
                disabled={currentPage >= totalPages}
                onClick={() => handlePagination(currentPage + 1)}
              >
                Next
              </PaginationButton>
            </PaginationWrapper>
          </>
        ) : (
          <p>Không tìm thấy sản phẩm hoặc sản phẩm đã hết hàng.</p>
        )}
      </Center>
    </>
  );
}
