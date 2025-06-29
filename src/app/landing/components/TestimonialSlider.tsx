'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Testimonial } from '../types';

// Updated testimonials with bowling theme
const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    title: 'Professional Bowler',
    message: 'Bowlers Network helped me connect with amazing amateur players and share my knowledge. The community here is fantastic!',
  },
  {
    name: 'Mike Rodriguez',
    title: 'League Champion',
    message: 'As an amateur, I love learning from the pros on this platform. The tips and guidance have improved my game tremendously.',
  },
  {
    name: 'Jessica Chen',
    title: 'Tournament Winner',
    message: 'The platform is intuitive and makes networking with other bowlers so easy. Great for tracking progress and connecting with the community.',
  },
];

const TestimonialSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Previous testimonial"
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          aria-label="Next testimonial"
        >
          ›
        </button>

        {/* Testimonial content */}
        <div className="p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
          <div className="text-center">
            {/* Quote icon */}
            <div className="text-6xl text-green-200 mb-4">&ldquo;</div>

            {/* Message */}
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
              {testimonials[currentSlide].message}
            </p>

            {/* Author info */}
            <div className="flex flex-col items-center gap-4">
              {/* Avatar placeholder */}
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {testimonials[currentSlide].name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentSlide].name}
                </h4>
                <p className="text-gray-600">
                  {testimonials[currentSlide].title}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 pb-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
