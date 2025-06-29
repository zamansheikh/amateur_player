import React, { useState } from 'react';
import Image from 'next/image';
import SectionTitle from './SectionTitle';

const PartnerCard: React.FC<{ image: string; name: string; index: number }> = ({ image, name, index }) => {
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
          <div className="text-3xl mb-2">🤝</div>
          <div className="text-xs font-medium text-gray-700 px-2">{name}</div>
        </div>
      )}
    </div>
  );
};

const Partner: React.FC = () => {
  const partners = [
    'Strike Systems', 'Pin Analytics', 'Bowl Tech', 'Frame Pro',
    'Gutter Solutions', 'Spare AI', 'Perfect Game', 'Lane Masters',
  ];

  // Company images from assets folder
  const partnerImages = [
    '/assets/company/company-1.png',
    '/assets/company/company-2.png',
    '/assets/company/company-3.png',
    '/assets/company/company-4.png',
    '/assets/company/company-5.png',
    '/assets/company/company-6.png',
    '/assets/company/company-7.png',
    '/assets/company/oscar-health.png',
  ];

  return (
    <div id="features" className="px-4 sm:px-6 md:px-10 py-16">
      <SectionTitle subTitle="Technology Partners" />

      <div className="text-center space-y-5 mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-snug">
          Your <span className="text-green-600">Success,</span> Our <br className="hidden sm:block" /> Commitment
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700">
          Building the future of bowling with trusted partners
        </p>
      </div>

      {/* Partners Grid */}
      <div className="overflow-hidden py-10">
        <div className="flex w-max animate-scrollX gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-5">
              {partnerImages.map((image, idx) => (
                <PartnerCard
                  key={`${i}-${idx}`}
                  image={image}
                  name={partners[idx] || `Partner ${idx + 1}`}
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

export default Partner;
