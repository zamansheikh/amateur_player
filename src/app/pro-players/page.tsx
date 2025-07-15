'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import PlayerCard from '@/components/PlayerCard';

interface ProPlayer {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    intro_video_url: string;
    xp: number;
    email: string;
    level: number;
    card_theme: string;
    is_pro: boolean;
    follower_count: number;
    sponsors: {
        brand_id: number;
        brandType: string;
        name: string;
        formal_name: string;
        logo_url: string;
    }[];
    stats: {
        id: number;
        user_id: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
    };
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
    };
    is_followed: boolean;
    favorite_brands: {
        brand_id: number;
        brandType: string;
        name: string;
        formal_name: string;
        logo_url: string;
    }[];
}

export default function ProPlayersPage() {
    const [proPlayers, setProPlayers] = useState<ProPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProPlayers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/user/pro-player-public-profile');
                setProPlayers(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching pro players:', err);
                setError('Failed to load pro players');
            } finally {
                setLoading(false);
            }
        };

        fetchProPlayers();
    }, []);

    // Removed auto-scroll functionality - using grid layout instead

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading pro players...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-green-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Professional Bowlers
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with professional bowlers from around the community and learn from the best.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{proPlayers.length} Pro Players</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Verified Profiles</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Players Grid Section */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Players Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {proPlayers.map((player) => (
                            <div key={player.user_id} className="transform hover:scale-105 transition-transform duration-200">
                                <PlayerCard player={player} />
                            </div>
                        ))}
                    </div>

                    {/* Show message if no players */}
                    {proPlayers.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pro Players Found</h3>
                            <p className="text-gray-500">Check back later for professional bowlers to connect with.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-5">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-green-400 rounded-full"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-green-500 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-600 rounded-full"></div>
                    <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4">
                    {/* Main Heading */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                Bowlers Network
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Where amateurs meet the pros and level up their game
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎳</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect & Learn</h3>
                            <p className="text-gray-600">
                                Connect with professional bowlers and learn from the best in the community.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
                            <p className="text-gray-600">
                                Monitor your progress with personalized dashboards and dynamic player cards.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Showcase Skills</h3>
                            <p className="text-gray-600">
                                Show off your achievements and compete with fellow bowling enthusiasts.
                            </p>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                        <p className="text-lg text-gray-700 mb-8">
                            Ready to take your bowling game to the next level?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/home"
                                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                🎯 Explore the Feed
                            </Link>
                            <Link
                                href="/overview"
                                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold"
                            >
                                📈 View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
