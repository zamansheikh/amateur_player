import React from 'react';
import TestimonialSlider from './TestimonialSlider';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-[#F4F9ED] px-4 sm:px-6 md:px-10 lg:px-20 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center container mx-auto">
        {/* Left Side */}
        <div className="space-y-5">
          <span className="text-link inline-block py-2 px-4 sm:py-3 sm:px-5 bg-[#8BC342]/10 rounded-full text-sm sm:text-base">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f1d40]">
            Our Player Says
          </h2>
          <p className="text-[#444] text-sm sm:text-base leading-relaxed">
            Connect, Compete, and Grow — Whether You are a Casual Bowler, Pro,
            Center Owner, or Manufacturer.
          </p>
          <button className="border border-[#e6e9ec] rounded-md px-5 sm:px-6 py-2 sm:py-3 text-sm font-medium hover:bg-[#e6e9ec] transition-all duration-200">
            See All Reviews
          </button>
        </div>

        {/* Right Side - Responsive slider container */}
        <div>
          <TestimonialSlider />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
