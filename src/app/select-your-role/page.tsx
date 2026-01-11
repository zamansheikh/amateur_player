'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

// Define the role interface
interface Role {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export default function SelectYourRole() {
  const [selectedRole, setSelectedRole] = useState<string>('amateur');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonRole, setComingSoonRole] = useState<string>('');
  const router = useRouter();

  const roles: Role[] = [
    {
      id: "amateur",
      title: "Amateur",
      description:
        "The Amateur Player is a standard user role designed for recreational and league bowlers. This role emphasizes engagement, progression, and community interaction through XP-based activities and trading card customization.",
      badge: "Free",
      badgeColor: "bg-green-100 text-green-800",
    },
    {
      id: "pro-player",
      title: "Pro Player",
      description:
        "The Amateur Player is a standard user role designed for recreational and league bowlers. This role emphasizes engagement, progression, and community interaction through XP-based activities and trading card customization.",
      badge: "Premium",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "bowling-center",
      title: "Bowling Center",
      description:
        "The Amateur Player is a standard user role designed for recreational and league bowlers. This role emphasizes engagement, progression, and community interaction through XP-based activities and trading card customization.",
      badge: "Premium",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "manufacturer",
      title: "Manufacturer",
      description:
        "The Amateur Player is a standard user role designed for recreational and league bowlers. This role emphasizes engagement, progression, and community interaction through XP-based activities and trading card customization.",
      badge: "Premium",
      badgeColor: "bg-blue-100 text-blue-800",
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      if (selectedRole === 'amateur') {
        router.push(`/signin?role=${selectedRole}`);
      } else if (selectedRole === 'pro-player') {
        // Redirect to another website in the same tab
        window.location.href = 'https://pros.bowlersnetwork.com/';
      } else if (selectedRole === 'bowling-center') {
        setComingSoonRole('Bowling Center');
        setShowComingSoon(true);
      } else if (selectedRole === 'manufacturer') {
        setComingSoonRole('Manufacturer');
        setShowComingSoon(true);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
          <Link href="/" className="mb-6 md:mb-8">
            <Image
              src="/logo/logo.png"
              alt="Logo"
              width={80}
              height={80}
              unoptimized
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Select Your Role
          </h1>
          <p className="text-sm md:text-base text-gray-600 text-center">
            Choose your account type to get started
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
          {roles.map((role) => {
            const isSelected = role.id === selectedRole;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${isSelected
                    ? 'transform scale-105'
                    : ''
                  }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-4 md:left-6 z-10">
                  <span className={`px-3 py-1 text-xs md:text-sm font-medium rounded-full shadow-sm ${role.badge === 'Free' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {role.badge}
                  </span>
                </div>

                {/* Card */}
                <div
                  className={`relative p-5 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${isSelected
                      ? 'border-green-500 text-white shadow-lg'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 shadow-sm'
                    }`}
                  style={isSelected ? {
                    background: 'linear-gradient(134deg, #425D1F 0%, #8BC342 100%)'
                  } : {}}
                >
                  {/* Radio Button and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={isSelected}
                        onChange={() => setSelectedRole(role.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                          ? 'border-white bg-white'
                          : 'border-gray-300 bg-white'
                        }`}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        )}
                      </div>
                    </div>
                    <h2 className={`text-lg md:text-xl font-semibold ${isSelected ? 'text-white' : 'text-gray-900'
                      }`}>
                      {role.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className={`text-xs md:text-sm leading-relaxed ${isSelected ? 'text-green-100' : 'text-gray-600'
                    }`}>
                    {role.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full md:w-auto text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
            style={{
              backgroundColor: !selectedRole ? '#d1d5db' : '#8BC342',
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#7aa838';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = '#8BC342';
              }
            }}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto p-6 md:p-8 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Animated Coming Soon Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#8BC342] to-[#425D1F] rounded-full flex items-center justify-center animate-pulse">
                    <div className="text-4xl md:text-5xl">🚀</div>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                Coming Soon!
              </h2>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 mb-2">
                <span className="font-semibold text-gray-900">{comingSoonRole}</span> role is coming soon.
              </p>
              <p className="text-xs md:text-sm text-gray-500 mb-8">
                We're working hard to bring this feature to you. Stay tuned!
              </p>

              {/* Button */}
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#8BC342] to-[#7ac85a] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm md:text-base"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}