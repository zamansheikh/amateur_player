// Configuration for external dependencies
// These should be provided by the host application

export interface LandingConfig {
  // Component dependencies that should be provided by the host app
  components: {
    BowlingCarousel?: React.ComponentType;
    SectionTitle?: React.ComponentType<{ subTitle: string }>;
  };
  // Asset paths - these should be updated when moving to another project
  assets: {
    images: {
      frame1: string;
      frame2: string;
    };
    company: {
      oscarHealth: string;
      cigna: string;
      allianz: string;
      company1: string;
      company2: string;
      company3: string;
      company4: string;
      company5: string;
      company6: string;
      company7: string;
    };
  };
}

// Default configuration - update these paths when moving to another project
export const defaultConfig: LandingConfig = {
  components: {},
  assets: {
    images: {
      frame1: '/src/assets/images/frame-1.png',
      frame2: '/src/assets/images/frame-2.png',
    },
    company: {
      oscarHealth: '/src/assets/company/oscar-health.png',
      cigna: '/src/assets/company/cigna.png',
      allianz: '/src/assets/company/allianz.png',
      company1: '/src/assets/company/company-1.png',
      company2: '/src/assets/company/company-2.png',
      company3: '/src/assets/company/company-3.png',
      company4: '/src/assets/company/company-4.png',
      company5: '/src/assets/company/company-5.png',
      company6: '/src/assets/company/company-6.png',
      company7: '/src/assets/company/company-7.png',
    },
  },
};
