import { Star1 } from "iconsax-reactjs";

type RatingProps = {
  rate: number;
  className?: string;
};

export const Rating = ({ rate, className }: RatingProps) => {
  return (
    <div className={`flex flex-row-reverse gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star1
          key={`star-${index}`}
          color="#FFD700"
          className={`${rate >= index ? `fill-[#FFD700]` : "fill-white"}`}
        />
      ))}
    </div>
  );
};
