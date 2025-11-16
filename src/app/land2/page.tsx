'use client';

import React from 'react';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function Landing2Page() {
    const menuItems = [
        { label: 'AMATEURS', href: '/amateurs' },
        { label: 'PROS', href: '/pro-players' },
        { label: 'CENTERS', href: '/centers' },
        { label: 'SHOPS', href: '/shops' },
        { label: 'PARTNERS', href: '/partners' },
        { label: 'ABOUT US', href: '/about' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Header */}
            <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200">
                {/* Logo */}
                <div className="text-2xl font-black text-gray-900 tracking-tight">
                    BOWLERS NETWORK
                </div>

                {/* Menu Items */}
                <div className="flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* User Icon */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors" style={{ backgroundColor: '#86D864' }}>
                        <UserCircle className="w-6 h-6 text-white" />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-start overflow-hidden">
                {/* Right Side: Image (50% width, full height) */}
                <div className="absolute right-0 top-0 w-1/2 h-full">
                    <Image
                        src="/land2/hero_section.jpg"
                        alt="Hero Section Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content Container - Overlaps onto image */}
                <div className="relative z-10 w-full px-16 pt-32">
                    {/* Main Heading */}
                    <div className="mb-12">
                        <h1 className="text-6xl font-black leading-[1.1] mb-0" style={{ color: '#86D864' }}>
                            JOIN THE ULTIMATE
                        </h1>
                        <h2 className="text-8xl font-black leading-[1.1] text-black">
                            BOWLING
                        </h2>
                        <h2 className="text-8xl font-black leading-[1.1] text-black">
                            NETWORK
                        </h2>
                    </div>

                    {/* Description Box */}
                    <div className="mb-10 bg-white/95 backdrop-blur-sm p-5 w-fit max-w-md">
                        <p className="text-xs font-bold text-gray-800 leading-relaxed uppercase">
                            Connect with bowlers, pros, centers, and shops. Share your passion, improve your game, and access exclusive resources.
                        </p>
                    </div>

                    {/* Register Button */}
                    <button
                        className="text-white font-black text-sm px-10 py-3 rounded-full transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                        style={{ backgroundColor: '#86D864' }}
                    >
                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                        REGISTER NOW
                    </button>
                </div>
            </section>
        </div>
    );
}