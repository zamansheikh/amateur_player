import React from 'react';
import TestimonialSlider from './TestimonialSlider';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-white px-4 sm:px-6 md:px-10 lg:px-20 py-16">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 mb-12">
          <span className="text-green-600 inline-block py-2 px-4 sm:py-3 sm:px-5 bg-green-100 rounded-full text-sm sm:text-base font-medium">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900">
            What Our <span className="text-green-600">Players</span> Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, Compete, and Grow — Whether You are a Casual Bowler, Pro,
            Center Owner, or Manufacturer.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div>
          <TestimonialSlider />
        </div>

        {/* See All Reviews Button */}
        <div className="text-center mt-8">
          <button className="border border-green-600 text-green-600 hover:bg-green-50 rounded-lg px-6 py-3 font-medium transition-colors duration-200">
            See All Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
