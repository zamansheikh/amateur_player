'use client';

import React from 'react';
import PlayerCardV2 from '@/app/landing/components/PlayerCardV2';

const PlayerCardV2Demo = () => {
    // Sample player data
    const samplePlayer = {
        name: "Alex Johnson",
        level: 15,
        stats: {
            average: 185,
            highGame: 289,
            highSeries: 756,
            experience: 2840,
            Xp: 15750,
            follower: 324
        }
    };

    // Different color themes
    const colorThemes = [
        {
            name: "Classic Green",
            primaryColor: "#8BC342",
            secondaryColor: "#385019",
            accentColor: "#75B11D",
        },
        {
            name: "Ocean Blue",
            primaryColor: "#3B82F6",
            secondaryColor: "#1E3A8A",
            accentColor: "#60A5FA",
        },
        {
            name: "Royal Purple",
            primaryColor: "#8B5CF6",
            secondaryColor: "#4C1D95",
            accentColor: "#A78BFA",
        },
        {
            name: "Sunset Orange",
            primaryColor: "#F59E0B",
            secondaryColor: "#92400E",
            accentColor: "#FBBF24",
        },
        {
            name: "Rose Pink",
            primaryColor: "#EC4899",
            secondaryColor: "#BE185D",
            accentColor: "#F472B6",
        },
        {
            name: "Emerald Green",
            primaryColor: "#10B981",
            secondaryColor: "#047857",
            accentColor: "#34D399",
        }
    ];

    const differentPlayers = [
        { ...samplePlayer, name: "Alex Johnson", level: 15 },
        { ...samplePlayer, name: "Sarah Wilson", level: 22, stats: { ...samplePlayer.stats, average: 210, highGame: 300 } },
        { ...samplePlayer, name: "Mike Chen", level: 8, stats: { ...samplePlayer.stats, average: 165, highGame: 245 } },
        { ...samplePlayer, name: "Emma Davis", level: 31, stats: { ...samplePlayer.stats, average: 195, highGame: 278 } },
        { ...samplePlayer, name: "James Brown", level: 12, stats: { ...samplePlayer.stats, average: 178, highGame: 267 } },
        { ...samplePlayer, name: "Lisa Garcia", level: 18, stats: { ...samplePlayer.stats, average: 188, highGame: 285 } },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    PlayerCard V2 - New Design
                </h1>
                <p className="text-center text-gray-600 mb-12 text-lg">
                    Featuring the new angular shield design with gradient backgrounds
                </p>

                {/* Color Theme Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {colorThemes.map((theme, index) => (
                        <div key={theme.name} className="flex flex-col items-center">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                {theme.name}
                            </h3>
                            <div className="transform hover:scale-105 transition-transform duration-300">
                                <PlayerCardV2
                                    {...differentPlayers[index]}
                                    primaryColor={theme.primaryColor}
                                    secondaryColor={theme.secondaryColor}
                                    accentColor={theme.accentColor}
                                    width={320}
                                    height={480}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Highlights */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                        New Design Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Angular Shield Design</h3>
                            <p className="text-gray-600 text-sm">Modern geometric shape with sharp angles and elegant curves</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Multi-Layer Gradients</h3>
                            <p className="text-gray-600 text-sm">Rich gradient backgrounds with customizable color schemes</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Glass Morphism UI</h3>
                            <p className="text-gray-600 text-sm">Frosted glass effect with backdrop blur and transparency</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCardV2Demo;
