'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Edit, Users, Eye } from 'lucide-react';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';

export default function ProfilePage() {
    const { user } = useAuth();

    // Mock data for posts
    const posts = [
        {
            id: 1,
            author: {
                name: "Miles, Esther",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miles",
            },
            content: "Just bowled my personal best! 🎳 **247** in the third game tonight! The pins were falling like dominos. *So pumped* for league play next week! Who else is ready to roll some strikes? 🔥",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
            likes: 350,
            comments: 15,
            timeAgo: "2h"
        },
        {
            id: 2,
            author: {
                name: "Nguyen, Shane",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shane",
            },
            content: "League night was **incredible**! 🎳 Our team took first place with a combined series of 2,847! *Special shoutout* to my teammates for the amazing support. Can't wait for championship rounds! 🏆",
            likes: 250,
            comments: 15,
            timeAgo: "3h"
        },
        {
            id: 3,
            author: {
                name: "Black, Marvin",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marvin",
            },
            content: "Pro tip for all my fellow bowlers: *Consistency beats power every time*. Focus on your **footwork** and **follow-through**. Been working on this technique for months and finally seeing results! 🎯",
            likes: 200,
            comments: 13,
            timeAgo: "5h"
        }
    ];

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
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
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
