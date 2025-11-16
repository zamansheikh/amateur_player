'use client';

import React from 'react';
import Image from 'next/image';
import { UserCircle, TrendingUp, Link as LucideLink, Calendar, MapPin } from 'lucide-react';
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
                <div className="absolute right-0 top-0 w-1/2 h-[700px]">
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

            {/* Built for Every Bowler Section */}
            <section className="py-16 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Content */}
                    <div className="flex items-start gap-12">
                        {/* Left: Images Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-3 gap-4" style={{ gridTemplateRows: 'auto auto' }}>
                                {/* Item 1: Amateurs (top-left) */}
                                <div className="row-span-1">
                                    <div className="rounded-t-2xl overflow-hidden h-64">
                                        <Image
                                            src="/land2/amateurs.jpg"
                                            alt="Amateurs"
                                            width={200}
                                            height={260}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-b-1xl text-white text-center py-2 font-bold text-sm" style={{ backgroundColor: '#86D864' }}>
                                        Amateurs
                                    </div>
                                </div>

                                {/* Item 3: Middle Unknown (top-center, tall) */}
                                <div className="row-span-2">
                                    <div className="rounded-2xl overflow-hidden h-148">
                                        <Image
                                            src="/land2/middle_unknown.jpg"
                                            alt="Experience"
                                            width={200}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Item 4: Centers (top-right) */}
                                <div className="row-span-1">
                                    <div className="rounded-t-2xl overflow-hidden h-64">
                                        <Image
                                            src="/land2/centers.jpg"
                                            alt="Centers"
                                            width={200}
                                            height={260}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-b-1xl text-white text-center py-2 font-bold text-sm" style={{ backgroundColor: '#86D864' }}>
                                        Centers
                                    </div>
                                </div>

                                {/* Item 2: Pros (bottom-left) */}
                                <div className="row-span-1">
                                    <div className="rounded-t-2xl overflow-hidden h-64">
                                        <Image
                                            src="/land2/pros.jpg"
                                            alt="Pros"
                                            width={200}
                                            height={260}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-b-1xl text-white text-center py-2 font-bold text-sm" style={{ backgroundColor: '#86D864' }}>
                                        Pros
                                    </div>
                                </div>

                                {/* Item 5: Shops (bottom-right) */}
                                <div className="row-span-1">
                                    <div className="rounded-t-2xl overflow-hidden h-64">
                                        <Image
                                            src="/land2/shops.jpg"
                                            alt="Shops"
                                            width={200}
                                            height={260}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="rounded-b-1xl text-white text-center py-2 font-bold text-sm" style={{ backgroundColor: '#86D864' }}>
                                        Shops
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text Content */}
                        <div className="flex-1 flex flex-col justify-start pt-4">
                            <h2 className="text-6xl font-black leading-tight text-black mb-8">
                                Built for<br />Every<br />Bowler
                            </h2>
                            <p className="text-base font-semibold text-gray-800 leading-relaxed">
                                Whether you're rolling your first ball, chasing a pro title, running a center, or stocking the shelves — Bowlers Network connects the whole bowling world.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* All-in-OneBowling Experience Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-black">
                        All-in-OneBowling Experience
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                        From casual play to pro competition — every feature you need, in one
                        connected platform.
                    </p>

                    <div className="mt-8 rounded-2xl overflow-hidden mx-auto max-w-5xl">
                        <Image
                            src="/land2/all_in_one.jpg"
                            alt="All-in-One Bowling Experience"
                            width={1400}
                            height={600}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Bowl Collect Compete Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Grid layout: 3 columns */}
                    <div className="grid grid-cols-3 gap-6 items-start">
                        {/* Left column - 2 boxes */}
                        <div className="flex flex-col gap-6">
                            {/* Box 1: Earn and Trade */}
                            <div className="bg-gray-100 rounded-2xl p-8 h-32 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#86D864' }}>
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Earn and Trade</div>
                                    <div className="text-sm text-gray-600">Exclusive digital bowling cards</div>
                                </div>
                            </div>

                            {/* Box 2: Connect */}
                            <div className="bg-gray-100 rounded-2xl p-8 h-32 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#86D864' }}>
                                    <LucideLink className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Connect</div>
                                    <div className="text-sm text-gray-600">and chat with fellow bowlers</div>
                                </div>
                            </div>
                        </div>

                        {/* Center column - heading, button, image */}
                        <div className="flex flex-col items-center text-center gap-6">
                            <h3 className="text-5xl md:text-6xl font-black leading-tight text-black">
                                Bowl<br />Collect<br />Compete
                            </h3>
                            <button className="inline-flex items-center gap-2 bg-[#86D864] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-shadow">
                                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                                EXPLORE THE FEATURES
                            </button>

                            <div className="w-full rounded-2xl overflow-hidden h-48">
                                <Image
                                    src="/land2/15.jpg"
                                    alt="Bowling Experience"
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right column - 2 boxes */}
                        <div className="flex flex-col gap-6">
                            {/* Box 3: Enter */}
                            <div className="bg-gray-100 rounded-2xl p-8 h-32 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#86D864' }}>
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Enter</div>
                                    <div className="text-sm text-gray-600">members-only tournaments and events</div>
                                </div>
                            </div>

                            {/* Box 4: Track */}
                            <div className="bg-gray-100 rounded-2xl p-8 h-32 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#86D864' }}>
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Track</div>
                                    <div className="text-sm text-gray-600">your stats, milestones, and progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Every Bowler Is a Card Section */}
            <section className="relative flex items-center justify-center py-0 px-0 min-h-[520px] bg-transparent overflow-visible">
                {/* Green Card Background */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[90vw] max-w-6xl h-[520px] rounded-3xl overflow-hidden z-0">
                    <Image
                        src="/land2/background_green.jpg"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content Layout */}
                <div className="relative z-10 w-full max-w-6xl flex items-center justify-between px-12 py-16">
                    {/* Left Side: Text Content */}
                    <div className="flex flex-col items-start justify-center w-1/2 pl-2">
                        <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                            Every Bowler<br />Is a Card
                        </h2>
                        <p className="text-lg text-white/90 mb-8 leading-relaxed">
                            Your stats. Your journey. Your legacy — collected, traded, and showcased.
                        </p>
                        <button className="inline-flex items-center gap-3 bg-[#86D864] text-white px-7 py-3 rounded-full font-bold text-base shadow-lg hover:bg-[#7acb5b] transition-colors">
                            <span className="w-3 h-3 rounded-full bg-white"></span>
                            CREATE YOUR CARD&nbsp;&rarr;
                        </button>
                    </div>

                    {/* Right Side: Mobile Mockup Overlapping */}
                    <div className="relative flex items-center justify-end w-3/4">
                        <div className="absolute right-0 top-0 ">
                            <Image
                                src="/land2/mobile_phone_mockup.png"
                                alt="Mobile Phone Mockup"
                                width={1200}
                                height={1000}
                                priority
                            />
                        </div>
                        {/* Spacer for layout */}
                        <div className="w-full h-[520px]"></div>
                    </div>
                </div>
            </section>

            {/* Trading Cards For Every Bowler Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 gap-16 items-center">
                        {/* Left Side: Text Content */}
                        <div>
                            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
                                Trading Cards For<br />Every Bowler
                            </h2>
                            <p className="text-base text-gray-700 mb-6 leading-relaxed">
                                Amateur or professional, your journey lives on a dynamic trading card that evolves with your game.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 font-bold text-lg">•</span>
                                    <div>
                                        <span className="font-bold text-gray-900">Dynamic Profiles:</span>
                                        <span className="text-gray-700"> High scores, analytics, levels, points, and followers — updated in real time.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 font-bold text-lg">•</span>
                                    <div>
                                        <span className="font-bold text-gray-900">Brand Connections:</span>
                                        <span className="text-gray-700"> Favorite brands and gear tied directly to your card.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 font-bold text-lg">•</span>
                                    <div>
                                        <span className="font-bold text-gray-900">Beyond Following:</span>
                                        <span className="text-gray-700"> Don't just follow... collect, trade, and showcase cards in the community.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-600 font-bold text-lg">•</span>
                                    <div>
                                        <span className="font-bold text-gray-900">Amateur Spotlight:</span>
                                        <span className="text-gray-700"> Weekend players get the same recognition as the pros.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Right Side: Trading Card Image */}
                        <div className="flex justify-center">
                            <Image
                                src="/land2/trading_card_section.png"
                                alt="Trading Cards"
                                width={600}
                                height={500}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Beyond the Lanes — Build Your Brand Section */}
            <section className="py-20 px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Beyond the Lanes — Build Your Brand
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                        Turn every game, every fan interaction, and every sponsor connection into lasting value.
                    </p>

                    {/* Center Image */}
                    <div className="mb-16">
                        <Image
                            src="/land2/beyond_the_lanes_section.png"
                            alt="Beyond the Lanes"
                            width={1000}
                            height={600}
                            className="w-full h-auto mx-auto rounded-2xl"
                        />
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Card 1: Manage Your Pro Profile */}
                        <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Manage Your Pro Profile
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Showcase your story, stats, and highlights.
                            </p>
                        </div>

                        {/* Card 2: Advanced Dashboards */}
                        <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Advanced Dashboards
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track analytics, audience growth, and performance.
                            </p>
                        </div>

                        {/* Card 3: Fan Challenges */}
                        <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Fan Challenges
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Engage your audience with interactive competitions.
                            </p>
                        </div>

                        {/* Card 4: Global Reach */}
                        <div className="bg-white rounded-2xl p-8 text-left shadow-sm">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                Global Reach
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Connect with sponsors and fans worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smarter Centers Section */}
            <section className="relative py-24 px-8 overflow-hidden rounded-3xl mx-8 mb-12">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
                    <Image
                        src="/land2/smarter_center_section.jpg"
                        alt="Bowling Center"
                        fill
                        className="object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="flex items-stretch gap-12">
                        {/* Left Side: Text Content */}
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="text-sm font-bold tracking-widest mb-4" style={{ color: '#86D864' }}>
                                RUN SMARTER. ENGAGE DEEPER.
                            </p>
                            <h2 className="text-6xl md:text-7xl font-black text-white leading-tight">
                                Smarter Centers.<br />Stronger Engagement.
                            </h2>
                        </div>

                        {/* Right Side: Text & Buttons */}
                        <div className="flex-1 bg-white rounded-3xl p-10 flex flex-col justify-center shadow-xl">
                            <p className="text-gray-700 text-lg leading-relaxed mb-10">
                                Streamline your center's operations and elevate the bowler experience with tools built to drive efficiency and growth.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button className="px-8 py-4 text-center font-bold text-lg border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-50 transition-colors">
                                    JOIN THE NETWORK
                                </button>
                                <button className="px-8 py-4 text-center font-bold text-lg text-white rounded-full shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#86D864' }}>
                                    <span className="w-3 h-3 rounded-full bg-white inline-block mr-3"></span>
                                    REQUEST A DEMO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}