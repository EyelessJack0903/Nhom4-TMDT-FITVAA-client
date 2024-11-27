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

const SortWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const BrandTitle = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  color: #333;
  font-weight: bold;
  flex: 1;
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
  const { id } = router.query;
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [subBrands, setSubBrands] = useState([]);
  const [selectedSubBrand, setSelectedSubBrand] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBrandData = async () => {
      const res = await fetch(`/api/products-by-brand?brandId=${id}`);
      const data = await res.json();

      // Set the brand name
      setBrandName(data.brandName);

      // Map through products to ensure subBrand IDs are correctly handled
      const fetchedProducts = data.products;

      // Map through subBrands and fetch names if possible, otherwise keep the _id
      const updatedSubBrands = data.subBrands.map((subBrand) => {
        // Try to fetch the name from the subBrand object
        return {
          _id: subBrand._id,
          name: subBrand.name || subBrand._id.toString(), // fallback to _id if name is not found
        };
      });

      setProducts(fetchedProducts);
      setSortedProducts(fetchedProducts);
      setSubBrands(updatedSubBrands); // Use the processed subBrands
    };

    fetchBrandData();
  }, [id]);

  const handleSortChange = (e) => {
    const value = e.target.value;

    let sorted = [...sortedProducts];

    if (value === "price-low-to-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === "price-high-to-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === "name-a-to-z") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === "name-z-to-a") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    }

    setSortedProducts(sorted);
  };

  const handleSubBrandChange = (e) => {
    const subBrand = e.target.value;
    setSelectedSubBrand(subBrand);

    if (subBrand === "") {
      setSortedProducts(products);
    } else {
      const filtered = products.filter((product) => product.subBrand.toString() === subBrand);
      setSortedProducts(filtered);
    }
  };

  return (
    <>
      <Header />
      <BrandWrapper>
        <HeaderWrapper>
          <BrandTitle>{brandName}</BrandTitle>
          <SortWrapper>
            <SortDropdown onChange={handleSubBrandChange} value={selectedSubBrand}>
              <option value="">All</option>
              {subBrands.map((subBrand) => (
                <option key={subBrand._id} value={subBrand.name && subBrand._id}>
                  {subBrand.name || subBrand._id.toString()} 
                </option>
              ))}
            </SortDropdown>
            <SortDropdown onChange={handleSortChange}>
              <option value="">Sort by</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="name-a-to-z">Name: A to Z</option>
              <option value="name-z-to-a">Name: Z to A</option>
            </SortDropdown>
          </SortWrapper>
        </HeaderWrapper>
        {sortedProducts.length > 0 ? (
          <StyledProductsGrid products={sortedProducts} />
        ) : (
          <NoProducts>No products found for this sub-brand.</NoProducts>
        )}
      </BrandWrapper>
    </>
  );
}
