'use client';

import { useState } from 'react';
import { Play, Mic, Camera, Trophy, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function MediaPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Mock streaming shows data
    const streamingShows = [
        {
            id: 1,
            title: "BOWL TV LIVE",
            time: "Weekdays at 6:30 AM CT",
            description: "MORNING LANE TALK",
            image: "/api/placeholder/200/150"
        },
        {
            id: 2,
            title: "PRO TIPS WEEKLY",
            time: "Weekdays at 7:00 AM CT", 
            description: "TECHNIQUE FOCUS",
            image: "/api/placeholder/200/150"
        },
        {
            id: 3,
            title: "STRIKE ZONE VIEW",
            time: "Weekdays at 9:00 AM CT",
            description: "LANE CONDITIONS & ANALYSIS",
            image: "/api/placeholder/200/150"
        },
        {
            id: 4,
            title: "TOURNAMENT CENTRAL",
            time: "Weekdays at 3:00 PM CT",
            description: "LIVE TOURNAMENT COVERAGE",
            image: "/api/placeholder/200/150"
        },
        {
            id: 5,
            title: "BOWLERS SPOTLIGHT",
            time: "Weekdays at 9:00 PM CT",
            description: "PLAYER INTERVIEWS",
            image: "/api/placeholder/200/150"
        },
        {
            id: 6,
            title: "BOWLING INSIGHTS",
            time: "Weekdays at 10:00 AM CT",
            description: "STRATEGY & MINDSET",
            image: "/api/placeholder/200/150"
        }
    ];

    const weekendShows = [
        {
            id: 7,
            title: "WEEKEND WARRIORS",
            time: "Saturdays at 6:00 PM CT",
            description: "AMATEUR SPOTLIGHT",
            image: "/api/placeholder/200/150"
        },
        {
            id: 8,
            title: "CULTURE LANES",
            time: "Sundays at 5:00 PM CT",
            description: "BOWLING LIFESTYLE",
            image: "/api/placeholder/200/150"
        },
        {
            id: 9,
            title: "LEGENDS CORNER",
            time: "Sundays at 7:00 PM CT",
            description: "BOWLING HISTORY",
            image: "/api/placeholder/200/150"
        },
        {
            id: 10,
            title: "MAKE LOCAL",
            time: "Sundays at 8:30 PM CT",
            description: "LOCAL LEAGUE COVERAGE",
            image: "/api/placeholder/200/150"
        },
        {
            id: 11,
            title: "MIDWEST LANES",
            time: "Sundays at 9:00 PM CT",
            description: "REGIONAL TOURNAMENTS",
            image: "/api/placeholder/200/150"
        }
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Header with Trending Title */}
            <div className="relative">
                {/* BFK-style header background */}
                <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    
                    {/* Geometric design elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 opacity-20 transform -skew-x-12 -translate-x-20 -translate-y-20"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400 opacity-20 transform skew-x-12 translate-x-20 -translate-y-20"></div>
                    
                    {/* Logo and Title */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-16 h-16 bg-black bg-opacity-80 rounded-full flex items-center justify-center">
                                <Image
                                    src="/logo/logo_for_dark.png"
                                    alt="Bowlers Network"
                                    width={32}
                                    height={32}
                                    className="rounded"
                                />
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold tracking-wider">BOWLERS</h1>
                                <h2 className="text-2xl font-bold tracking-widest">NETWORK</h2>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide">TRENDING ON BOWLERS NETWORK</h3>
                    </div>
                </div>
            </div>

            {/* Featured Video Section */}
            <div className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                        <div className="relative h-96 md:h-[500px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Play className="w-12 h-12 text-white ml-1" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Featured: PBA Championship Finals</h3>
                                    <p className="text-gray-300">Watch the most exciting moments from recent tournaments</p>
                                    <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                                        Watch Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 text-white">
                            <h4 className="text-xl font-bold mb-2">Championship Highlights</h4>
                            <p className="text-gray-300">Experience the best strikes, spares, and incredible shots from professional bowling's biggest stage.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Streaming Section */}
            <div className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Weekday Live & VOD Shows</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                        {streamingShows.map((show) => (
                            <div key={show.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                <div className="relative h-32">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold bg-black bg-opacity-60 px-2 py-1 rounded">
                                        {show.time}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="text-white font-bold text-sm mb-1">{show.title}</h4>
                                    <p className="text-gray-400 text-xs">{show.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Weekend Live & VOD Shows</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {weekendShows.map((show) => (
                            <div key={show.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                <div className="relative h-32">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-800 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute bottom-2 left-2 text-white text-xs font-semibold bg-black bg-opacity-60 px-2 py-1 rounded">
                                        {show.time}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h4 className="text-white font-bold text-sm mb-1">{show.title}</h4>
                                    <p className="text-gray-400 text-xs">{show.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Sections */}
            <div className="px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    
                    {/* Videos Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Videos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                    <div className="relative h-40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-pink-700 flex items-center justify-center">
                                            <Play className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            Coming Soon
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold mb-2">Tutorial Video {item}</h4>
                                        <p className="text-gray-400 text-sm">Professional bowling techniques and tips</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Podcasts Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Podcasts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                    <div className="relative h-40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                                            <Mic className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            Coming Soon
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold mb-2">Podcast Episode {item}</h4>
                                        <p className="text-gray-400 text-sm">Insights from pro players and coaches</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pics Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Pics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                    <div className="relative h-40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-700 flex items-center justify-center">
                                            <Camera className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            Coming Soon
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold mb-2">Photo Gallery {item}</h4>
                                        <p className="text-gray-400 text-sm">Behind-the-scenes tournament moments</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tournaments Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Tournaments</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                    <div className="relative h-40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center">
                                            <Trophy className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            Coming Soon
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold mb-2">Tournament {item}</h4>
                                        <p className="text-gray-400 text-sm">Professional tournament coverage</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Difference Makers Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Difference Makers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                                    <div className="relative h-40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                                            <Star className="w-12 h-12 text-white" />
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                            Coming Soon
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold mb-2">Inspiring Story {item}</h4>
                                        <p className="text-gray-400 text-sm">Stories of remarkable bowlers</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-500 text-sm">
                        © 2025 Bowlers Network. All Rights Reserved. | Powered by Bowlers Network
                    </p>
                </div>
            </div>
        </div>
    );
}
