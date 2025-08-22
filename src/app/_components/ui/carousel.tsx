import React, { useEffect, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import type { KeenSliderOptions } from "keen-slider";
import "keen-slider/keen-slider.min.css";

type CarouselProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & KeenSliderOptions;

const Carousel = ({ children, className, style, ...rest }: CarouselProps) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(rest);

  const updateSlider = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [instanceRef]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateSlider();
    });

    return () => cancelAnimationFrame(frame);
  }, [children, updateSlider]);

  return (
    <div ref={sliderRef} style={style} className={`keen-slider ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return <div className="keen-slider__slide">{child}</div>;
        }
        return null;
      })}
    </div>
  );
};

export default Carousel;
