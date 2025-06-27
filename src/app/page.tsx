'use client';

import Link from 'next/link';
import { Trophy, Star, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import ProPlayerModal from '@/components/ProPlayerModal';

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
    stats: {
        id: number;
        user_id: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
    };
    is_followed: boolean;
}

export default function HomePage() {
    const [proPlayers, setProPlayers] = useState<ProPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<ProPlayer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Handle opening player modal
    const handlePlayerClick = (player: ProPlayer) => {
        setSelectedPlayer(player);
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlayer(null);
    };

    // Handle follow status update
    const handleFollowUpdate = (userId: number, isFollowed: boolean) => {
        setProPlayers(players =>
            players.map(player =>
                player.user_id === userId
                    ? { ...player, is_followed: isFollowed, follower_count: isFollowed ? player.follower_count + 1 : player.follower_count - 1 }
                    : player
            )
        );
    };

    // Sort pro players by XP to get top performers
    const sortedProPlayers = proPlayers.sort((a, b) => b.xp - a.xp);
    const topLegends = sortedProPlayers.slice(0, 3);
    const risingStars = sortedProPlayers.slice(3, 15);

    const PlayerCard = ({ player, size = 'normal', rank, onClick }: { player: ProPlayer, size?: 'normal' | 'large', rank: number, onClick: () => void }) => {
        const isLarge = size === 'large';

        // Use card_theme from API or fallback to gradient
        const getCardStyle = () => {
            if (player.card_theme && player.card_theme.startsWith('#')) {
                // Hex color theme
                return {
                    background: `linear-gradient(135deg, ${player.card_theme}, ${player.card_theme}dd)`
                };
            } else if (player.card_theme === 'orange') {
                return {
                    background: 'linear-gradient(135deg, #ea580c, #dc2626)'
                };
            } else {
                // Default green gradient
                return {
                    background: 'linear-gradient(135deg, #16a34a, #15803d)'
                };
            }
        };

        const cardClass = isLarge
            ? "text-white p-6 rounded-2xl shadow-2xl transform scale-105 relative"
            : "text-white p-4 rounded-xl shadow-lg";

        const avatarClass = isLarge ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg";

        // Generate initials from name
        const getInitials = (name: string) => {
            if (!name) return player.username?.slice(0, 2).toUpperCase() || 'P';
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        };

        return (
            <div
                className={`${cardClass} cursor-pointer hover:scale-105 transition-transform duration-200`}
                style={getCardStyle()}
                onClick={onClick}
            >
                {isLarge && (
                    <div className="absolute -top-2 -right-2">
                        <div className="bg-yellow-400 rounded-full p-2">
                            <Trophy className="w-6 h-6 text-yellow-800" />
                        </div>
                    </div>
                )}

                <div className="text-center">
                    {player.profile_picture_url ? (
                        <img
                            src={player.profile_picture_url}
                            alt={player.name || player.username}
                            className={`${avatarClass} rounded-full mx-auto mb-3 object-cover border-2 border-white border-opacity-50`}
                        />
                    ) : (
                        <div className={`${avatarClass} bg-white bg-opacity-20 rounded-full mx-auto flex items-center justify-center font-bold mb-3`}>
                            {getInitials(player.name)}
                        </div>
                    )}

                    <h3 className={`font-bold ${isLarge ? 'text-xl' : 'text-lg'} mb-1`}>
                        {player.name || player.username}
                    </h3>
                    <p className={`text-white text-opacity-80 ${isLarge ? 'text-base' : 'text-sm'} mb-3`}>
                        @{player.username}
                    </p>

                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="text-white text-opacity-70 text-xs">Level</p>
                            <p className={`font-bold ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                                {player.level}
                            </p>
                        </div>
                        <div>
                            <p className="text-white text-opacity-70 text-xs">XP</p>
                            <p className={`font-bold ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                                {player.xp.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {player.stats.average_score > 0 && (
                        <div className="mb-2">
                            <p className="text-white text-opacity-70 text-xs">Avg Score</p>
                            <p className={`font-bold ${isLarge ? 'text-lg' : 'text-base'}`}>
                                {Math.round(player.stats.average_score)}
                            </p>
                        </div>
                    )}

                    <div className={`bg-white bg-opacity-20 rounded-full px-3 py-1 ${isLarge ? 'text-base' : 'text-sm'} font-medium`}>
                        {rank === 1 ? '🏆 1st Place' :
                            rank === 2 ? '🥈 2nd Place' :
                                rank === 3 ? '🥉 3rd Place' :
                                    `Rank ${rank}`}
                    </div>
                </div>
            </div>
        );
    };

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
                                Amateur Player
                            </span>
                        </h1>
                        <p className="text-gray-600">
                            Join the community and climb the leaderboards
                        </p>
                    </div>
                </div>
            </div>

            {/* Meet the Legends Section */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-3xl font-bold text-gray-900">Pro Player Legends</h2>
                        </div>
                        <p className="text-gray-600">The elite professional bowlers leading the way.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-end justify-center gap-6 mb-12">
                        {/* 2nd Place */}
                        {topLegends[1] && (
                            <div className="order-1 lg:order-1">
                                <PlayerCard
                                    player={topLegends[1]}
                                    rank={2}
                                    onClick={() => handlePlayerClick(topLegends[1])}
                                />
                            </div>
                        )}

                        {/* 1st Place - Larger and elevated */}
                        {topLegends[0] && (
                            <div className="order-2 lg:order-2">
                                <PlayerCard
                                    player={topLegends[0]}
                                    size="large"
                                    rank={1}
                                    onClick={() => handlePlayerClick(topLegends[0])}
                                />
                            </div>
                        )}

                        {/* 3rd Place */}
                        {topLegends[2] && (
                            <div className="order-3 lg:order-3">
                                <PlayerCard
                                    player={topLegends[2]}
                                    rank={3}
                                    onClick={() => handlePlayerClick(topLegends[2])}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rising Stars Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">More Pro Players</h2>
                        </div>
                        <p className="text-gray-600">Discover more professional bowlers in our community.</p>
                    </div>

                    {/* Horizontally scrollable container */}
                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide" style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            {risingStars.map((player, index) => (
                                <div key={player.user_id} className="flex-shrink-0 w-48">
                                    <PlayerCard
                                        player={player}
                                        rank={index + 4}
                                        onClick={() => handlePlayerClick(player)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Gradient fade effects on sides */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Join the Competition?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Create your account and start climbing the leaderboards today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                        >
                            Join Now
                        </Link>
                        <Link
                            href="/signin"
                            className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pro Player Modal */}
            {selectedPlayer && (
                <ProPlayerModal
                    player={selectedPlayer}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onFollowUpdate={handleFollowUpdate}
                />
            )}
        </div>
    );
}
