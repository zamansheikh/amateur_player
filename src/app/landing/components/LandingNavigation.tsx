'use client';

import Link from 'next/link';
import Image from 'next/image';

const LandingNavigation = () => {
    return (
        <nav className="w-full bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo/logo.png"
                                alt="BowlersNetwork Logo"
                                width={32}
                                height={32}
                                className="rounded"
                            />
                            <span className="text-xl font-bold">
                                <span className="text-gray-900">Bowlers</span>
                                <span className="text-[#8BC342]">Network</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a 
                            href="#home" 
                            className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Home
                        </a>
                        <a 
                            href="#about" 
                            className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            About Us
                        </a>
                        <a 
                            href="#features" 
                            className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Features
                        </a>
                        <a 
                            href="#pricing" 
                            className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Pricing
                        </a>
                        <a 
                            href="#contact" 
                            className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Contact
                        </a>
                    </div>

                    {/* Sign In Button */}
                    <div className="flex items-center">
                        <Link
                            href="/signin"
                            className="bg-[#8BC342] hover:bg-[#6fa332] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile menu button (optional for future) */}
                    <div className="md:hidden">
                        <Link
                            href="/signin"
                            className="bg-[#8BC342] hover:bg-[#6fa332] text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavigation;
