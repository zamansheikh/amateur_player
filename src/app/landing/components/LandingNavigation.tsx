'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LandingNavigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

                    {/* Desktop Navigation Links */}
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

                    {/* Desktop Sign In Button */}
                    <div className="hidden md:flex items-center">
                        <Link
                            href="/select-your-role"
                            className="bg-[#8BC342] hover:bg-[#6fa332] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-[#8BC342] hover:bg-gray-100 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-4">
                            <a 
                                href="#home" 
                                className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer px-4 py-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Home
                            </a>
                            <a 
                                href="#about" 
                                className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer px-4 py-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                About Us
                            </a>
                            <a 
                                href="#features" 
                                className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer px-4 py-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Features
                            </a>
                            <a 
                                href="#pricing" 
                                className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer px-4 py-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Pricing
                            </a>
                            <a 
                                href="#contact" 
                                className="text-gray-700 hover:text-[#8BC342] font-medium transition-colors cursor-pointer px-4 py-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                Contact
                            </a>
                            <div className="px-4 pt-2">
                                <Link
                                    href="/select-your-role"
                                    className="block w-full text-center bg-[#8BC342] hover:bg-[#6fa332] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default LandingNavigation;
