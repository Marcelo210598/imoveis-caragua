"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
};

const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function StarRating({
  rating,
  onChange,
  size = "md",
  readonly = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const starSize = sizes[size];

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={readonly}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          >
            <Star
              size={starSize}
              className={
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
