import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import styled from "styled-components";
import ProductsGrid from "@/components/ProductsGrid";
import Link from "next/link";
import Footer from "@/components/Footer";

// Style for category wrapper with shadow and border
const CategoryWrapper = styled.div`
  margin: 40px 0;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
  border: 1px solid #ecf0f1; /* Soft border around the box */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-5px); /* Slightly lift the box on hover */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); /* Stronger shadow on hover */
  }
`;

// Category title style with better spacing and color
const CategoryTitle = styled.h2`
  font-size: 1.6rem;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #ecf0f1;
  padding-bottom: 12px;
`;

// Show all link style with more contrast and hover effect
const ShowAllLink = styled(Link)`
  font-size: 1.1rem;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
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
              <ProductsGrid products={category.products.slice(0, 7)} />
            </CategoryWrapper>
          ))}
      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = '671615be500375a8e26eefea';
  await mongooseConnect();

  let featuredProduct = null;

  try {
    featuredProduct = await Product.findById(featuredProductId);
    if (featuredProduct && featuredProduct.stock <= 0) {
      featuredProduct = null; 
    }
  } catch (error) {
    console.error("Error fetching featured product:", error);
  }

  let categoriesWithProducts = [];
  try {
    const categories = await Category.find();
    categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id, stock: { $gt: 0 } });
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
