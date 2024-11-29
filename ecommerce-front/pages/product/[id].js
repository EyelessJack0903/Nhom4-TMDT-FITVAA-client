import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import { CartContext } from "@/components/CartContext";
import ReviewForm from "@/components/ReviewForm";
import CustomerReviews from "@/components/CustomerReviews";
import Footer from "@/components/Footer";
import ButtonLink from "@/components/ButtonLink";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin: 40px 0;

  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
`;

const ProductDetails = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProductTitle = styled(Title)`
  font-size: 1.7rem;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600; 
`;

const ProductDescription = styled.p`
  font-size: 1.1rem; 
  line-height: 1.7;  
  color: #444;       
  margin-bottom: 25px;  
  padding: 15px;      
  background-color: #f5f5f5; 
  border-radius: 8px;  
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  text-align: justify; 
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
`;

const Price = styled.span`
  font-size: 1.6rem;
  font-weight: bold;
  color: green;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const CommentSection = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;
`;

const LeftSection = styled.div`
  flex: 1;  
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

const RightSection = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
`;

const Wrapper = styled.div`
  padding: 20px;
`;

const Message = styled.div`
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-top: 20px;
`;

const LoginLink = styled.a`
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SpecsWrapper = styled.div`
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
`;

const SpecsTitle = styled.h3`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 10px;
`;

const SpecsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f4f4f4;
`;

const TableRow = styled.tr``;

const TableHeaderCell = styled.th`
  font-weight: bold;
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  color: #555;
`;

const BrandAndSubBrandWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
`;

const BrandInfo = styled.div`
  font-size: 1.2rem;
  color: #333;
  flex: 1; 
`;

const SubBrandInfo = styled.div`
  font-size: 1.2rem;
  color: #555;
  flex: 1; 
`;

const CategoryInfo = styled.div`
  font-size: 1.2rem;
  color: #777;
  flex: 1; 
`;

const ArrowButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #0056b3;
  }
`;
const ProductSliderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
`;

const ProductCard = styled.div`
  width: 180px;
  margin: 0 10px;
  text-align: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const SoldOutText = styled.span`
  color: red;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export default function ProductPage({ product, relatedProducts }) {
  const { addProduct } = useContext(CartContext);
  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const exchangeRate = 24000;
  const priceInVND = product.price * exchangeRate;

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleReviewSubmit = async (rating, comment) => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const reviewData = {
      rating,
      comment,
      userId,
      userName,
      productId: product._id,
    };

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        router.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review");
    }
  };

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews/${product._id}`);
    const data = await res.json();
    setReviews(data.reviews);
  };

  useEffect(() => {
    fetchReviews();
  }, [product._id]);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const subBrandName = product.brand?.subBrands?.find(subBrand => {
    return subBrand._id.toString() === product.subBrand || subBrand.name === product.subBrand;
  })?.name || (product.subBrand || 'Chưa có');

  const categoryName = product.category ? product.category.name : "Unknown Category";

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide + 5 < relatedProducts.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <ProductDetails>
            <ProductImages images={product.images} />
          </ProductDetails>
          <div>
            <ProductTitle>{product.title}</ProductTitle>
            <ProductDescription>{product.description}</ProductDescription>

            <div>
              <strong>Tình trạng: </strong>
              <span
                style={{
                  color: product.stock <= 3 && product.stock > 0 ? 'orange' : product.stock > 3 ? 'green' : 'red',
                  fontWeight: 'bold',
                }}
              >
                {product.stock > 3 ? 'Còn hàng' : product.stock <= 3 && product.stock > 0 ? 'Sắp hết hàng' : 'Hết hàng'}
              </span>
            </div>

            <hr />
            {/* Display Brand and SubBrand Info */}
            <BrandAndSubBrandWrapper>
              <BrandInfo>Thương hiệu: {product.brand ? product.brand.name : "Unknown"}</BrandInfo>
              <SubBrandInfo>Model: {subBrandName || "Unknown"}</SubBrandInfo>
              <SubBrandInfo>Loại: {categoryName}</SubBrandInfo>
            </BrandAndSubBrandWrapper>
            <hr />
            <PriceRow>
              <div>
                <Price>{`$${product.price}`}</Price>
              </div>
              <ButtonWrapper>
                {product.stock > 0 ? (
                  <Button primary onClick={() => addProduct(product._id)}>
                    <CartIcon /> Add to cart
                  </Button>
                ) : (
                  <SoldOutText>
                    Sold Out
                  </SoldOutText>
                )}
              </ButtonWrapper>
            </PriceRow>
          </div>
        </ColWrapper>

        {/* Detailed Specs Section */}
        <SpecsWrapper>
          <SpecsTitle>Thông số kỹ thuật</SpecsTitle>
          <SpecsTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Tên thông số</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {product.detailedSpecs && Object.entries(product.detailedSpecs).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </SpecsTable>
        </SpecsWrapper>

        {/* Custom HR with Text Inside */}
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
          <hr style={{
            flex: 1,
            border: "0",
            borderTop: "2px solid #ddd",
            margin: "0"
          }} />
          <span style={{
            padding: "0 10px",
            fontSize: "1.2rem",
            color: "#333",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}>
            Bạn có thể tham khảo
          </span>
          <hr style={{
            flex: 1,
            border: "0",
            borderTop: "2px solid #ddd",
            margin: "0"
          }} />
        </div>

        {/* Product Slider */}
        <ProductSliderWrapper>
          <ArrowButton onClick={handlePrev}>{"<"}</ArrowButton>
          <div style={{ display: "flex", overflowX: "auto", maxWidth: "80%" }}>
            {Array.isArray(relatedProducts) &&
              relatedProducts
                .filter((product) => product.stock > 0) // Chỉ lấy các sản phẩm còn hàng
                .slice(currentSlide, currentSlide + 5)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id}>
                    <a href={`/product/${relatedProduct._id}`}>
                      <ProductImage
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                      />
                    </a>
                    <h4>{relatedProduct.title}</h4>
                    <hr/>
                    <Price>${relatedProduct.price}</Price>
                  </ProductCard>
                ))}
          </div>
          <ArrowButton onClick={handleNext}>{">"}</ArrowButton>
        </ProductSliderWrapper>

        {/* Comment Section */}
        <CommentSection>
          <LeftSection>
            <Wrapper>
              {isLoggedIn ? (
                <ReviewForm onSubmit={handleReviewSubmit} />
              ) : (
                <Message>
                  Bạn chưa đăng nhập. Vui lòng{" "}
                  <LoginLink onClick={handleLoginRedirect}>đăng nhập</LoginLink> để viết đánh giá.
                </Message>
              )}
            </Wrapper>
          </LeftSection>

          <RightSection>
            <WhiteBox>
              <CustomerReviews reviews={reviews} />
            </WhiteBox>
          </RightSection>
        </CommentSection>
      </Center>
      <Footer />

    </>
  );
}

// getServerSideProps
export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;

  const product = await Product.findById(id)
    .populate("brand")
    .populate("category");

  const relatedProducts = await Product.find({ category: product.category._id })
    .limit(8)
    .exec();

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)) || [],
    },
  };
}



