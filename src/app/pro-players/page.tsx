'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import PlayerCardV3 from '@/app/landing/components/PlayerCardV3';

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
    const router = useRouter();
    const { user } = useAuth();
    const [proPlayers, setProPlayers] = useState<ProPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [followingStates, setFollowingStates] = useState<{ [key: number]: boolean }>({});
    const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});

    // Define V3 color themes
    const cardThemesV3 = [
        { primaryColor: "#8BC342", secondaryColor: "#385019", accentColor: "#75B11D" },
        { primaryColor: "#3B82F6", secondaryColor: "#1E3A8A", accentColor: "#60A5FA" },
        { primaryColor: "#8B5CF6", secondaryColor: "#4C1D95", accentColor: "#A78BFA" },
        { primaryColor: "#F59E0B", secondaryColor: "#92400E", accentColor: "#FBBF24" },
        { primaryColor: "#EC4899", secondaryColor: "#BE185D", accentColor: "#F472B6" },
        { primaryColor: "#10B981", secondaryColor: "#047857", accentColor: "#34D399" },
        { primaryColor: "#EF4444", secondaryColor: "#B91C1C", accentColor: "#F87171" },
        { primaryColor: "#06B6D4", secondaryColor: "#0E7490", accentColor: "#67E8F9" },
        { primaryColor: "#84CC16", secondaryColor: "#365314", accentColor: "#A3E635" },
        { primaryColor: "#F97316", secondaryColor: "#C2410C", accentColor: "#FB923C" },
        { primaryColor: "#14B8A6", secondaryColor: "#0F766E", accentColor: "#5EEAD4" },
        { primaryColor: "#A855F7", secondaryColor: "#6B21A8", accentColor: "#C084FC" },
    ];

    useEffect(() => {
        const fetchProPlayers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/user/pro-player-public-profile');
                setProPlayers(response.data);

                // Initialize following states based on API response
                const followStates: { [key: number]: boolean } = {};
                response.data.forEach((player: ProPlayer) => {
                    followStates[player.user_id] = player.is_followed || false;
                });
                setFollowingStates(followStates);

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

    // Handle follow/unfollow functionality
    const handleFollow = async (player: ProPlayer, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation

        if (!user) {
            router.push('/signin');
            return;
        }

        if (followLoading[player.user_id]) return; // Prevent multiple requests

        try {
            setFollowLoading(prev => ({ ...prev, [player.user_id]: true }));

            const response = await api.post('/api/user/follow', {
                user_id: player.user_id
            });

            if (response.status === 200) {
                // Toggle the follow state
                setFollowingStates(prev => ({
                    ...prev,
                    [player.user_id]: !prev[player.user_id]
                }));

                // Update the player data in the list
                setProPlayers(prev => prev.map(p =>
                    p.user_id === player.user_id
                        ? {
                            ...p,
                            is_followed: !p.is_followed,
                            follower_count: p.is_followed ? p.follower_count - 1 : p.follower_count + 1
                        }
                        : p
                ));
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setFollowLoading(prev => ({ ...prev, [player.user_id]: false }));
        }
    };

    // Handle card click to navigate to player profile
    const handleCardClick = (player: ProPlayer) => {
        router.push(`/player/${player.username}`);
    };

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {proPlayers.map((player, index) => {
                            const themeV3 = cardThemesV3[index % cardThemesV3.length];
                            return (
                                <div key={player.user_id} className="transform hover:scale-105 transition-transform duration-200">
                                    <PlayerCardV3
                                        player={{
                                            user_id: player.user_id,
                                            username: player.username,
                                            name: player.name,
                                            profile_picture_url: player.profile_picture_url,
                                            level: player.level,
                                            xp: player.xp || 0,
                                            is_followed: player.is_followed,
                                            follower_count: player.follower_count || 0,
                                            stats: {
                                                high_game: player.stats?.high_game || 0,
                                                high_series: player.stats?.high_series || 0,
                                                average_score: player.stats?.average_score || 0,
                                            },
                                            engagement: {
                                                views: player.engagement?.views || 0,
                                                likes: player.engagement?.likes || 0,
                                                comments: player.engagement?.comments || 0,
                                            },
                                            favorite_brands: player.favorite_brands || [],
                                        }}
                                        onTap={() => handleCardClick(player)}
                                        onFollow={() => {
                                            const event = { stopPropagation: () => { } } as React.MouseEvent;
                                            handleFollow(player, event);
                                        }}
                                        onCollect={() => console.log('Collect clicked for', player.name)}
                                        primaryColor={themeV3.primaryColor}
                                        secondaryColor={themeV3.secondaryColor}
                                        accentColor={themeV3.accentColor}
                                        isLoading={followLoading[player.user_id] || false}
                                    />
                                </div>
                            );
                        })}
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
