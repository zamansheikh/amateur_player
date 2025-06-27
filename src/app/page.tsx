'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
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

    const PlayerCard = ({ player, onClick }: { player: ProPlayer, onClick: () => void }) => {
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

        // Generate initials from name
        const getInitials = (name: string) => {
            if (!name) return player.username?.slice(0, 2).toUpperCase() || 'P';
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        };

        return (
            <div
                className="text-white p-4 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                style={getCardStyle()}
                onClick={onClick}
            >
                <div className="text-center">
                    {player.profile_picture_url ? (
                        <img
                            src={player.profile_picture_url}
                            alt={player.name || player.username}
                            className="w-12 h-12 rounded-full mx-auto mb-3 object-cover border-2 border-white border-opacity-50"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full mx-auto flex items-center justify-center font-bold mb-3 text-lg">
                            {getInitials(player.name)}
                        </div>
                    )}

                    <h3 className="font-bold text-lg mb-1">
                        {player.name || player.username}
                    </h3>
                    <p className="text-white text-opacity-80 text-sm mb-3">
                        @{player.username}
                    </p>

                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <p className="text-white text-opacity-70 text-xs">Level</p>
                            <p className="font-bold text-xl">
                                {player.level}
                            </p>
                        </div>
                        <div>
                            <p className="text-white text-opacity-70 text-xs">XP</p>
                            <p className="font-bold text-xl">
                                {player.xp.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {player.stats?.average_score && player.stats.average_score > 0 && (
                        <div className="mb-2">
                            <p className="text-white text-opacity-70 text-xs">Avg Score</p>
                            <p className="font-bold text-base">
                                {Math.round(player.stats.average_score)}
                            </p>
                        </div>
                    )}

                    <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium">
                        Pro Player
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
                                <div key={player.user_id} className="flex-shrink-0 w-56">
                                    <PlayerCard
                                        player={player}
                                        onClick={() => handlePlayerClick(player)}
                                    />
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
                            Whether you're just starting out or chasing pro status, this is where passion meets progress.
                        </p>
                        
                        <p className="text-center font-semibold">
                            Let's roll.
                        </p>
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
