import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { PricingPlan } from '../types';
import SectionTitle from './SectionTitle';

const plans: PricingPlan[] = [
  {
    name: 'Amateur',
    price: 0,
    badge: 'Free',
    description: 'Perfect for individual bowlers just starting their journey.',
    features: [
      'Basic Profile & Stats',
      'Community Access',
      'Limited Pro Player Follows',
      'Basic Dashboard',
      'Email Support',
    ],
  },
  {
    name: 'Bowling Center',
    price: 79,
    badge: 'Pro',
    description: 'Ideal for bowling centers managing leagues and tournaments.',
    features: [
      'Advanced Center Dashboard',
      'League Management Tools',
      'Tournament Organization',
      'Customer Analytics',
      'Priority Support',
      'API Access',
    ],
  },
  {
    name: 'Manufacturer',
    price: 149,
    badge: 'Enterprise',
    description: 'For equipment manufacturers and large bowling operations.',
    features: [
      'All Pro Features',
      'Dedicated Account Manager',
      '24/7 Live Support',
      'Custom Integrations',
      'White-label Solutions',
      'Advanced Analytics',
    ],
  },
];

const Pricing: React.FC = () => {
  return (
    <div id="pricing" className="container mx-auto space-y-10 px-4 sm:px-6 md:px-10 py-16">
      <SectionTitle subTitle="Pricing" />
      <div className="text-center space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
          Choose <span className="text-green-600">the Plan That&apos;s</span> <br />
          Right for You
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Join the bowling community with the perfect plan for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 md:p-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="w-full border border-gray-200 rounded-xl shadow-sm p-6 bg-white flex flex-col gap-4 transition-all duration-300 hover:scale-95 hover:shadow-lg"
          >
            <div className="flex justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="text-gray-500 text-xs">{plan.description}</p>
              </div>
              <span className="text-sm bg-[#8BC342]/30 text-gray-700 px-3 py-1 rounded-lg font-medium">
                {plan.badge}
              </span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-bold">
                ${plan.price}
              </span>
              <span className="text-gray-600 text-sm">/Month</span>
            </div>

            <button
              className={`w-full py-2 rounded-md font-medium flex justify-center items-center gap-2 border transition-colors ${plan.price === 0
                  ? 'text-black border-green-500 hover:bg-green-50'
                  : 'bg-[#8BC342] text-white hover:bg-[#6fa332]'
                }`}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-medium mb-2">Features you got</h3>
              <ul className="text-sm border border-gray-100 rounded-md px-4 py-2 space-y-4 text-gray-700">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="list-disc list-inside">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
