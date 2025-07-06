'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Trophy, Star, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

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
    stats?: {
        id: number;
        user_id: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
    } | null;
    engagement?: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
    };
    is_followed: boolean;
}

export default function PlayerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const playerId = params.id as string;
    
    const [player, setPlayer] = useState<ProPlayer | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [followerCount, setFollowerCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/api/user/profile/${playerId}`);
                const playerData = response.data;
                setPlayer(playerData);
                setIsFollowing(playerData.is_followed);
                setFollowerCount(playerData.follower_count);
                setError(null);
            } catch (err) {
                console.error('Error fetching player:', err);
                setError('Failed to load player profile');
            } finally {
                setIsLoading(false);
            }
        };

        if (playerId) {
            fetchPlayer();
        }
    }, [playerId]);

    const handleFollow = async () => {
        if (!player) return;
        
        try {
            setIsLoading(true);
            await api.post('/api/user/follow', {
                user_id: player.user_id
            });

            setIsFollowing(!isFollowing);
            setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCardStyle = () => {
        if (!player) return {};
        
        if (player.card_theme && player.card_theme.startsWith('#')) {
            return {
                background: `linear-gradient(135deg, ${player.card_theme}, ${player.card_theme}dd)`
            };
        } else if (player.card_theme === 'orange') {
            return {
                background: 'linear-gradient(135deg, #ea580c, #dc2626)'
            };
        } else {
            return {
                background: 'linear-gradient(135deg, #16a34a, #15803d)'
            };
        }
    };

    const getInitials = (name: string) => {
        if (!name) return player?.username?.slice(0, 2).toUpperCase() || 'P';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading player profile...</p>
                </div>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Player not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-6">
                {/* Header with back button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                </div>

                {/* Player Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Cover Video/Image */}
                    <div className="h-48 relative overflow-hidden">
                        {player.intro_video_url ? (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src={player.intro_video_url} type="video/mp4" />
                                <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                            </video>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                            {/* Profile Picture */}
                            <div className="relative flex-shrink-0 -mt-16 md:-mt-20">
                                {player.profile_picture_url ? (
                                    <img
                                        src={player.profile_picture_url}
                                        alt={player.name || player.username}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white font-bold text-3xl"
                                        style={getCardStyle()}>
                                        {getInitials(player.name)}
                                    </div>
                                )}

                                {/* Pro Badge */}
                                {player.is_pro && (
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
                                        <Trophy className="w-6 h-6 text-yellow-800" />
                                    </div>
                                )}
                            </div>

                            {/* Player Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {player.name || player.username}
                                </h1>
                                <p className="text-xl text-gray-600 mb-3">@{player.username}</p>
                                
                                {player.is_pro && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        <span className="text-yellow-600 font-medium">Pro Player</span>
                                    </div>
                                )}

                                {/* Follow Button */}
                                <button
                                    onClick={handleFollow}
                                    disabled={isLoading}
                                    className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 ${isFollowing
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-blue-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">{player.level}</div>
                                <div className="text-gray-600">Level</div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-green-600 mb-1">{player.xp.toLocaleString()}</div>
                                <div className="text-gray-600">XP</div>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-1">{followerCount}</div>
                                <div className="text-gray-600">Followers</div>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-6 text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-1">
                                    {player.stats?.experience ?? 0}
                                </div>
                                <div className="text-gray-600">Experience</div>
                            </div>
                        </div>

                        {/* Bowling Stats */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6" />
                                Bowling Statistics
                            </h3>
                            
                            {!player.stats ||
                                (player.stats.average_score === 0 && player.stats.high_game === 0 && player.stats.high_series === 0) ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg mb-2">No bowling stats available yet</p>
                                    <p className="text-gray-400">Stats will appear after playing games</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-white rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {player.stats?.average_score !== null && player.stats?.average_score !== undefined
                                                ? Math.round(player.stats.average_score)
                                                : '0'}
                                        </div>
                                        <div className="text-gray-600">Average Score</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {player.stats?.high_game !== null && player.stats?.high_game !== undefined
                                                ? player.stats.high_game
                                                : '0'}
                                        </div>
                                        <div className="text-gray-600">High Game</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {player.stats?.high_series !== null && player.stats?.high_series !== undefined
                                                ? player.stats.high_series
                                                : '0'}
                                        </div>
                                        <div className="text-gray-600">High Series</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Engagement Stats (if available) */}
                        {player.engagement && (
                            <div className="mt-8 bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Engagement</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-900">{player.engagement.likes}</div>
                                        <div className="text-gray-600">Likes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-900">{player.engagement.comments}</div>
                                        <div className="text-gray-600">Comments</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-900">{player.engagement.shares}</div>
                                        <div className="text-gray-600">Shares</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-900">{player.engagement.views}</div>
                                        <div className="text-gray-600">Views</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
