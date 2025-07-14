'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Edit, Users, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import UserPostCard from '@/components/UserPostCard';
import CreatePost from '@/components/CreatePost';

interface UserPost {
    metadata: {
        id: number;
        uid: string;
        post_privacy: string;
        total_likes: number;
        total_comments: number;
        created_at: string;
        updated_at: string;
        created: string;
        last_update: string;
        has_text: boolean;
        has_image: boolean;
        has_video: boolean;
        has_poll: boolean;
        has_event: boolean;
    };
    author: {
        user_id: number;
        name: string;
        profile_pic_url: string;
    };
    likes: [{
        total: number;
        likers: Array<{
            user_id: number;
            name: string;
            profile_pic_url: string;
        }>;
    }];
    comments: [{
        total: number;
        comment_list: Array<{
            comment_id: number;
            user: {
                user_id: number;
                name: string;
                profile_pic_url: string;
            };
            text: string;
            pics: any[];
            replies: any[];
        }>;
    }];
    caption: string;
    images: any[];
    videos: any[];
    poll: any;
    event: any;
    tags: string[];
}

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingStats, setIsEditingStats] = useState(false);
    const [isUpdatingStats, setIsUpdatingStats] = useState(false);
    const [statsForm, setStatsForm] = useState({
        average_score: 0,
        high_game: 0,
        high_series: 0,
        experience: 0
    });

    const fetchUserPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/posts');
            setPosts(response.data.posts);
            setError(null);
        } catch (err) {
            console.error('Error fetching user posts:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();

        // Initialize stats form with user data
        if (user?.stats) {
            setStatsForm({
                average_score: user.stats.average_score || 0,
                high_game: user.stats.high_game || 0,
                high_series: user.stats.high_series || 0,
                experience: user.stats.experience || 0
            });
        }
    }, [user]);

    const handleStatsUpdate = async () => {
        try {
            setIsUpdatingStats(true);

            const payload = {
                average_score: parseFloat(statsForm.average_score.toString()),
                high_game: parseInt(statsForm.high_game.toString()),
                high_series: parseInt(statsForm.high_series.toString()),
                experience: parseInt(statsForm.experience.toString())
            };

            console.log('Updating stats with payload:', payload);

            await api.post('api/user/stats/game-stats', payload);

            // Refresh user data to get updated stats
            await refreshUser();

            // Update user context or refetch user data
            // You might want to refresh the user data here
            setIsEditingStats(false);

            // Show success message
            alert('Statistics updated successfully!');

        } catch (error: any) {
            console.error('Error updating stats:', error);
            alert(`Failed to update statistics: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsUpdatingStats(false);
        }
    };

    const handleStatsFormChange = (field: string, value: string) => {
        setStatsForm(prev => ({
            ...prev,
            [field]: value === '' ? 0 : parseFloat(value) || 0
        }));
    };

    const handlePostChange = (updatedPost: UserPost) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.metadata.id === updatedPost.metadata.id ? updatedPost : post
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Create Post Section */}
                        <CreatePost onPostCreated={fetchUserPosts} />

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading posts...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-2">No posts yet</p>
                                    <p className="text-gray-400">Share your first bowling experience!</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <UserPostCard
                                        key={post.metadata.id}
                                        post={post}
                                        onPostUpdate={fetchUserPosts}
                                        onPostChange={handlePostChange}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* Profile Header */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <img
                                        src={user?.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer"}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full mx-auto mb-4"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.name || "User Name"}</h2>
                                <p className="text-green-600 font-medium">{user?.is_pro ? "Pro Player" : "Amateur Player"}</p>
                                <button 
                                    onClick={() => router.push('/profile/edit')}
                                    className="text-green-600 text-sm hover:underline"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            {/* Level and EXP */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{user?.level || 20}</div>
                                    <div className="text-sm text-gray-600">Level</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{user?.stats?.experience || 2881}</div>
                                    <div className="text-sm text-gray-600">EXP</div>
                                </div>
                            </div>

                            {/* Bowling Statistics */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Bowling Statistics</h3>
                                    <button
                                        onClick={() => setIsEditingStats(!isEditingStats)}
                                        className="text-green-600 text-sm hover:underline"
                                    >
                                        {isEditingStats ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                {isEditingStats ? (
                                    /* Edit Form */
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Average Score
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={statsForm.average_score}
                                                onChange={(e) => handleStatsFormChange('average_score', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                disabled={isUpdatingStats}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                High Game
                                            </label>
                                            <input
                                                type="number"
                                                value={statsForm.high_game}
                                                onChange={(e) => handleStatsFormChange('high_game', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                disabled={isUpdatingStats}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                High Series
                                            </label>
                                            <input
                                                type="number"
                                                value={statsForm.high_series}
                                                onChange={(e) => handleStatsFormChange('high_series', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                disabled={isUpdatingStats}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Experience (years)
                                            </label>
                                            <input
                                                type="number"
                                                value={statsForm.experience}
                                                onChange={(e) => handleStatsFormChange('experience', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                disabled={isUpdatingStats}
                                            />
                                        </div>

                                        <button
                                            onClick={handleStatsUpdate}
                                            disabled={isUpdatingStats}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            {isUpdatingStats ? 'Updating...' : 'Update Statistics'}
                                        </button>
                                    </div>
                                ) : (
                                    /* Display Mode */
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Avg. Score:</span>
                                            <span className="font-medium">{user?.stats?.average_score ? Math.round(user.stats.average_score) : '237'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">High Game:</span>
                                            <span className="font-medium">{user?.stats?.high_game || '300'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">High Series:</span>
                                            <span className="font-medium">{user?.stats?.high_series || '854'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Experience (yrs):</span>
                                            <span className="font-medium">{user?.stats?.experience || '32'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Favorite Brands */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Favorite Brands</h3>
                                {user?.favorite_brands && user.favorite_brands.length > 0 ? (
                                    <div className="space-y-3">
                                        {/* Group brands by type */}
                                        {['Balls', 'Shoes', 'Accessories', 'Apparels'].map((brandType) => {
                                            const brandsOfType = user.favorite_brands?.filter(brand => brand.brandType === brandType) || [];
                                            if (brandsOfType.length === 0) return null;
                                            
                                            return (
                                                <div key={brandType}>
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">{brandType}</h4>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {brandsOfType.map((brand) => (
                                                            <div key={brand.brand_id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                                                <Image
                                                                    src={brand.logo_url}
                                                                    alt={`${brand.formal_name} logo`}
                                                                    width={32}
                                                                    height={32}
                                                                    className="object-contain"
                                                                />
                                                                <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500 text-sm">No favorite brands selected</p>
                                        <p className="text-gray-400 text-xs mt-1">Update your preferences in settings</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
