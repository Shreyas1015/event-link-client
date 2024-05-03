import React, { useState } from "react";

const RatingInput = ({ value, onChange }) => {
  const totalStars = 5;
  const [filledStars, setFilledStars] = useState(value || 0);

  const handleStarClick = (starIndex) => {
    setFilledStars(starIndex + 1);
    onChange(starIndex + 1);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      const starClassName =
        i < filledStars
          ? "fa fa-star star-size my-3"
          : "fa fa-star-o star-size my-3";
      stars.push(
        <i
          key={i}
          className={starClassName}
          style={{ color: "yellow", cursor: "pointer", fontSize: "2rem" }}
          onClick={() => handleStarClick(i)}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div>
      <div>{renderStars()}</div>
      <p>
        {filledStars} / {totalStars} Stars
      </p>
    </div>
  );
};

export default RatingInput;
