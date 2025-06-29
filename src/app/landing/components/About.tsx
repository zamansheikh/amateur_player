import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const About: React.FC = () => {
  return (
    <div id="about">
      <div className="container min-h-screen mx-auto px-4 sm:px-6 md:px-10 py-16">
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="space-y-6">
            <button className="text-[#8BC342] py-2 px-4 bg-[#8BC342]/10 rounded-full text-sm sm:text-base">
              All in One Place
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug">
              Your Journey to Bowlers network Starts Here
            </h1>
            <p className="text-sm sm:text-base text-gray-700">
              Connect, Compete, and Grow - Whether You are a Casual Bowler, Pro,
              Center Owner, or Manufacturer. Connect, Compete, and Grow - Whether
              You are a Casual Bowler, Pro, Center Owner, or Manufacturer.
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
              Connect with fellow bowlers, centers, and manufacturers to share
              knowledge, best practices, and experiences. Our platform fosters a
              vibrant community where you can learn from others, exchange tips,
              and stay updated on the latest trends in the bowling world.
            </p>
            <Link
              href="/"
              className="inline-block border border-gray-300 transition hover:scale-105 duration-500 px-6 py-2 sm:px-10 sm:py-3 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Explore Premium
            </Link>
          </div>

          <div className="rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/assets/images/frame-1.png"
              alt="Bowling Excellence"
              width={500}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 mt-20">
          <div className="rounded-xl shadow-lg overflow-hidden order-1 md:order-none">
            <Image
              src="/assets/images/frame-2.png"
              alt="Strike Analytics"
              width={500}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-6">
            <button className="text-[#8BC342] py-2 px-4 bg-[#8BC342]/10 rounded-full text-sm sm:text-base">
              All in One Place
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug">
              Your Journey to Bowlers network Starts Here
            </h1>
            <p className="text-sm sm:text-base text-gray-700">
              Connect, Compete, and Grow - Whether You are a Casual Bowler, Pro,
              Center Owner, or Manufacturer. Connect, Compete, and Grow - Whether
              You are a Casual Bowler, Pro, Center Owner, or Manufacturer.
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
              Connect with fellow bowlers, centers, and manufacturers to share
              knowledge, best practices, and experiences. Our platform fosters a
              vibrant community where you can learn from others, exchange tips,
              and stay updated on the latest trends in the bowling world.
            </p>
            <Link
              href="/"
              className="inline-block border border-gray-300 transition hover:scale-105 duration-500 px-6 py-2 sm:px-10 sm:py-3 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
