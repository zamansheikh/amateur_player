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
    highSeries: number;
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
      highSeries: 600,
      experience: 1200,
      Xp: 3000,
      follower: 150,
    },
  },
  {
    id: 2,
    name: "Sarah Johnson",
    level: 12,
    imagePath: "/images/player1.png",
    stats: {
      average: 18,
      highGame: 250,
      highSeries: 680,
      experience: 1800,
      Xp: 4200,
      follower: 220,
    },
  },
  {
    id: 3,
    name: "Mike Chen",
    level: 6,
    imagePath: "/images/player1.png",
    stats: {
      average: 12,
      highGame: 180,
      highSeries: 520,
      experience: 800,
      Xp: 2100,
      follower: 98,
    },
  },
  {
    id: 4,
    name: "Emma Wilson",
    level: 15,
    imagePath: "/images/player1.png",
    stats: {
      average: 22,
      highGame: 280,
      highSeries: 750,
      experience: 2500,
      Xp: 5800,
      follower: 340,
    },
  },
  {
    id: 5,
    name: "Zaman Sheikh",
    level: 99,
    imagePath: "/images/player1.png",
    stats: {
      average: 22,
      highGame: 280,
      highSeries: 750,
      experience: 2500,
      Xp: 5800,
      follower: 340,
    },
  },
];

const BowlingCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationClasses, setAnimationClasses] = useState<AnimationClasses>({
    prev: "",
    current: "",
    next: "",
  });

  // Initialize player data for each position
  const [stablePlayerData, setStablePlayerData] = useState<{
    prev: CarouselPlayer;
    current: CarouselPlayer;
    next: CarouselPlayer;
  }>(carouselPlayers.reduce((acc, _, index) => {
    acc.prev = carouselPlayers[(index - 1 + carouselPlayers.length) % carouselPlayers.length];
    acc.current = carouselPlayers[index];
    acc.next = carouselPlayers[(index + 1) % carouselPlayers.length];
    return acc;
  }, { prev: carouselPlayers[carouselPlayers.length - 1], current: carouselPlayers[0], next: carouselPlayers[1] }));

  // Auto-slide functionality - slides every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleSlideChange("next");
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleSlideChange = (direction: "next" | "prev"): void => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Calculate new indices
    let newCurrentIndex: number;
    if (direction === "next") {
      newCurrentIndex = (currentIndex + 1) % carouselPlayers.length;
    } else {
      newCurrentIndex = (currentIndex - 1 + carouselPlayers.length) % carouselPlayers.length;
    }

    const newPrevIndex = (newCurrentIndex - 1 + carouselPlayers.length) % carouselPlayers.length;
    const newNextIndex = (newCurrentIndex + 1) % carouselPlayers.length;

    // Set stable player data immediately before applying animation classes
    setStablePlayerData({
      prev: carouselPlayers[newPrevIndex],
      current: carouselPlayers[newCurrentIndex],
      next: carouselPlayers[newNextIndex],
    });

    // Set animation classes based on direction
    if (direction === "next") {
      setAnimationClasses({
        prev: "moving-to-left",
        current: "moving-to-right",
        next: "left-to-center",
      });
    } else {
      setAnimationClasses({
        prev: "right-to-center",
        current: "moving-to-left",
        next: "moving-to-right",
      });
    }

    // Reset animation classes after animation completes
    setTimeout(() => {
      setAnimationClasses({ prev: "", current: "", next: "" });
      setIsAnimating(false);
      setCurrentIndex(newCurrentIndex);
    }, 1200); // Match animation duration
  };

  const goToSlide = (index: number): void => {
    if (isAnimating || index === currentIndex) return;
    const direction: "next" | "prev" = index > currentIndex ? "next" : "prev";
    handleSlideChange(direction);
  };

  return (
    <div className="carousel-container w-full max-w-[100%] sm:max-w-[650px] px-2 sm:px-0">
      <div className="carousel-wrapper">
        <div className={`carousel-card carousel-card-prev ${animationClasses.prev} ${isAnimating ? "animating" : ""}`}>
          <PlayerCard
            key={`prev-${stablePlayerData.prev.id}`}
            name={stablePlayerData.prev.name}
            level={stablePlayerData.prev.level}
            imagePath={stablePlayerData.prev.imagePath}
            stats={stablePlayerData.prev.stats}
            width={363}
            height={544}
            backgroundColor="rgba(255, 255, 255, 0.9)"
          />
        </div>
        <div className={`carousel-card carousel-card-current ${animationClasses.current} ${isAnimating ? "animating" : ""}`}>
          <PlayerCard
            key={`current-${stablePlayerData.current.id}`}
            name={stablePlayerData.current.name}
            level={stablePlayerData.current.level}
            imagePath={stablePlayerData.current.imagePath}
            stats={stablePlayerData.current.stats}
            width={363}
            height={544}
            backgroundColor="white"
          />
        </div>
        <div className={`carousel-card carousel-card-next ${animationClasses.next} ${isAnimating ? "animating" : ""}`}>
          <PlayerCard
            key={`next-${stablePlayerData.next.id}`}
            name={stablePlayerData.next.name}
            level={stablePlayerData.next.level}
            imagePath={stablePlayerData.next.imagePath}
            stats={stablePlayerData.next.stats}
            width={363}
            height={544}
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
