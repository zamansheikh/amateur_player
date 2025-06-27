'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Edit, Users, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    const { user } = useAuth();
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Create Post Section */}
                        <CreatePost />

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
                                <button className="text-green-600 text-sm hover:underline">Edit Profile</button>
                            </div>

                            {/* Level and XP */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{user?.level || 20}</div>
                                    <div className="text-sm text-gray-600">Level</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{user?.xp || 2881}</div>
                                    <div className="text-sm text-gray-600">XP</div>
                                </div>
                            </div>

                            {/* Community Contribution */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Contribution</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Posts:</span>
                                        <span className="font-medium">56</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Views:</span>
                                        <span className="font-medium">8.5k</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Thanks:</span>
                                        <span className="font-medium">105</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Insightful:</span>
                                        <span className="font-medium">435</span>
                                    </div>
                                </div>
                            </div>

                            {/* Other Actions */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900">Other</h3>
                                <button className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Edit className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">Create Post</span>
                                </button>
                                <button className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">Create Event</span>
                                </button>
                                <button className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">Create Poll</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
