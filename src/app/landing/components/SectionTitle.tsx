import React from 'react';

interface SectionTitleProps {
  subTitle: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ subTitle }) => {
  return (
    <div>
      <div className="text-center md:w-2/4 mx-auto">
        <div className="mb-8 flex justify-center items-center">
          <span className="h-0.25 w-32 bg-gray-400" />
          <span className="text-link py-3 px-5 bg-[#8BC342]/10 rounded-full mx-3">
            {subTitle}
          </span>
          <span className="h-0.25 w-32 bg-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SectionTitle;
