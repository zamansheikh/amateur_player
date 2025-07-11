'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
    BarChart3,
    MessageCircle,
    Trophy,
    Bell,
    Users,
    TrendingUp,
    Heart,
    Share,
    Eye,
    UserPlus,
    UserCheck
} from 'lucide-react';

interface DashboardData {
    user_id: number;
    likes: number;
    comments: number;
    shares: number;
    views: number;
    follower_count: number;
    onboarded_user_count: number;
    free_users: number;
    premium_user_count: number;
    conversion_rate: number;
    weighted_index: number;
}

interface Player {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    stats: {
        averageScore: number;
        tournaments: number;
        wins: number;
        pbaRank: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
    };
    weightedIndex: {
        percentage: number;
        freeUsers: number;
        premiumUsers: number;
        engagement: number;
    };
}

interface Message {
    id: string;
    from: string;
    content: string;
    timestamp: string;
    read: boolean;
}

// Mock data
const mockProPlayer: Player = {
    id: '1',
    name: 'Johan Smith',
    username: '@johansmith',
    avatar: '',
    coverImage: '',
    bio: 'Professional bowler with 15 years of experience',
    stats: {
        averageScore: 215,
        tournaments: 45,
        wins: 23,
        pbaRank: 12,
        average_score: 215,
        high_game: 300,
        high_series: 850,
        experience: 1200,
    },
    weightedIndex: {
        percentage: 20,
        freeUsers: 0,
        premiumUsers: 0,
        engagement: 19,
    },
};

const mockMessages: Message[] = [
    {
        id: '1',
        from: 'fan123',
        content: 'Your technique is incredible! Any tips for a beginner?',
        timestamp: '2024-01-17',
        read: false
    },
    {
        id: '2',
        from: 'youngbowler',
        content: "I'm 16 and just started bowling. You're my inspiration!",
        timestamp: '2024-01-17',
        read: false
    },
    {
        id: '3',
        from: 'coachsmith',
        content: 'Would love to collaborate on a youth program!',
        timestamp: '2024-01-15',
        read: false
    }
];

// Metrics Component
function Metrics({ playerId, dashboardData, user }: { playerId: string; dashboardData: DashboardData | null; user: any }) {
    return (
        <div className="space-y-6">
            {/* Fan Base */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Fan Base</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {dashboardData ? dashboardData.follower_count : 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Fans</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {dashboardData ? dashboardData.premium_user_count : 0}
                        </div>
                        <div className="text-sm text-gray-600">Premium</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+3.7% this week</span>
                </div>
            </div>

            {/* Engagement */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Engagement</h3>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-600">Likes</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {dashboardData ? dashboardData.likes : 4}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">Comments</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {dashboardData ? dashboardData.comments : 15}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Share className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Shares</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {dashboardData ? dashboardData.shares : 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600">Video Views</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {dashboardData ? dashboardData.views : 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Conversion */}
            {/* <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion</h3>
                <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                        {dashboardData ? `${(dashboardData.conversion_rate * 100).toFixed(1)}%` : '0.60%'}
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default function OverviewPage() {
    const { user } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true); useEffect(() => {
        const loadDashboardData = async () => {
            try {
                if (user && user.authenticated) {
                    // Fetch dashboard data from API
                    const token = localStorage.getItem('access_token');
                    if (token) {
                        try {
                            const response = await axios.get('https://test.bowlersnetwork.com/api/user/pro-dashboard-data', {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                }
                            });

                            if (response.data) {
                                setDashboardData(response.data);
                            }
                        } catch (error) {
                            console.error('Error fetching dashboard data:', error);
                        }
                    }

                    // Create player data from authenticated user
                    const playerData: Player = {
                        id: user.username || '1',
                        name: user.name,
                        username: user.username || '',
                        avatar: user.profile_picture_url || '',
                        coverImage: '',
                        bio: `Professional bowler with ${user.xp || 0} XP points`,
                        stats: {
                            averageScore: user.stats?.average_score || 0,
                            tournaments: 0,
                            wins: user.stats?.high_game || 0,
                            pbaRank: user.stats?.high_series || 0,
                            average_score: user.stats?.average_score || 0,
                            high_game: user.stats?.high_game || 0,
                            high_series: user.stats?.high_series || 0,
                            experience: user.stats?.experience || 0,
                        },
                        weightedIndex: {
                            percentage: 85,
                            freeUsers: user.follower_count || 0,
                            premiumUsers: 0,
                            engagement: user.xp || 0,
                        },
                    };
                    setPlayer(playerData);
                } else {
                    // Use mock data if no user (fallback)
                    setPlayer(mockProPlayer);
                }
                setMessages(mockMessages);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]); if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-green-600">Loading Dashboard...</div>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Player not found</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Welcome Header */}
            <div className="text-white px-6 py-6" style={{ background: 'linear-gradient(to right, #8BC342, #6fa332)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{player.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>                    
                    <div>
                        <h1 className="text-2xl font-bold">Overview</h1>
                        <p className="text-green-100">Welcome back, {player.name || 'Johan Smith'}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Premium Users</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {dashboardData ? `${dashboardData.premium_user_count}` : `0`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Total Fans</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {dashboardData ? dashboardData.follower_count.toLocaleString() : '1'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Referrals</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {dashboardData ? dashboardData.onboarded_user_count.toLocaleString() : '0'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Free Users</p>
                                <p className="text-xl font-bold text-gray-900">{dashboardData ? dashboardData.free_users.toLocaleString() : '0'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Performance Overview */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Performance Overview
                                </h2>
                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">View Details</button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Heart className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-gray-900">
                                        {dashboardData ? dashboardData.likes.toLocaleString() : '4'}
                                    </p>
                                    <p className="text-sm text-gray-600">Likes</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <MessageCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-gray-900">
                                        {dashboardData ? dashboardData.comments.toLocaleString() : '15'}
                                    </p>
                                    <p className="text-sm text-gray-600">Comments</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Share className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-gray-900">
                                        {dashboardData ? dashboardData.shares.toLocaleString() : '0'}
                                    </p>
                                    <p className="text-sm text-gray-600">Shares</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <Eye className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                    <p className="text-xl font-bold text-gray-900">
                                        {dashboardData ? dashboardData.views.toLocaleString() : '0'}
                                    </p>
                                    <p className="text-sm text-gray-600">Views</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Messages */}
                        <div className="bg-white rounded-lg shadow-sm p-6">                            
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">View All</button>
                            </div>
                            <div className="space-y-3">                                
                                {messages.slice(0, 3).map((message) => (
                                    <div key={message.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-medium text-xs">{message.from.split('').slice(0,1).join('')}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-800 text-sm">{message.from}</p>
                                                <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleDateString()}</span>
                                                {!message.read && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                            </div>
                                            <p className="text-sm text-gray-600">{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Insights */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Trending Insights
                                </h3>
                            </div>                            
                            <div className="space-y-3">
                                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-green-800 text-sm">Fan Engagement Up 23%</p>
                                            <p className="text-xs text-green-600">Your recent bowling tutorial got 2.3k views</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Trophy className="w-4 h-4 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-green-800 text-sm">New Challenge Request</p>
                                            <p className="text-xs text-green-600">5 fans want a spare shooting challenge</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Performance Metrics */}
                        <Metrics playerId={player.id} dashboardData={dashboardData} user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
