import React from 'react';
import SectionTitle from './SectionTitle';

const Organization: React.FC = () => {
  // Using placeholder company logos that don't require external assets
  const topCompanies = [
    { name: 'BowlingCenter Pro', logo: '🎳' },
    { name: 'Strike Industries', logo: '⚡' },
    { name: 'Pin Masters', logo: '🏆' },
  ];

  const scrollingCompanies = [
    'Bowling Alliance', 'Strike Zone', 'Perfect Game Co.', 'Frame Masters',
    'Spare Time Inc.', 'Gutter Guards', 'Pin Dynasty', 'Roll Champions',
  ];

  return (
    <div className="bg-[#F4F9ED] px-4 sm:px-6 md:px-10 lg:px-20 py-16">
      <SectionTitle subTitle="Trusted by bowling centers and organizations worldwide" />

      {/* Top Logos */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 my-10">
        {topCompanies.map((company, index) => (
          <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-2xl">{company.logo}</span>
            <span className="font-medium text-gray-700">{company.name}</span>
          </div>
        ))}
      </div>

      {/* Scrolling Row 1 */}
      <div className="overflow-hidden py-7">
        <div className="flex w-max animate-scrollX gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-5">
              {scrollingCompanies.map((company, idx) => (
                <div
                  key={`${i}-${idx}`}
                  className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 flex justify-center items-center rounded-xl shadow-md border border-[#E2F0CF] bg-[#f9fdf5]"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎳</div>
                    <div className="text-xs font-medium text-gray-700 px-2">
                      {company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling Row 2 */}
      <div className="overflow-hidden py-7">
        <div className="flex w-max animate-scrollXReverse gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-5">
              {scrollingCompanies.map((company, idx) => (
                <div
                  key={`${i}-${idx}`}
                  className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 flex justify-center items-center rounded-xl shadow-md border border-[#E2F0CF] bg-[#f9fdf5]"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-xs font-medium text-gray-700 px-2">
                      {company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organization;
