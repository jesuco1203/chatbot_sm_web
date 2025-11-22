
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  
  const sizeClasses = {
      sm: 'text-sm',
      md: 'text-xl',
      lg: 'text-3xl'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${sizeClasses[size]} transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} focus:outline-none`}
          disabled={readonly}
        >
          <span className={star <= (hover || rating) ? "text-[#FFB703]" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};
