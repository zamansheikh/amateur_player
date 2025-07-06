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

    // Auto-scroll functionality
    useEffect(() => {
        if (proPlayers.length === 0) return;

        const scrollContainer = document.getElementById('pro-players-scroll');
        if (!scrollContainer) return;

        let scrollDirection = 1; // 1 for right, -1 for left
        const scrollSpeed = 1; // pixels per interval
        const scrollInterval = 50; // milliseconds

        const autoScroll = setInterval(() => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

            // Check if we've reached the end
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                scrollDirection = -1; // Start scrolling left
            } else if (scrollLeft <= 10) {
                scrollDirection = 1; // Start scrolling right
            }

            // Scroll in the current direction
            scrollContainer.scrollLeft += scrollSpeed * scrollDirection;
        }, scrollInterval);

        // Pause auto-scroll on hover
        const handleMouseEnter = () => clearInterval(autoScroll);
        const handleMouseLeave = () => {
            // Restart auto-scroll after mouse leaves
            setTimeout(() => {
                if (scrollContainer) {
                    const newAutoScroll = setInterval(() => {
                        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

                        if (scrollLeft + clientWidth >= scrollWidth - 10) {
                            scrollDirection = -1;
                        } else if (scrollLeft <= 10) {
                            scrollDirection = 1;
                        }

                        scrollContainer.scrollLeft += scrollSpeed * scrollDirection;
                    }, scrollInterval);

                    // Store the new interval ID
                    scrollContainer.dataset.autoScrollId = newAutoScroll.toString();
                }
            }, 1000); // Wait 1 second before restarting
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            clearInterval(autoScroll);
            if (scrollContainer) {
                scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
                scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [proPlayers]);

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
        <div className="min-h-screen bg-gray-100">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            <span style={{
                                background: 'linear-gradient(to right, #8BC342, #6fa332)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Bowlers Network
                            </span>
                        </h1>
                        <p className="text-gray-600">
                            Where amateurs meet the pros
                        </p>
                    </div>
                </div>
            </div>

            {/* Pro Players Section */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Star className="w-6 h-6 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Professional Bowlers</h2>
                        </div>
                        <p className="text-gray-600">Connect with professional bowlers from around the community.</p>
                    </div>

                    {/* Horizontally scrollable container */}
                    <div className="relative">
                        <div
                            id="pro-players-scroll"
                            className="flex gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                scrollBehavior: 'smooth'
                            }}
                        >
                            {proPlayers.map((player) => (
                                <div key={player.user_id} className="flex-shrink-0 w-72">
                                    <PlayerCard player={player} />
                                </div>
                            ))}
                        </div>

                        {/* Gradient fade effects on sides */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-white">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Welcome to Bowlers Network – Where Amateurs Meet the Pros
                    </h2>

                    <div className="text-left max-w-3xl mx-auto space-y-4 text-lg text-gray-700 mb-8">
                        <p className="text-center">
                            <strong>Step into the lane and level up your game! 🎳</strong>
                        </p>

                        <p>
                            Bowlers Network is the ultimate hub for amateur bowlers to connect with professional players, track their journey, and showcase their skills.
                        </p>

                        <p>
                            Every player gets their own trading card – a dynamic profile that highlights your XP, rank, and achievements. Watch your progress in real time with a personalized dashboard, designed to show your growth, milestones, and how you stack up in the community.
                        </p>

                        <p>
                            Whether you're looking to improve your technique, find local leagues, or just connect with fellow bowling enthusiasts, Bowlers Network brings the community together.
                        </p>

                        <p className="text-center">
                            <strong>Ready to roll? Your lane awaits! 🎯</strong>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/home"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Explore the Feed
                        </Link>
                        <Link
                            href="/overview"
                            className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                        >
                            View Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
