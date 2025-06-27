'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageSquare, Share, Plus, Edit, Users, Eye, ThumbsUp } from 'lucide-react';

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
            content: "Hello, friends! 🎳 With the sun shining bright and temperature rising, there's no better way to beat the heat than with a refreshing dip in the pool! 🌊☀️ Dive into Hello, friends!",
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
            content: "Hello, friends! 🎳 With the sun shining bright and temperature rising, there's no better way to beat the heat than with a refreshing dip in the pool! 🌊☀️ Dive into Hello, friends! 🎳 With the sun shining bright and temperature rising, there's no better way to beat the heat than with a...",
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
            content: "Hello, friends! 🎳 With the sun shining bright and temperature rising, there's no better way to beat the heat than with a refreshing dip in the pool! 🌊☀️ Dive into Hello, friends! 🎳 With the sun shining bright and temperature rising, there's no better way to beat the heat than with a...",
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
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                    <span className="text-white font-medium">
                                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder={`What's on your mind, ${user?.first_name || user?.name?.split(' ')[0] || 'Ron'}?`}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <div className="flex items-center gap-4 mt-4">
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                                            <Plus className="w-4 h-4" />
                                            Create Post
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                                            📎 Add Photo/Video
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                                            🔗 Attach Link
                                        </button>
                                        <button className="ml-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-lg shadow-sm">
                                    {/* Post Header */}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={post.author.avatar}
                                                    alt={post.author.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                                                    <p className="text-sm text-gray-500">{post.timeAgo}</p>
                                                </div>
                                            </div>
                                            <button className="text-green-600 border border-green-600 px-4 py-1 rounded-full text-sm hover:bg-green-50 transition-colors">
                                                + Follow
                                            </button>
                                        </div>

                                        {/* Post Content */}
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            {post.content}
                                        </p>

                                        {/* Post Image */}
                                        {post.image && (
                                            <div className="mb-4">
                                                <img
                                                    src={post.image}
                                                    alt="Post content"
                                                    className="w-full h-64 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Actions */}
                                    <div className="px-6 py-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                                                    <Heart className="w-5 h-5" />
                                                    <span>{post.likes}</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                                                    <MessageSquare className="w-5 h-5" />
                                                    <span>{post.comments} Comment</span>
                                                </button>
                                            </div>
                                            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
                                                <Share className="w-5 h-5" />
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
