'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import UserProfileModal from './UserProfileModal';

interface PlayerProfile {
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

interface PlayerCardProps {
    player: PlayerProfile;
}

export default function PlayerCard({ player }: PlayerCardProps) {
    const [showModal, setShowModal] = useState(false);

    const handleCardClick = () => {
        setShowModal(true);
    };

    return (
        <>
            <div 
                onClick={handleCardClick}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
                {/* Cover Video */}
                <div className="h-48 relative overflow-hidden">
                    {player?.intro_video_url ? (
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
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                        <Play className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 pt-4">
                    <div className="flex items-end gap-4 -mt-12">
                        {/* Profile Picture */}
                        <div className="relative">
                            <img
                                src={player?.profile_picture_url || "/playercard1.png"}
                                alt={player?.name}
                                className="w-24 h-24 rounded-2xl border-4 border-white object-cover"
                            />
                        </div>

                        <div className="flex-1 mt-12">
                            {/* Name, Level, XP, EXP Row */}
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-gray-900">
                                            {player?.name}
                                        </h1>
                                        {player?.is_pro && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">
                                        {player?.is_pro ? "Pro Player" : "Amateur Player"}
                                    </p>
                                </div>

                                {/* Level, XP, EXP Icons */}
                                <div className="flex items-center gap-3 ml-auto">
                                    {/* Level */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-10 h-10">
                                            <img
                                                src="/icons/level.svg"
                                                alt="Level"
                                                className="w-full h-full"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">
                                                    {player?.level || 8}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-xs mt-1">
                                            Level
                                        </span>
                                    </div>

                                    {/* XP */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-10 h-10">
                                            <img
                                                src="/icons/xp.svg"
                                                alt="XP"
                                                className="w-full h-full"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">
                                                    {player?.xp || 8}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-xs mt-1">
                                            XP
                                        </span>
                                    </div>

                                    {/* EXP */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-10 h-10">
                                            <img
                                                src="/icons/exp.svg"
                                                alt="EXP"
                                                className="w-full h-full"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">
                                                    {player?.stats.experience || 8}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-gray-600 text-xs mt-1">
                                            EXP
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center justify-center gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {player?.follower_count?.toLocaleString() || "0"}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Followers
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {player?.stats.high_game?.toLocaleString() || "0"}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        High Game
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {player?.stats.high_series?.toLocaleString() || "0"}
                                    </div>
                                    <div className="text-xs text-gray-600">High Series</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Modal */}
            <UserProfileModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                userId={player.user_id}
            />
        </>
    );
}
