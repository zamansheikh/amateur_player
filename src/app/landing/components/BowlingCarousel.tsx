"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./BowlingCarousel.css";

// Interface for carousel image data
interface CarouselImage {
  id: number;
  image: string;
  title: string;
}

// Interface for animation classes state
interface AnimationClasses {
  prev: string;
  current: string;
  next: string;
}

// Interface for visible indices
interface VisibleIndices {
  prevIndex: number;
  currentIndex: number;
  nextIndex: number;
}

// Props interface for ImageCard component
interface ImageCardProps {
  image: CarouselImage;
  isCurrent?: boolean;
}

// Player card data
const carouselImages: CarouselImage[] = [
  {
    id: 1,
    image: "/playercard1.png",
    title: "Player 1",
  },
  {
    id: 2,
    image: "/playercard2.png",
    title: "Player 2",
  },
  {
    id: 3,
    image: "/playercard3.png",
    title: "Player 3",
  },
  {
    id: 4,
    image: "/playercard4.png",
    title: "Player 4",
  },
];

const BowlingCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationClasses, setAnimationClasses] = useState<AnimationClasses>({
    prev: '',
    current: '',
    next: ''
  });

  // Auto-slide functionality - slides every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleSlideChange('next');
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleSlideChange = (direction: 'next' | 'prev'): void => {
    setIsAnimating(true);

    if (direction === 'next') {
      setAnimationClasses({
        prev: 'moving-to-left',
        current: 'moving-to-right',
        next: 'left-to-center'
      });
    } else {
      setAnimationClasses({
        prev: 'right-to-center',
        current: 'moving-to-left',
        next: 'moving-to-right'
      });
    }

    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
      }

      setTimeout(() => {
        setAnimationClasses({ prev: '', current: '', next: '' });
        setIsAnimating(false);
      }, 1200);
    }, 50);
  };

  const goToSlide = (index: number): void => {
    if (isAnimating || index === currentIndex) return;

    const direction: 'next' | 'prev' = index > currentIndex ? 'next' : 'prev';
    handleSlideChange(direction);
  };

  const getVisibleIndices = (): VisibleIndices => {
    const totalCards = carouselImages.length;
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    const nextIndex = (currentIndex + 1) % totalCards;
    return { prevIndex, currentIndex, nextIndex };
  };

  const { prevIndex, nextIndex } = getVisibleIndices();

  return (
    <div className="carousel-container w-full max-w-[100%] sm:max-w-[500px] px-2 sm:px-0">
      <div className="carousel-wrapper">
        <div className={`carousel-card carousel-card-prev ${animationClasses.prev}`}>
          <ImageCard image={carouselImages[prevIndex]} />
        </div>

        <div className={`carousel-card carousel-card-current ${animationClasses.current}`}>
          <ImageCard image={carouselImages[currentIndex]} isCurrent={true} />
        </div>

        <div className={`carousel-card carousel-card-next ${animationClasses.next}`}>
          <ImageCard image={carouselImages[nextIndex]} />
        </div>
      </div>

      <div className="carousel-indicators">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

const ImageCard: React.FC<ImageCardProps> = ({ image, isCurrent = false }) => {
  return (
    <div className={`player-card ${isCurrent ? "current" : ""}`}>
      <Image
        src={image.image || "/placeholder.svg"}
        alt={image.title}
        width={300}
        height={400}
        className="player-image"
        priority={isCurrent}
      />
    </div>
  );
};

export default BowlingCarousel;
