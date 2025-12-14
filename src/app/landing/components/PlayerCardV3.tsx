'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Zap, Trophy, Award, TrendingUp, Target, Flame } from 'lucide-react';

interface ProPlayer {
    user_id: number;
    username: string;
    name: string;
    profile_picture_url: string;
    level: number;
    xp: number;
    is_followed: boolean;
    follower_count: number;
    stats: {
        high_game: number;
        high_series: number;
        average_score: number;
    };
    engagement: {
        views: number;
        likes: number;
        comments: number;
    };
    favorite_brands?: {
        brand_id: number;
        name: string;
        logo_url: string;
    }[];
}

interface PlayerCardV3Props {
    player: ProPlayer;
    isLoading?: boolean;
    onTap?: () => void;
    onFollow?: () => void;
    onCollect?: () => void;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
}

export default function PlayerCardV3({
    player,
    isLoading = false,
    onTap,
    onFollow,
    onCollect,
    primaryColor = '#385019',
    secondaryColor = '#113108',
    accentColor = '#E1C348',
}: PlayerCardV3Props) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [statsView, setStatsView] = useState<'shots' | 'stats'>('shots');

    const formatNumber = (num: number): string => {
        if (num >= 1_000_000) {
            return `${(num / 1_000_000).toFixed(1)}M`;
        }
        if (num >= 1_000) {
            return `${(num / 1_000).toFixed(1)}K`;
        }
        return num.toString();
    };

    const levelProgress = (xp: number): number => {
        const normalized = (xp % 1000) / 1000;
        return Math.max(0.2, Math.min(0.95, normalized));
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className="w-full max-w-[380px] h-[540px] min-w-[320px] perspective-1000"
            style={{ perspective: '1000px' }}
        >
            <div
                className="relative w-full h-full transition-transform duration-700 transform-style-3d"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT SIDE - Profile Picture */}
                <div
                    onClick={handleCardClick}
                    className="absolute inset-0 w-full h-full rounded-xl cursor-pointer backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
                        border: `3px solid ${primaryColor}66`,
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <div className="p-3 h-full flex flex-col">
                        {/* Profile Image Container */}
                        <div className="flex-1 relative overflow-hidden rounded-xl border-2 border-white/40">
                            {player.profile_picture_url ? (
                                <>
                                    <Image
                                        src={player.profile_picture_url}
                                        alt={player.name}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.35))',
                                        }}
                                    />
                                </>
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}A6, ${accentColor}73)`,
                                    }}
                                >
                                    <div className="text-white text-8xl">👤</div>
                                </div>
                            )}
                        </div>

                        <div className="h-5" />

                        {/* Bottom Section: Name and Actions */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                {/* Player Name */}
                                <h3 className="text-white text-xl font-black tracking-wide uppercase truncate">
                                    {player.name}
                                </h3>

                                <div className="h-2" />

                                {/* Level */}
                                <div className="flex items-center gap-2">
                                    <span className="text-white/85 text-sm font-semibold">Level {player.level}</span>
                                    <div
                                        className="px-2 py-0.5 rounded text-white text-xs font-medium"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        Details
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 p-2 no-drag">
                                {/* Follow Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFollow?.();
                                    }}
                                    disabled={isLoading}
                                    className="h-6 px-2 rounded flex items-center gap-1.5 text-white font-bold text-xs shadow-sm transition-opacity disabled:opacity-50 no-drag"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {isLoading ? (
                                        <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Star size={10} />
                                            <span>{player.is_followed ? 'Following' : 'Follow'}</span>
                                        </>
                                    )}
                                </button>

                                {/* Collect Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCollect?.();
                                    }}
                                    className="h-6 px-2 rounded flex items-center gap-1.5 text-white font-bold text-xs transition-opacity no-drag"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
                                >
                                    <Heart size={10} />
                                    <span>Collect</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE - Stats View */}
                <div
                    onClick={handleCardClick}
                    className="absolute inset-0 w-full h-full rounded-xl cursor-pointer backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
                        border: `3px solid ${primaryColor}66`,
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <div className="p-3 h-full flex flex-col">
                        {/* Stats Content Container */}
                        <div className="flex-1 relative overflow-hidden rounded-xl border-2 border-white/40"
                            style={{

                            }}
                        >
                            {/* Stats View with "Shots" or "Stats" */}
                            {statsView === 'stats' ? (
                                <div className="p-4 h-full overflow-y-auto pb-16">
                                    {/* Summary Row */}
                                    <div className="flex gap-3 mb-2">
                                        <div className="flex-1">
                                            <div className="text-white text-2xl font-extrabold">
                                                {formatNumber(player.engagement?.views || 34000)}
                                            </div>
                                            <div className="text-white/80 text-sm font-semibold">Contents</div>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="text-white text-2xl font-extrabold">
                                                {formatNumber(player.follower_count)}
                                            </div>
                                            <div className="text-white/80 text-sm font-semibold">Followers</div>
                                        </div>
                                    </div>

                                    {/* Info Cards Row */}
                                    <div className="flex gap-3 mb-4">
                                        <div className="flex-1">
                                            <div className="text-white/80 text-xs font-semibold mb-2">Home Center</div>
                                            <div className="bg-white rounded-lg p-2">
                                                <div className="text-[#2D3E1F] font-bold text-xs">The Goodnight</div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white/80 text-xs font-semibold mb-2">Favorite Brands</div>
                                            <div className="bg-white rounded-lg p-2 flex gap-1 overflow-x-auto">
                                                {player.favorite_brands && player.favorite_brands.length > 0 ? (
                                                    player.favorite_brands.slice(0, 3).map((brand) => (
                                                        <div key={brand.brand_id} className="flex-shrink-0">
                                                            {brand.logo_url ? (
                                                                <Image
                                                                    src={brand.logo_url}
                                                                    alt={brand.name}
                                                                    width={42}
                                                                    height={42}
                                                                    className="rounded object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 text-xs text-black/50 font-extrabold flex items-center justify-center">
                                                                    {brand.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-black/50 text-xs font-bold">Storm</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <MetricTile label="Tournament" value="25" icon={Trophy} accentColor={accentColor} />
                                            <MetricTile label="Win" value="21" icon={Award} accentColor={accentColor} />
                                        </div>
                                        <div className="flex gap-2">
                                            <MetricTile label="Rank" value="12" icon={Star} accentColor={accentColor} />
                                            <MetricTile label="Win Rate" value="95%" icon={TrendingUp} accentColor={accentColor} />
                                        </div>
                                        <div className="flex gap-2">
                                            <MetricTile
                                                label="Best Score"
                                                value={player.stats.high_game.toString()}
                                                icon={Target}
                                                accentColor={accentColor}
                                            />
                                            <MetricTile label="Streak" value="15" icon={Flame} accentColor={accentColor} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Shots view - Show player image
                                player.profile_picture_url ? (
                                    <>
                                        <Image
                                            src={player.profile_picture_url}
                                            alt={player.name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.35))',
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(135deg, ${primaryColor}A6, ${accentColor}73)`,
                                        }}
                                    >
                                        <div className="text-white text-8xl">👤</div>
                                    </div>
                                )
                            )}

                            {/* Segment Control */}
                            <div className="absolute bottom-2 left-2 right-2 z-10">
                                <div
                                    className="h-10 rounded-full flex"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.4)',
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStatsView('shots');
                                        }}
                                        className="flex-1 m-1 rounded-full font-bold text-sm transition-all duration-200"
                                        style={{
                                            backgroundColor: statsView === 'shots' ? 'white' : 'transparent',
                                            color: statsView === 'shots' ? `${primaryColor}D9` : 'rgba(255, 255, 255, 0.75)',
                                        }}
                                    >
                                        Shots
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStatsView('stats');
                                        }}
                                        className="flex-1 m-1 rounded-full font-bold text-sm transition-all duration-200"
                                        style={{
                                            backgroundColor: statsView === 'stats' ? 'white' : 'transparent',
                                            color: statsView === 'stats' ? `${primaryColor}D9` : 'rgba(255, 255, 255, 0.75)',
                                        }}
                                    >
                                        Stats
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="h-5" />

                        {/* Bottom Section: Name and Actions */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                {/* Player Name */}
                                <h3 className="text-white text-xl font-black tracking-wide uppercase truncate">
                                    {player.name}
                                </h3>

                                <div className="h-2" />

                                {/* Level/Progress */}
                                <div className="flex items-center gap-2">
                                    <Zap size={16} style={{ color: accentColor }} />
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: accentColor,
                                                width: `${levelProgress(player.xp) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 p-2">
                                {/* Follow Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onFollow?.();
                                    }}
                                    disabled={isLoading}
                                    className="h-6 px-2 rounded flex items-center gap-1.5 text-white font-bold text-xs shadow-sm transition-opacity disabled:opacity-50"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {isLoading ? (
                                        <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Star size={10} />
                                            <span>{player.is_followed ? 'Following' : 'Follow'}</span>
                                        </>
                                    )}
                                </button>

                                {/* Collect Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCollect?.();
                                    }}
                                    className="h-6 px-2 rounded flex items-center gap-1.5 text-white font-bold text-xs transition-opacity"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
                                >
                                    <Heart size={10} />
                                    <span>Collect</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Metric Tile Component
interface MetricTileProps {
    label: string;
    value: string;
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    accentColor: string;
}

function MetricTile({ label, value, icon: Icon, accentColor }: MetricTileProps) {
    return (
        <div className="flex-1">
            <div className="text-white/70 text-xs font-semibold mb-1">{label}</div>
            <div className="bg-white rounded-md px-2 py-1 flex items-center justify-between">
                <span className="text-lg font-black" style={{ color: accentColor }}>
                    {value}
                </span>
                <Icon size={22} style={{ color: accentColor }} />
            </div>
        </div>
    );
}
