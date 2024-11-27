// src/components/ReviewForm.js
import { useState } from "react";
import styled from "styled-components";
import WhiteBox from "./WhiteBox";

const ReviewWrapper = styled.div`
  padding: 20px;
`;

const StarWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Star = styled.span`
  font-size: 2rem;
  color: ${props => (props.selected ? "#FFD700" : "#ddd")};
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 80%;
  height: 120px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (rating > 0 && comment.length > 0) {
      onSubmit(rating, comment);
      setComment("");
      setRating(0);
      setSubmitted(true);
    }
  };

  return (
    <ReviewWrapper>
        <WhiteBox>
      <h3>Đánh giá ngay!!!</h3>
      <hr/>
        <StarWrapper>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            selected={index < rating}
            onClick={() => handleRating(index)}
          >
            ★
          </Star>
        ))}
      </StarWrapper>
      <TextArea
        placeholder="Viết bình luận tại đây..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleSubmit}>Gửi đánh giá</Button>

      {submitted && <p style={{ color: 'green', marginTop: '10px' }}>Review Submitted!</p>}
      </WhiteBox>
    </ReviewWrapper>
  );
}
