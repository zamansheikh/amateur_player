'use client';

import React, { useState, useEffect } from 'react';
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

    interface BoardMember {
        key: string;
        src: string;
        name: string;
        title: string;
        short: string;
        description: string;
        bgClass: string;
        position: string;
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

    const boardMembers = [
        { key: 'norm', src: '/pro_teams/norm duke pic.webp', name: 'Norm Duke', title: 'Vice President', short: 'Hall of Famer and Vice President guiding strategy with precision, integrity, and respect for the game', description: 'Norm Duke is Vice President of BowlersNetwork.com and one of the most accomplished competitors in the history of the sport. A PBA Hall of Famer whose success spans multiple decades, Norm is respected for his precision, adaptability, and professionalism. Deeply committed to family and mentorship, Norm provides strategic guidance, player leadership, and a steady voice rooted in integrity and respect for the game.', bgClass: 'bg-blue-100', position: 'top' },
        { key: 'chuck', src: '/pro_teams/Chuck 1.webp', name: 'Chuck Gardner', title: 'Owner & Secretary-Treasurer', short: 'Youth-first leader and Bowl4Life founder committed to scholarships, stewardship, and integrity.', description: 'Chuck Gardner serves as Secretary and Treasurer of BowlersNetwork.com. Alongside his wife Deborah, he founded the Bowl4Life Foundation, which has awarded nearly $1 million in youth bowling scholarships nationwide.\n\nA member of the South Carolina USBC Hall of Fame, Chuck provides governance oversight, financial stewardship, and values-based leadership rooted in service, integrity, and family.', bgClass: 'bg-red-100', position: 'top' },
        { key: 'parker', src: '/pro_teams/Parker Bohn Pic.webp', name: 'Parker Bohn III', title: 'Owner & Board Member', short: 'Hall of Famer, lifelong Brunswick staff member, and legacy-driven coach committed to family and teaching.', description: 'Parker Bohn III is a PBA Hall of Famer and board member of BowlersNetwork.com. A career-long Brunswick professional staff member, Parker has represented the brand and the sport with consistency and class for more than four decades.\n\nFamily and legacy are central to Parker\'s life. Alongside his family, he operates Bohn\'s Elite Training, where bowlers of all ages train using modern technology and elite instruction. His commitment to teaching, sportsmanship, and long-term development strengthens BowlersNetwork\'s foundation.', bgClass: 'bg-cyan-100', position: 'top' },
        { key: 'liz', src: '/pro_teams/Liz Johnson pic.webp', name: 'Liz Johnson', title: 'Board Member', short: 'All-time great and Hall of Famer helping shape excellence, opportunity, and athlete advocacy.', description: 'Liz Johnson is one of the most accomplished bowlers of all time and a board member of BowlersNetwork.com. A multiple-time major champion and Hall of Famer, Liz is known for her unmatched accuracy, preparation, and mental toughness.\n\nLiz is a role model for generations of bowlers and brings an athlete-first, excellence-driven perspective to BowlersNetwork\'s leadership.', bgClass: 'bg-cyan-100', position: 'center' },
        { key: 'carolyn', src: '/pro_teams/carolyn dorin ballard pic.webp', name: 'Carolyn Dorin-Ballard', title: 'Board Member', short: 'PWBA and USBC Hall of Famer dedicated to faith, family, coaching, and raising the standard of competition.', description: 'Carolyn Dorin-Ballard is a PWBA and USBC Hall of Famer and board member of BowlersNetwork.com. Her career has been defined by championship success, professionalism, and leadership.\n\nGrounded in her faith and family, Carolyn, together with her husband, Del Ballard Jr., operates Ballards Bowling Academy and multiple pro shops. Their work focuses on teaching fundamentals, confidence, and character while growing the game at the grassroots level.', bgClass: 'bg-red-100', position: 'top' },
        { key: 'marshall', src: '/pro_teams/marshall kent pic.webp', name: 'Marshall Kent', title: 'Co-Founder & Board Member', short: 'PBA champion and co-founder bringing the athlete\'s voice into platform leadership and long-term growth.', description: 'Marshall Kent is a world-class professional bowler and co-founder of BowlersNetwork.com. A multiple-time PBA Tour champion and major winner, Marshall brings the athlete\'s perspective directly into the leadership of the platform. His role ensures BowlersNetwork is built by bowlers, for bowlers—creating new opportunities for professionals to build lasting income, visibility, and relevance beyond competition', bgClass: 'bg-blue-100', position: 'top' },
    ];

    const jayFettig = {
        key: 'jay',
        src: '/land2_opt/jay_fettig.webp',
        name: 'JAY FETTIG',
        title: 'Founder & CEO',
        short: 'Jay Fettig is the Founder and CEO of BowlersNetwork.com and co-founder of JMar Entertainment. A lifelong bowler and entrepreneur, Jay created BowlersNetwork with a singular vision: to unify the bowling industry under one modern digital platform that empowers athletes, strengthens local centers, and delivers measurable value to sponsors and fans.',
        description: 'Jay Fettig is the Founder and CEO of BowlersNetwork.com and co-founder of JMar Entertainment. A lifelong bowler and entrepreneur, Jay created BowlersNetwork with a singular vision: to unify the bowling industry under one modern digital platform that empowers athletes, strengthens local centers, and delivers measurable value to sponsors and fans.\n\nJay’s leadership is driven by faith, family, and purpose. He has been married to his wife, Wendy, for over 30 years and is a proud father and grandfather. Throughout his career, Jay has owned and operated multiple businesses, some highly successful, others that fell short, but each experience reinforced a core belief: when passion drives the mission, the likelihood of success increases dramatically. Today, that philosophy fuels BowlersNetwork, where a team of deeply passionate people is aligned around one common goal growing the sport of bowling the right way, together.',
        bgClass: 'bg-blue-100',
        position: 'center'
    };

    const openModal = (member: BoardMember) => { setSelectedMember(member); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setSelectedMember(null); };

    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeModal(); }
        if (modalOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalOpen]);

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
                        src="/land2_opt/hero_section.webp"
                        alt="Hero Section Background"
                        fill
                        className="object-cover"
                        unoptimized
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
                                            src="/land2_opt/amateurs.webp"
                                            alt="Amateurs"
                                            width={200}
                                            height={260}
                                            unoptimized
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
                                            src="/land2_opt/middle_unknown.webp"
                                            alt="Experience"
                                            width={200}
                                            height={400}
                                            unoptimized
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Item 4: Centers (top-right) */}
                                <div className="row-span-1">
                                    <div className="rounded-t-2xl overflow-hidden h-64">
                                        <Image
                                            src="/land2_opt/centers.webp"
                                            alt="Centers"
                                            width={200}
                                            height={260}
                                            unoptimized
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
                                            src="/land2_opt/pros.webp"
                                            alt="Pros"
                                            width={200}
                                            height={260}
                                            unoptimized
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
                                            src="/land2_opt/shops.webp"
                                            alt="Shops"
                                            width={200}
                                            height={260}
                                            unoptimized
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
                            src="/land2_opt/all_in_one.webp"
                            alt="All-in-One Bowling Experience"
                            width={1400}
                            height={600}
                            unoptimized
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
                                    src="/land2_opt/15.webp"
                                    alt="Bowling Experience"
                                    width={400}
                                    height={300}
                                    unoptimized
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
                        src="/land2_opt/background_green.webp"
                        alt="Background"
                        unoptimized
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
                                src="/land2_opt/mobile_phone_mockup.webp"
                                alt="Mobile Phone Mockup"
                                width={1200}
                                height={1000}
                                unoptimized
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
                                src="/land2_opt/trading_card_section.webp"
                                alt="Trading Cards"
                                width={600}
                                height={500}
                                unoptimized
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Beyond the Chatter — Build Your Brand Section */}
            <section className="py-20 px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Beyond the Chatter — Build Your Brand
                    </h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                        Turn every game, every fan interaction, and every sponsor connection into lasting value.
                    </p>

                    {/* Center Image */}
                    <div className="mb-16">
                        <Image
                            src="/land2_opt/beyond_the_chatter_section.webp"
                            alt="Beyond the Chatter"
                            width={1000}
                            height={600}
                            unoptimized
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
                        src="/land2_opt/smarter_center_section.webp"
                        alt="Bowling Center"
                        unoptimized
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

            {/* Streamline Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Left Side: Dashboard Image */}
                        <div className="flex-1 relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/land2_opt/streamline_section_main.webp"
                                    alt="Streamline Dashboard"
                                    width={800}
                                    unoptimized
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-12 text-right">
                                STREAMLINE YOUR CENTER.<br />
                                SUCCEED TOGETHER.
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Left large image */}
                                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                                    <Image
                                        src="/land2_opt/smarter_center_section.webp"
                                        alt="Smarter Center"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                                
                                {/* Right column with 2 images */}
                                <div className="flex flex-col gap-4 h-[400px]">
                                    <div className="relative flex-1 rounded-2xl overflow-hidden shadow-lg">
                                        <Image
                                            src="/land2_opt/4.webp"
                                            alt="Feature 1"
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative flex-1 rounded-2xl overflow-hidden shadow-lg">
                                        <Image
                                            src="/land2_opt/5.webp"
                                            alt="Feature 2"
                                            unoptimized
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnership Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Container with Background Image - Top Section */}
                    <div 
                        className="relative rounded-3xl overflow-hidden mb-8"
                        style={{
                            backgroundImage: 'url(/land2_opt/1.webp)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/40"></div>

                        {/* Content Container - Top Section */}
                        <div className="relative z-10 p-12 flex items-center justify-between gap-8">
                            {/* Left: Heading Box */}
                            <div className="flex-1 bg-gradient-to-r from-[#86D864] to-[#7ac85a] rounded-xl p-8">
                                <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
                                    Reach Bowlers.<br />
                                    Drive Demand.<br />
                                    Build Partnerships.
                                </h2>
                                <p className="text-white/95 text-sm mt-4">
                                    Showcase your products, run targeted promotions, and connect directly with centers and pros through the BowlersNetwork ecosystem.
                                </p>
                            </div>

                            {/* Right: Feature Products Box */}
                            <div className="flex-1 bg-gradient-to-r from-[#86D864] to-[#7ac85a] rounded-xl p-8">
                                <div className="flex items-start gap-3">
                                    <div className="text-white mt-1">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-lg mb-2">Feature Products</h3>
                                        <p className="text-white/95 text-sm">
                                            Highlight gear and apparel in a curated shopping experience.
                                        </p>
                                        <div className="mt-3 flex gap-1">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Form and Image */}
                    <div className="grid grid-cols-2 gap-12 items-start">
                        {/* Left: Partnership Form */}
                        <div>
                            <form className="bg-white rounded-lg p-8 shadow-lg">
                                <div className="mb-6">
                                    <label className="block text-gray-800 font-bold text-sm mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 border border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-800 font-bold text-sm mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your Company"
                                        className="w-full px-4 py-3 border border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-800 font-bold text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="you@email.com"
                                        className="w-full px-4 py-3 border border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400"
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="block text-gray-800 font-bold text-sm mb-2">Message</label>
                                    <textarea
                                        placeholder="Tell us about your partnership goals"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white font-black text-sm px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
                                    style={{ backgroundColor: '#86D864' }}
                                >
                                    <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                                    PARTNER WITH US
                                </button>
                            </form>
                        </div>

                        {/* Right: Product Mockup Image */}
                        <div className="relative h-[500px]">
                            <Image
                                src="/land2_opt/7.webp"
                                unoptimized
                                alt="Partnership Features"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

           

            {/* Be Seen Where The Bowling World Connects Section */}
            <section 
                className="relative py-32 px-8 rounded-3xl mx-8 mb-12 overflow-hidden"
                style={{
                    backgroundImage: 'url(/land2_opt/19.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                        Be Seen Where The Bowling<br />World Connects
                    </h2>
                    <p className="text-xl text-white/95 mb-8">
                        Engage players, fans, and brands with authentic, community-driven activations.
                    </p>
                    <button className="px-8 py-3 bg-[#86D864] text-white font-black rounded-full hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto">
                        <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                        PARTNER WITH US
                    </button>
                </div>
            </section>

            {/* Why Partner With Us Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 gap-16 items-start">
                        {/* Left: Content */}
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                                Why Partner With Us?
                            </h2>
                            <p className="text-lg text-gray-700 mb-8">
                                Reach 67M+ bowlers through TV, OTT, podcasts, social, and live events.
                            </p>

                            {/* Features List */}
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#86D864] font-bold text-xl mt-1">•</span>
                                    <span className="text-gray-700">
                                        Access a massive, loyal audience across digital and physical touchpoints.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#86D864] font-bold text-xl mt-1">•</span>
                                    <span className="text-gray-700">
                                        Integrate into broadcasts, podcasts, events, and trading cards.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#86D864] font-bold text-xl mt-1">•</span>
                                    <span className="text-gray-700">
                                        Build authentic connections with a community-driven sport.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#86D864] font-bold text-xl mt-1">•</span>
                                    <span className="text-gray-700">
                                        Drive measurable ROI with attribution + analytics built in.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Right: Image */}
                        <div className="relative h-[500px]">
                            <Image
                                src="/land2_opt/20.webp"
                                unoptimized
                                alt="Analytics Dashboard"
                                fill
                                className="object-cover rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Driven by Passion Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 gap-12">
                        {/* Left: Image */}
                        <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src="/land2_opt/22.webp"
                                unoptimized
                                alt="Bowling Center Community"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Right: Content */}
                        <div>
                            {/* Heading */}
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                                Driven by Passion.<br />Built for Bowlers.
                            </h2>

                            {/* Subheading */}
                            <p className="text-lg text-gray-600 mb-8">
                                We're on a mission to unite the bowling world — from amateurs and pros to centers and brands — through technology, community, and innovation.
                            </p>

                            {/* Mission and Vision Cards */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* Our Mission */}
                                <div className="bg-green-50 rounded-xl p-6">
                                    <h3 className="text-gray-900 font-black text-lg mb-3">Our Mission</h3>
                                    <p className="text-gray-700 text-sm mb-4">
                                        Founded by passionate bowlers, Bowlers Network began with a simple vision: to transform every lane into a connected experience.
                                    </p>
                                    <a href="#" className="text-[#86D864] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                        Read More <span>›</span>
                                    </a>
                                </div>

                                {/* Our Vision */}
                                <div className="bg-blue-50 rounded-xl p-6">
                                    <h3 className="text-gray-900 font-black text-lg mb-3">Our Vision</h3>
                                    <p className="text-gray-700 text-sm mb-4">
                                        Founded by passionate bowlers, Bowlers Network began with a simple vision: to transform every lane into a connected experience.
                                    </p>
                                    <a href="#" className="text-[#86D864] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                        Read More <span>›</span>
                                    </a>
                                </div>
                            </div>

                            {/* Our Story */}
                            <div className="bg-gray-100 rounded-xl p-6">
                                <h3 className="text-gray-900 font-black text-lg mb-3">Our Story</h3>
                                <p className="text-gray-700 text-sm mb-4">
                                    Founded by passionate bowlers, Bowlers Network began with a simple vision: to transform every lane into a connected experience. What started with a single lane and a big dream has grown into a platform that brings together players, centers, pros, and brands.
                                </p>
                                <a href="#" className="text-[#86D864] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    Read More <span>›</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           

            {/* Contact Section */}
            <section className="bg-gray-100 py-20 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 gap-16">
                        {/* Left: Contact Info */}
                        <div>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
                                Reach Out Anytime
                            </h2>
                            <p className="text-gray-700 text-lg mb-12">
                                Our team is here to support, collaborate, and create meaningful connections in the bowling community.
                            </p>

                            {/* Email */}
                            <div className="mb-8">
                                <p className="text-gray-900 font-black text-xs mb-2 tracking-widest">EMAIL</p>
                                <a href="mailto:contact@company.com" className="text-gray-600 hover:text-[#86D864] transition-colors">
                                    contact@company.com
                                </a>
                            </div>

                            {/* Phone */}
                            <div className="mb-12">
                                <p className="text-gray-900 font-black text-xs mb-2 tracking-widest">PHONE</p>
                                <a href="tel:+11234567890" className="text-gray-600 hover:text-[#86D864] transition-colors">
                                    (123) 456-7890
                                </a>
                            </div>

                            {/* Map */}
                            <div className="mb-12 relative h-48 rounded-lg overflow-hidden">
                                <Image
                                    src="/land2_opt/map.webp"
                                    unoptimized
                                    alt="Location Map"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Social Links */}
                            <div>
                                <p className="text-gray-900 font-black text-xs mb-4 tracking-widest">FOLLOW US</p>
                                <div className="flex items-center gap-6">
                                    <a href="#" className="text-gray-900 hover:text-[#86D864] transition-colors text-2xl">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C3.422 17.8 2.633 17.376 2.633 17.376c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .319.216.694.824.576C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-900 hover:text-[#86D864] transition-colors text-2xl">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.5 8.5h-2c-.276 0-.5.224-.5.5v2h2.5l-.5 2h-2v7h-2v-7H9v-2h1.5V8.5c0-1.38 1.12-2.5 2.5-2.5h2v2z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-900 hover:text-[#86D864] transition-colors text-2xl">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-3 1z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="bg-white rounded-2xl p-8">
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-gray-900 font-black text-sm mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 border-2 border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-black text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="you@email.com"
                                        className="w-full px-4 py-3 border-2 border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-black text-sm mb-2">Message</label>
                                    <textarea
                                        placeholder="Tell us about your partnership goals"
                                        rows={5}
                                        className="w-full px-4 py-3 border-2 border-[#86D864] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#86D864] focus:border-transparent placeholder-gray-400 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#86D864] text-white font-black rounded-lg hover:shadow-lg transition-shadow"
                                >
                                    SEND MESSAGE
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-300 mt-16 pt-8">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 text-sm">
                                @ BowlersNetwork 2025
                            </p>
                            <div className="flex items-center gap-8">
                                <a href="#" className="text-[#86D864] hover:text-[#7ac85a] text-sm font-semibold transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-[#86D864] hover:text-[#7ac85a] text-sm font-semibold transition-colors">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-[#86D864] hover:text-[#7ac85a] text-sm font-semibold transition-colors">
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted Partners Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                            Our Trusted Partners
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Proudly collaborating with leading brands and organizations to grow the bowling community.
                        </p>
                    </div>

                    {/* Partners Grid */}
                    <div className="grid grid-cols-4 gap-8">
                        {/* Partner 1 - Ahrefs */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <svg className="w-32 h-auto" viewBox="0 0 200 60" fill="none">
                                    <text x="10" y="45" fontSize="36" fontWeight="bold" fill="#FF6600">ahrefs</text>
                                </svg>
                            </div>
                        </div>

                        {/* Partner 2 - Microsoft */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <svg className="w-32 h-auto" viewBox="0 0 200 60" fill="none">
                                    <rect x="20" y="20" width="12" height="12" fill="#F25022"/>
                                    <rect x="35" y="20" width="12" height="12" fill="#7FBA00"/>
                                    <rect x="20" y="35" width="12" height="12" fill="#00A4EF"/>
                                    <rect x="35" y="35" width="12" height="12" fill="#FFB900"/>
                                    <text x="60" y="40" fontSize="18" fontWeight="bold" fill="#333">Microsoft</text>
                                </svg>
                            </div>
                        </div>

                        {/* Partner 3 - HelpScout */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <text className="font-black text-lg text-gray-900">HelpScout</text>
                            </div>
                        </div>

                        {/* Partner 4 - Jotform */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <text className="font-black text-lg text-gray-900">Jotform</text>
                            </div>
                        </div>

                        {/* Partner 5 - Amazon */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <text className="font-black text-lg text-gray-900">amazon</text>
                            </div>
                        </div>

                        {/* Partner 6 - Notion */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <text className="font-black text-lg text-gray-900">Notion</text>
                            </div>
                        </div>

                        {/* Partner 7 - LinkedIn */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <text className="font-black text-lg text-blue-600">LinkedIn</text>
                            </div>
                        </div>

                        {/* Partner 8 - Circle */}
                        <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center h-24 hover:shadow-lg transition-shadow">
                            <div className="text-center">
                                <text className="font-black text-lg text-blue-600">Circle</text>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The People Behind The Network Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                            The People Behind The Network
                        </h2>
                        <p className="text-lg text-gray-600">
                            United by our love for bowling, innovation, and connecting players worldwide.
                        </p>
                    </div>

                    {/* Team Member Card */}
                    <div className="grid grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
                        {/* Left: Team Member Image */}
                        <div className="relative h-96 rounded-3xl overflow-hidden bg-blue-100">
                            <Image
                                src={jayFettig.src}
                                unoptimized
                                alt={jayFettig.name}
                                fill
                                className="object-cover"
                                style={{ objectPosition: jayFettig.position }}
                            />
                        </div>

                        {/* Right: Team Member Info */}
                        <div>
                            <h3 className="text-gray-900 font-black text-2xl mb-3">{jayFettig.name}</h3>
                            
                            <div className="inline-block bg-[#86D864] text-white font-black px-4 py-2 rounded-lg mb-6">
                                {jayFettig.title}
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                                {jayFettig.short}
                            </p>

                            <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); openModal(jayFettig); }}
                                className="inline-flex items-center gap-2 border-2 border-[#86D864] text-[#86D864] font-bold px-6 py-3 rounded-lg hover:bg-[#86D864] hover:text-white transition-all"
                            >
                                Read More <span>›</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Board of Directors Section */}
            <section className="py-20 px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="grid grid-cols-2 gap-12 items-start mb-16">
                        <h2 className="text-5xl md:text-4xl font-black text-gray-900 leading-tight">
                            Executive Leadership & Board of Directors
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Executive Leadership represents the operational and fiduciary backbone of BowlersNetwork, balancing innovation, athlete advocacy, and responsible governance.
                        </p>
                    </div>

                    {/* Board Members Grid */}
                    <div className="grid grid-cols-3 gap-8">
                        {boardMembers.map((member) => (
                            <div key={member.key}>
                                <div className={`relative h-64 rounded-2xl overflow-hidden ${member.bgClass} mb-4`}>
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-[#86D864] text-white font-black text-xs px-3 py-1 rounded-full">
                                            {member.title}
                                        </span>
                                    </div>
                                    <Image
                                        src={member.src}
                                        unoptimized
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                        style={{ objectPosition: member.position || 'center' }}
                                    />
                                </div>
                                <h3 className="text-gray-900 font-black text-lg mb-2">{member.name}</h3>
                                <p className="text-gray-700 text-sm leading-relaxed mb-3">{member.short}</p>
                                <a href="#" onClick={(e) => { e.preventDefault(); openModal(member); }} className="text-[#86D864] font-semibold text-sm hover:underline">
                                    Read More...
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Modal */}
                    {modalOpen && selectedMember && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/50" onClick={closeModal}></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2">
                                <div className="p-12 flex flex-col justify-between">
                                    <div>
                                        <div className="inline-block bg-[#86D864] text-white font-black px-4 py-2 rounded-lg mb-4 text-sm">
                                            {selectedMember.title}
                                        </div>
                                        <h3 className="text-3xl font-black mb-6 text-gray-900">{selectedMember.name}</h3>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{selectedMember.description}</p>
                                    </div>
                                </div>
                                <div className="relative h-64 md:h-auto bg-gray-200">
                                    <Image src={selectedMember.src} alt={selectedMember.name} unoptimized fill className="object-cover" style={{ objectPosition: selectedMember.position || 'center' }} />
                                </div>
                                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 bg-white rounded-full p-2 shadow hover:bg-gray-100">✕</button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Our People, Our Power Section */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                            Our People, Our Power
                        </h2>
                        <p className="text-lg text-gray-600">
                            Dedicated professionals bringing innovation, passion, and teamwork to every roll.
                        </p>
                    </div>

                    {/* Team Members Grid */}
                    <div className="grid grid-cols-3 gap-8">
                        {[
                            { src: '/team_headshots/Nahian Ferdouse.webp', name: 'Nahian Ferdouse', role: 'Business Intelligence Specialist', position: 'top' },
                            { src: '/team_headshots/mumit_prottoy.webp', name: 'Mumit Prottoy', role: 'Lead Developer', position: 'top' },
                            { src: '/team_headshots/Shuvo Headshot.webp', name: 'Asraful Alam Shuvo', role: 'Marketing Lead', position: 'center' },
                            { src: '/team_headshots/Azmain Hossain Sabbir-Photo.webp', name: 'Azmain Hossain Sabbir', role: 'Marketing Specialist', position: 'center' },
                            { src: '/team_headshots/Sadia Durdana Adrita.webp', name: 'Sadia Durdana Adrita', role: 'Content Specialist', position: 'center' },
                            { src: '/team_headshots/Hasibul Hasan Pranto.webp', name: 'Hasibul Hasan Pranto', role: 'Creative Designer', position: 'top' },
                            { src: '/team_headshots/Brittany Kolatzny-Headshot.webp', name: 'Brittany Kolatzny', role: 'Team Member', position: 'center' },
                        ].map((member) => (
                            <div key={member.src} className="rounded-xl overflow-hidden shadow-lg">
                                <div className="relative h-64 bg-cyan-100">
                                    <Image
                                        src={member.src}
                                        alt={member.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        style={{ objectPosition: member.position || 'center' }}
                                    />
                                </div>
                                <div className="bg-[#86D864] text-white p-4">
                                    <h3 className="font-black text-lg">{member.name}</h3>
                                    <p className="text-sm font-semibold">{member.role ?? 'Team Member'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}