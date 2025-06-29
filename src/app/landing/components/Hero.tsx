import React from 'react';
import BowlingCarousel from './BowlingCarousel';
import { Link } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div id="home" className="min-h-[75vh] grid grid-cols-1 md:grid-cols-2 items-center px-4 md:px-10 lg:px-20 gap-10 py-10">
      {/* Left Side */}
      <div className="space-y-6 text-center md:text-left">
        <button className="text-[#8BC342] py-2 px-4 bg-[#8BC342]/10 rounded-full text-sm md:text-base">
          All in One Place
        </button>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Your Ultimate Bowling Experience
        </h1>

        <p className="text-[#5D5D5D] text-base sm:text-lg md:text-xl lg:text-2xl">
          Connect, Compete, and Grow — Whether You are a Casual <br className="hidden md:block" />
          Bowler, Pro, Center Owner, or Manufacturer.
        </p>

        <div className="flex justify-center md:justify-start">
          <Link
            to="/"
            className="bg-[#8BC342] transition hover:scale-105 duration-300 text-white px-6 sm:px-8 py-3 rounded-md text-sm sm:text-base font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[500px]">
          <BowlingCarousel />
        </div>
      </div>
    </div>
  );
};

export default Hero;
