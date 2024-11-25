import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";
import Link from "next/link";

const CategoryWrapper = styled.div`
  margin: 40px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CategoryTitle = styled.h2`
  font-size: 1.4rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ShowAllLink = styled(Link)`
  font-size: 1.2rem;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
`;

export default function HomePage({
  featuredProduct = null,
  categoriesWithProducts = [],
}) {
  return (
    <div>
      <Header />
      {featuredProduct && <Featured product={featuredProduct} />}
      {Array.isArray(categoriesWithProducts) &&
        categoriesWithProducts
          .filter((category) => Array.isArray(category.products) && category.products.length > 0)
          .map((category) => (
            <CategoryWrapper key={category._id}>
              <CategoryTitle>
                {category.name}
                <ShowAllLink href={`/category/${category._id}`}>Show all</ShowAllLink>
              </CategoryTitle>
              <ProductsGrid products={category.products.slice(0, 5)} />
            </CategoryWrapper>
          ))}
    </div>
  );
}


export async function getServerSideProps() {
  const featuredProductId = '671615be500375a8e26eefea';
  await mongooseConnect();

  let featuredProduct = null;

  try {
    // Lấy sản phẩm nổi bật
    featuredProduct = await Product.findById(featuredProductId);
  } catch (error) {
    console.error("Error fetching featured product:", error);
  }

  // Lấy các danh mục và sản phẩm liên kết
  let categoriesWithProducts = [];
  try {
    const categories = await Category.find();
    categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id });
        return { ...category.toObject(), products };
      })
    );
  } catch (error) {
    console.error("Error fetching categories or products:", error);
  }

  return {
    props: {
      featuredProduct: featuredProduct
        ? JSON.parse(JSON.stringify(featuredProduct))
        : null,
      categoriesWithProducts: JSON.parse(JSON.stringify(categoriesWithProducts)),
    },
  };
}
