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

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/products?search=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <>
      <Header /> {/* Thêm Header */}
      <Center>
        <Title>Kết quả tìm kiếm cho: "{query}"</Title>
        {loading ? (
          <p>Đang tải...</p>
        ) : products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <p>Không tìm thấy sản phẩm hoặc sản phẩm đã hết hàng.</p>
        )}
      </Center>
    </>
  );
}
