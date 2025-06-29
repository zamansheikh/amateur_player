import React from 'react';
import SectionTitle from './SectionTitle';

const Partner: React.FC = () => {
  const partners = [
    'Strike Systems', 'Pin Analytics', 'Bowl Tech', 'Frame Pro',
    'Gutter Solutions', 'Spare AI', 'Perfect Game', 'Lane Masters',
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
              {partners.map((partner, idx) => (
                <div
                  key={`${i}-${idx}`}
                  className="h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 flex justify-center items-center rounded-xl shadow-md border border-[#E2F0CF] bg-[#f9fdf5]"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="text-xs font-medium text-gray-700 px-2">
                      {partner}
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

export default Partner;
