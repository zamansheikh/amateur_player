'use client';

import { X, Trophy, Star, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';

interface ProPlayer {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    xp: number;
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
    is_followed: boolean;
}

interface ProPlayerModalProps {
    player: ProPlayer;
    isOpen: boolean;
    onClose: () => void;
    onFollowUpdate: (userId: number, isFollowed: boolean) => void;
}

export default function ProPlayerModal({ player, isOpen, onClose, onFollowUpdate }: ProPlayerModalProps) {
    const [isFollowing, setIsFollowing] = useState(player.is_followed);
    const [isLoading, setIsLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(player.follower_count);

    if (!isOpen) return null;

    const handleFollow = async () => {
        try {
            setIsLoading(true);

            await api.post('/api/user/follow', {
                user_id: player.user_id
            });

            const newFollowStatus = !isFollowing;
            setIsFollowing(newFollowStatus);
            setFollowerCount(prev => newFollowStatus ? prev + 1 : prev - 1);

            // Update parent component
            onFollowUpdate(player.user_id, newFollowStatus);

        } catch (error) {
            console.error('Error following user:', error);
            // Could add toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    const getCardStyle = () => {
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
        if (!name) return player.username?.slice(0, 2).toUpperCase() || 'P';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header with close button */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900">Player Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Profile Header */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        {/* Profile Picture/Avatar */}
                        <div className="relative inline-block mb-4">
                            {player.profile_picture_url ? (
                                <img
                                    src={player.profile_picture_url}
                                    alt={player.name || player.username}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-gray-100 text-white font-bold text-2xl"
                                    style={getCardStyle()}>
                                    {getInitials(player.name)}
                                </div>
                            )}

                            {/* Pro Badge */}
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                                <Trophy className="w-4 h-4 text-yellow-800" />
                            </div>
                        </div>

                        {/* Name and Username */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {player.name || player.username}
                        </h3>
                        <p className="text-gray-600 mb-2">@{player.username}</p>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600">Pro Player</span>
                        </div>

                        {/* Follow Button */}
                        <button
                            onClick={handleFollow}
                            disabled={isLoading}
                            className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${isFollowing
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-green-600 text-white hover:bg-green-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{player.level}</div>
                            <div className="text-sm text-gray-600">Level</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{player.xp.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">XP</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{followerCount}</div>
                            <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {player.stats?.experience ?? 0}
                            </div>
                            <div className="text-sm text-gray-600">Experience</div>
                        </div>
                    </div>

                    {/* Bowling Stats */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Bowling Stats
                        </h4>
                        {!player.stats ||
                            (player.stats.average_score === 0 && player.stats.high_game === 0 && player.stats.high_series === 0) ? (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">No bowling stats available yet</p>
                                <p className="text-gray-400 text-xs mt-1">Stats will appear after playing games</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Average Score:</span>
                                    <span className="font-semibold text-gray-900">
                                        {player.stats?.average_score !== null && player.stats?.average_score !== undefined
                                            ? Math.round(player.stats.average_score)
                                            : '0'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">High Game:</span>
                                    <span className="font-semibold text-gray-900">
                                        {player.stats?.high_game !== null && player.stats?.high_game !== undefined
                                            ? player.stats.high_game
                                            : '0'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">High Series:</span>
                                    <span className="font-semibold text-gray-900">
                                        {player.stats?.high_series !== null && player.stats?.high_series !== undefined
                                            ? player.stats.high_series
                                            : '0'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
