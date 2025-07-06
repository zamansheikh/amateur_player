'use client';
import Link from 'next/link';
import Image from 'next/image';
import LandingNavigation from './components/LandingNavigation';
import Hero from './components/Hero';
import Organization from './components/Organization';
import About from './components/About';
import Partner from './components/Partner';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Contact from './components/Contact';

export default function LandingPage() {
    return (
        <div>
            <LandingNavigation />
            <Hero />
            <Organization />
            <About />
            <Partner />
            <Testimonials />
            <Pricing />
            <Contact />
        </div>
    );
}
