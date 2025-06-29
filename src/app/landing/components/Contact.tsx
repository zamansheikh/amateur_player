import React from 'react';
import Link from 'next/link';
import SectionTitle from './SectionTitle';

const Contact: React.FC = () => {
  return (
    <div id="contact" className="bg-[#F4F9ED] px-4 sm:px-6 md:px-10 py-20">
      <SectionTitle subTitle="Get Started" />
      <div className="text-center space-y-5 sm:space-y-7 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
          Your <span className="text-green-600">Bowling</span> Network <br /> Journey Starts Here
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700">
          Join the ultimate bowling community and elevate your game. <br />
          Connect with pros, track your progress, and strike up new friendships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 mt-8 sm:mt-10">
          <Link
            href="/"
            className="inline-block bg-black transition hover:scale-105 hover:bg-gray-800 duration-500 text-white px-7 py-3 rounded-md text-sm font-medium w-full sm:w-auto text-center"
          >
            Learn More
          </Link>
          <Link
            href="/"
            className="inline-block bg-[#8BC342] transition hover:scale-105 hover:bg-[#6fa332] duration-500 text-white px-7 py-3 rounded-md text-sm font-medium w-full sm:w-auto text-center"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
