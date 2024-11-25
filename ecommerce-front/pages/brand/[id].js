import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";

const BrandWrapper = styled.div`
  padding: 40px 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BrandTitle = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  color: #333;
  font-weight: bold;
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

const NoProducts = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin-top: 20px;
`;

const StyledProductsGrid = styled(ProductsGrid)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default function BrandPage() {
  const router = useRouter();
  const { id } = router.query; // Lấy brandId từ URL
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchBrandData = async () => {
      const res = await fetch(`/api/products-by-brand?brandId=${id}`);
      const data = await res.json();
      setBrandName(data.brandName); // Cập nhật tên thương hiệu từ API
      setProducts(data.products); // Cập nhật danh sách sản phẩm từ API
      setSortedProducts(data.products); // Gán sản phẩm ban đầu vào sortedProducts
    };

    fetchBrandData();
  }, [id]);

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
      setSortedProducts(products); // Reset lại sản phẩm nếu không chọn gì
    }
  };

  return (
    <>
      <Header />
      <BrandWrapper>
        <HeaderWrapper>
          <BrandTitle>{brandName}</BrandTitle>
          <SortDropdown onChange={handleSortChange}>
            <option value="">Sort by</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="a-to-z">Name: A to Z</option>
            <option value="z-to-a">Name: Z to A</option>
          </SortDropdown>
        </HeaderWrapper>
        {sortedProducts.length > 0 ? (
          <StyledProductsGrid products={sortedProducts} />
        ) : (
          <NoProducts>Không có sản phẩm nào thuộc thương hiệu này.</NoProducts>
        )}
      </BrandWrapper>
    </>
  );
}
