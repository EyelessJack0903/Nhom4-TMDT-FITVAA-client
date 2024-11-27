import styled from "styled-components";
import { useState, useEffect } from "react";

const CommentWrapper = styled.div`
  margin-top: 40px;
  padding: 10px;
  border-top: 1px solid #ddd;
`;

const Comment = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const RatingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Rating = styled.div`
  display: flex;
  gap: 5px;
  font-size: 1.2rem;
  color: #f4c542;
`;

const User = styled.div`
  font-weight: bold;
  font-size: 1rem;
  margin-top: 5px;
`;

const ReviewDate = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-left: 20px;
`;

const CommentText = styled.p`
  margin-top: 10px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
`;

const PaginationButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;

  &:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const PageInfo = styled.div`
  font-size: 1rem;
  color: #333;
  margin: 0 10px;
  font-weight: bold;
`;

export default function CustomerReviews({ reviews }) {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    const fetchClientName = async (userId) => {
      const res = await fetch(`/api/clients?userId=${userId}`);
      const data = await res.json();
      return data.name;
    };

    const fetchReviews = async () => {
      const reviewsWithUserNames = [];
      for (let review of reviews) {
        const userName = await fetchClientName(review.userId);
        reviewsWithUserNames.push({ ...review, userName });
      }
      setClients(reviewsWithUserNames);
    };

    fetchReviews();
  }, [reviews]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? "★" : "☆");
    }
    return stars.join("");
  };

  // Get the reviews to display based on the current page
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = clients.slice(indexOfFirstReview, indexOfLastReview);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(clients.length / reviewsPerPage);

  return (
    <div>
      <h4>Các đánh giá khác</h4>
      <CommentWrapper>
        {currentReviews.length === 0 ? (
          <p>Hiện tại chưa có đánh giá, bạn hãy là người đầu tiên đánh giá chứ?</p>
        ) : (
          currentReviews.map((review, index) => (
            <Comment key={index}>
              <RatingWrapper>
                <Rating>{renderStars(review.rating)}</Rating>
                <ReviewDate>{new Date(review.createdAt).toLocaleString()}</ReviewDate>
              </RatingWrapper>
              <User>{review.userName}</User>
              <CommentText>{review.comment}</CommentText>
            </Comment>
          ))
        )}
      </CommentWrapper>

      {/* Pagination Controls */}
      <PaginationWrapper>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </PaginationButton>

        <PageInfo>
          Trang {currentPage} / {totalPages}
        </PageInfo>

        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </PaginationButton>
      </PaginationWrapper>
    </div>
  );
}
