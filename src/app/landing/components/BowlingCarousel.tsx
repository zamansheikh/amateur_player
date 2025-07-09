"use client";

import React, { useState, useEffect } from "react";
import "./BowlingCarousel.css";
import PlayerCard from "./PlayerCard";

// Interface for carousel player data
interface CarouselPlayer {
  id: number;
  name: string;
  level: number;
  imagePath: string;
  stats: {
    average: number;
    highGame: number;
    hightSeries: number;
    experience: number;
    Xp: number;
    follower: number;
  };
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

// Props interface for PlayerCard component
interface PlayerCardProps {
  player: CarouselPlayer;
  isCurrent?: boolean;
}

// Player card data
const carouselPlayers: CarouselPlayer[] = [
  {
    id: 1,
    name: "Alex Panda",
    level: 8,
    imagePath: "/images/player1.png",
    stats: {
      average: 15,
      highGame: 200,
      hightSeries: 600,
      experience: 1200,
      Xp: 3000,
      follower: 150
    }
  },
  {
    id: 2,
    name: "Sarah Johnson",
    level: 12,
    imagePath: "/images/player1.png",
    stats: {
      average: 18,
      highGame: 250,
      hightSeries: 680,
      experience: 1800,
      Xp: 4200,
      follower: 220
    }
  },
  {
    id: 3,
    name: "Mike Chen",
    level: 6,
    imagePath: "/images/player1.png",
    stats: {
      average: 12,
      highGame: 180,
      hightSeries: 520,
      experience: 800,
      Xp: 2100,
      follower: 98
    }
  },
  {
    id: 4,
    name: "Emma Wilson",
    level: 15,
    imagePath: "/images/player1.png",
    stats: {
      average: 22,
      highGame: 280,
      hightSeries: 750,
      experience: 2500,
      Xp: 5800,
      follower: 340
    }
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselPlayers.length);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselPlayers.length) % carouselPlayers.length);
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
    const totalCards = carouselPlayers.length;
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    const nextIndex = (currentIndex + 1) % totalCards;
    return { prevIndex, currentIndex, nextIndex };
  };

  const { prevIndex, nextIndex } = getVisibleIndices();

  return (
    <div className="carousel-container w-full max-w-[100%] sm:max-w-[650px] px-2 sm:px-0">
      <div className="carousel-wrapper">
        <div className={`carousel-card carousel-card-prev ${animationClasses.prev}`}>
          <PlayerCard 
            key={`prev-${prevIndex}`}
            name={carouselPlayers[prevIndex].name}
            level={carouselPlayers[prevIndex].level}
            imagePath={carouselPlayers[prevIndex].imagePath}
            stats={carouselPlayers[prevIndex].stats}
            width={320}
            height={480}
            backgroundColor="rgba(255, 255, 255, 0.9)"
          />
        </div>

        <div className={`carousel-card carousel-card-current ${animationClasses.current}`}>
          <PlayerCard 
            key={`current-${currentIndex}`}
            name={carouselPlayers[currentIndex].name}
            level={carouselPlayers[currentIndex].level}
            imagePath={carouselPlayers[currentIndex].imagePath}
            stats={carouselPlayers[currentIndex].stats}
            width={350}
            height={520}
            backgroundColor="white"
          />
        </div>

        <div className={`carousel-card carousel-card-next ${animationClasses.next}`}>
          <PlayerCard 
            key={`next-${nextIndex}`}
            name={carouselPlayers[nextIndex].name}
            level={carouselPlayers[nextIndex].level}
            imagePath={carouselPlayers[nextIndex].imagePath}
            stats={carouselPlayers[nextIndex].stats}
            width={320}
            height={480}
            backgroundColor="rgba(255, 255, 255, 0.9)"
          />
        </div>
      </div>

      <div className="carousel-indicators">
        {carouselPlayers.map((_, index) => (
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

export default BowlingCarousel;
