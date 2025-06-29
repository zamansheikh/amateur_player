// Main Landing component
export { default as Landing } from './page';
export { LandingConfigProvider, useLandingConfig } from './LandingConfigProvider';

// Individual components
export { default as About } from './components/About';
export { default as Contact } from './components/Contact';
export { default as Hero } from './components/Hero';
export { default as Organization } from './components/Organization';
export { default as Partner } from './components/Partner';
export { default as Pricing } from './components/Pricing';
export { default as Testimonials } from './components/Testimonials';
export { default as TestimonialSlider } from './components/TestimonialSlider';

// Types and Config
export type { Testimonial, PricingPlan } from './types';
export type { LandingConfig } from './config';
export { defaultConfig } from './config';
