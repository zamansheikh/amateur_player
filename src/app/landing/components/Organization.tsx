import React, { useState } from 'react';
import Image from 'next/image';
import SectionTitle from './SectionTitle';

const CompanyCard: React.FC<{ image: string; name: string; icon: string; index: number }> = ({ image, name, icon, index }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 flex justify-center items-center rounded-xl shadow-md border border-[#E2F0CF] bg-white">
      {!imageError ? (
        <Image
          src={image}
          alt={`${name} logo`}
          width={80}
          height={80}
          className="object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="text-center">
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-xs font-medium text-gray-700 px-2">{name}</div>
        </div>
      )}
    </div>
  );
};

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

  // Company images from assets folder
  const companyImages = [
    '/assets/company/company-1.png',
    '/assets/company/company-2.png',
    '/assets/company/company-3.png',
    '/assets/company/company-4.png',
    '/assets/company/company-5.png',
    '/assets/company/company-6.png',
    '/assets/company/company-7.png',
    '/assets/company/oscar-health.png',
    '/assets/company/cigna.png',
    '/assets/company/allianz.png',
  ];

  // Company names for fallback
  const companyNames = [
    'TechCorp', 'DataFlow', 'CloudSys', 'NetWork Pro',
    'SoftBase', 'InnoTech', 'DevCore', 'Oscar Health',
    'Cigna', 'Allianz'
  ];

  return (
    <div id="features" className="bg-[#F4F9ED] px-4 sm:px-6 md:px-10 lg:px-20 py-16">
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
              {companyImages.map((image, idx) => (
                <CompanyCard
                  key={`${i}-${idx}`}
                  image={image}
                  name={companyNames[idx]}
                  icon="🏢"
                  index={idx}
                />
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
              {companyImages.map((image, idx) => (
                <CompanyCard
                  key={`${i}-${idx}`}
                  image={image}
                  name={companyNames[idx]}
                  icon="⚡"
                  index={idx}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organization;
