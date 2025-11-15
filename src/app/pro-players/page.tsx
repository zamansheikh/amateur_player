'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import PlayerCard from '@/app/landing/components/PlayerCard';
import PlayerCardV2 from '@/app/landing/components/PlayerCardV2';
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
    const [cardVersion, setCardVersion] = useState<'v1' | 'v2' | 'v3'>('v3');
    const [followingStates, setFollowingStates] = useState<{ [key: number]: boolean }>({});
    const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});

    // Define different card themes for variety (V1)
    const cardThemes = [
        { borderColor: "#EE2E55", backgroundColor: "white", pathColor: "#EE2E55" },
        { borderColor: "#3B82F6", backgroundColor: "rgba(59, 130, 246, 0.08)", pathColor: "#1E40AF" },
        { borderColor: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.08)", pathColor: "#047857" },
        { borderColor: "#F59E0B", backgroundColor: "rgba(245, 158, 11, 0.08)", pathColor: "#D97706" },
        { borderColor: "#8B5CF6", backgroundColor: "rgba(139, 92, 246, 0.08)", pathColor: "#7C3AED" },
        { borderColor: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.08)", pathColor: "#DC2626" },
        { borderColor: "#06B6D4", backgroundColor: "rgba(6, 182, 212, 0.08)", pathColor: "#0891B2" },
        { borderColor: "#84CC16", backgroundColor: "rgba(132, 204, 22, 0.08)", pathColor: "#65A30D" },
        { borderColor: "#F97316", backgroundColor: "rgba(249, 115, 22, 0.08)", pathColor: "#EA580C" },
        { borderColor: "#EC4899", backgroundColor: "rgba(236, 72, 153, 0.08)", pathColor: "#DB2777" },
        { borderColor: "#14B8A6", backgroundColor: "rgba(20, 184, 166, 0.08)", pathColor: "#0F766E" },
        { borderColor: "#A855F7", backgroundColor: "rgba(168, 85, 247, 0.08)", pathColor: "#9333EA" },
    ];

    // Define V2 color themes
    const cardThemesV2 = [
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

                        {/* Card Design Toggle */}
                        <div className="mt-8 flex items-center justify-center">
                            <div className="bg-white rounded-lg p-1 shadow-md border">
                                <button
                                    onClick={() => setCardVersion('v3')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${cardVersion === 'v3'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    V3 Design (Flutter)
                                </button>
                                <button
                                    onClick={() => setCardVersion('v1')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${cardVersion === 'v1'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    V1 Design
                                </button>
                                <button
                                    onClick={() => setCardVersion('v2')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${cardVersion === 'v2'
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    V2 Design
                                </button>
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
                            const theme = cardThemes[index % cardThemes.length];
                            const themeV2 = cardThemesV2[index % cardThemesV2.length];
                            return (
                                <div key={player.user_id} className="transform hover:scale-105 transition-transform duration-200">
                                    {cardVersion === 'v3' ? (
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
                                            primaryColor={themeV2.primaryColor}
                                            secondaryColor={themeV2.secondaryColor}
                                            accentColor={themeV2.accentColor}
                                            isLoading={followLoading[player.user_id] || false}
                                        />
                                    ) : cardVersion === 'v2' ? (
                                        <PlayerCardV2
                                            imageUrl={player.profile_picture_url}
                                            level={player.level}
                                            name={player.name}
                                            stats={{
                                                average: player.stats?.average_score || 0,
                                                highGame: player.stats?.high_game || 0,
                                                highSeries: player.stats?.high_series || 0,
                                                experience: player.stats?.experience || 0,
                                                Xp: player.xp || 0,
                                                follower: player.follower_count || 0,
                                            }}
                                            primaryColor={themeV2.primaryColor}
                                            secondaryColor={themeV2.secondaryColor}
                                            accentColor={themeV2.accentColor}
                                            width={320}
                                            height={480}
                                            playerId={player.user_id}
                                            username={player.username}
                                            isFollowed={player.is_followed}
                                            onFollow={() => {
                                                const event = { stopPropagation: () => { } } as React.MouseEvent;
                                                handleFollow(player, event);
                                            }}
                                            onCardClick={() => handleCardClick(player)}
                                            isFollowLoading={followLoading[player.user_id] || false}
                                        />
                                    ) : (
                                        <PlayerCard
                                            imageUrl={player.profile_picture_url}
                                            level={player.level}
                                            name={player.name}
                                            stats={{
                                                average: player.stats?.average_score || 0,
                                                highGame: player.stats?.high_game || 0,
                                                highSeries: player.stats?.high_series || 0,
                                                experience: player.stats?.experience || 0,
                                                Xp: player.xp || 0,
                                                follower: player.follower_count || 0,
                                            }}
                                            borderColor={theme.borderColor}
                                            backgroundColor={theme.backgroundColor}
                                            pathColor={theme.pathColor}
                                            width={320}
                                            height={480}
                                            playerId={player.user_id}
                                            username={player.username}
                                            isFollowed={player.is_followed}
                                            onFollow={() => {
                                                const event = { stopPropagation: () => { } } as React.MouseEvent;
                                                handleFollow(player, event);
                                            }}
                                            onCardClick={() => handleCardClick(player)}
                                            isFollowLoading={followLoading[player.user_id] || false}
                                        />
                                    )}
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
