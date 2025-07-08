'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
            window.location.href = 'https://bowlersnet.vercel.app/signin';
        }
            
        else if (selectedRole === 'bowling-center') {
            //Show a message that this role is not available yet
            alert('This role is not available yet. Please select another role.');
        }
        else if (selectedRole === 'manufacturer') {
            //Show a message that this role is not available yet
            alert('This role is not available yet. Please select another role.');
        }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <Link href="/" className="mb-8">
            <Image
              src="/logo/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Role
          </h1>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {roles.map((role) => {
            const isSelected = role.id === selectedRole;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 ${
                  isSelected
                    ? 'transform scale-105'
                    : ''
                }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-6 z-10">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
                    role.badge === 'Free' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {role.badge}
                  </span>
                </div>

                {/* Card */}
                <div
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-green-500 text-white shadow-lg'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 shadow-sm'
                  }`}
                  style={isSelected ? {
                    background: 'linear-gradient(134deg, #425D1F 0%, #8BC342 100%)'
                  } : {}}
                >
                  {/* Radio Button and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={isSelected}
                        onChange={() => setSelectedRole(role.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-white bg-white'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        )}
                      </div>
                    </div>
                    <h2 className={`text-xl font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-900'
                    }`}>
                      {role.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? 'text-green-100' : 'text-gray-600'
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
            className="text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
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
    </div>
  );
}