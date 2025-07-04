'use client';

import { useState, useEffect } from 'react';
import { X, Play, MessageCircle, Heart, Share, MoreHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
    id: number;
    name: string;
    username: string;
    email: string;
    profile_picture_url: string;
    cover_video_url?: string;
    bio?: string;
    role: string;
    stats: {
        followers: number;
        following: number;
        likes: number;
        level: number;
        xp: number;
        posts: number;
        views: number;
        thanks: number;
        insightful: number;
    };
    is_following: boolean;
    is_verified: boolean;
}

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
        is_following: boolean;
        viewer_is_author: boolean;
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

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
}

export default function UserProfileModal({ isOpen, onClose, userId }: UserProfileModalProps) {
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [activeTab, setActiveTab] = useState<'Posts' | 'Video' | 'News'>('Posts');
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Replace with your actual API endpoint
            // const response = await api.get(`/api/user/${userId}/profile`);
            const dummpyProfile: UserProfile ={
                id: userId,
                name: "Jennifer",
                username: "jennifer123",
                email: "abc@gmail.com",
                profile_picture_url: "/playercard1.png",
                cover_video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                role: "Pro Player",
                stats: {
                    followers: 2985,
                    following: 50,
                    likes: 182501,
                    level: 20,
                    xp: 2240,
                    posts: 56,
                    views: 8500,
                    thanks: 105,
                    insightful: 435
                },
                is_following: false,
                is_verified: true
            }
            // setProfile(response.data);
            setProfile(dummpyProfile);
            setIsFollowing(dummpyProfile.is_following);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user posts
    const fetchPosts = async () => {
        try {
            setPostsLoading(true);
            
            // Replace with your actual API endpoint
            // const response = await api.get(`/api/user/${userId}/posts`);
            const dummyPosts: UserPost[] = [
                {
                    metadata: {
                        id: 1,
                        uid: "post-1",
                        post_privacy: "public",
                        total_likes: 120,
                        total_comments: 5,
                        created_at: "2023-10-01T12:00:00Z",
                        updated_at: "2023-10-01T12:00:00Z",
                        created: "1 Oct 2023",
                        last_update: "1 Oct 2023",
                        has_text: true,
                        has_image: true,
                        has_video: false,
                        has_poll: false,
                        has_event: false
                    },
                    author: {
                        user_id: userId,
                        name: "Jennifer",
                        profile_pic_url: "/playercard1.png",
                        is_following: false,
                        viewer_is_author: false
                    },
                    likes: [
                        {
                            total: 120,
                            likers: [
                                {
                                    user_id: 2,
                                    name: "Alex",
                                    profile_pic_url: "/avatar2.png"
                                },
                                {
                                    user_id: 3,
                                    name: "Sam",
                                    profile_pic_url: "/avatar3.png"
                                }
                            ]
                        }
                    ],
                    comments: [
                        {
                            total: 5,
                            comment_list: [
                                {
                                    comment_id: 1,
                                    user: {
                                        user_id: 4,
                                        name: "Chris",
                                        profile_pic_url: "/avatar4.png"
                                    },
                                    text: "Great post!",
                                    pics: [],
                                    replies: []
                                },
                                {
                                    comment_id: 2,
                                    user: {
                                        user_id: 5,
                                        name: "Taylor",
                                        profile_pic_url: "/avatar5.png"
                                    },
                                    text: "Congrats!",
                                    pics: [],
                                    replies: []
                                }
                            ]
                        }
                    ],
                    caption: "Had an amazing game today! 🎳",
                    images: ["/post-image1.jpg"],
                    videos: [],
                    poll: null,
                    event: null,
                    tags: ["bowling", "game", "fun"]
                }
            ];
            setPosts(dummyPosts);



            // setPosts(response.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    // Follow/Unfollow user
    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await api.delete(`/api/user/${userId}/follow`);
                setIsFollowing(false);
                if (profile) {
                    setProfile({
                        ...profile,
                        stats: {
                            ...profile.stats,
                            followers: profile.stats.followers - 1
                        }
                    });
                }
            } else {
                await api.post(`/api/user/${userId}/follow`);
                setIsFollowing(true);
                if (profile) {
                    setProfile({
                        ...profile,
                        stats: {
                            ...profile.stats,
                            followers: profile.stats.followers + 1
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error following/unfollowing user:', err);
        }
    };

    // Get in touch (message user)
    const handleGetInTouch = () => {
        // Navigate to messages or open chat
        console.log('Get in touch with user:', userId);
    };

    // Like post
    const handleLike = async (postId: number) => {
        try {
            await api.post(`/api/posts/${postId}/like`);
            // Update local state
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.metadata.id === postId
                        ? {
                            ...post,
                            metadata: {
                                ...post.metadata,
                                total_likes: post.metadata.total_likes + 1
                            }
                        }
                        : post
                )
            );
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    useEffect(() => {
        if (isOpen && userId) {
            fetchProfile();
            fetchPosts();
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[95vw] max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-end p-4 border-b border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchProfile}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Profile Header */}
                        <div className="relative">
                            {/* Cover Image */}
                            <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 relative">
                                {profile?.cover_video_url ? (
                                    <img
                                        src={profile.cover_video_url}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                <button className="absolute bottom-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                                    <Play className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 pb-4">
                                <div className="flex items-end gap-4 -mt-16">
                                    {/* Profile Picture */}
                                    <div className="relative">
                                        <img
                                            src={profile?.profile_picture_url || "/playercard1.png"}
                                            alt={profile?.name}
                                            className="w-32 h-32 rounded-2xl border-4 border-white object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 mt-16">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
                                            {profile?.is_verified && (
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-4">{profile?.role || 'Pro Player'}</p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleFollow}
                                                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                                    isFollowing
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                            >
                                                {isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                            <button
                                                onClick={handleGetInTouch}
                                                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Get in Touch
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-8 mt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span className="text-purple-600 font-bold text-sm">{profile?.stats.level || 20}</span>
                                        </div>
                                        <span className="text-gray-600">Level</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-bold text-sm">{profile?.stats.xp || 2240}</span>
                                        </div>
                                        <span className="text-gray-600">XP</span>
                                    </div>
                                </div>

                                {/* Detailed Stats */}
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{profile?.stats.followers?.toLocaleString() || '2,985'}</div>
                                        <div className="text-sm text-gray-600">Follower</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{profile?.stats.following?.toLocaleString() || '50'}</div>
                                        <div className="text-sm text-gray-600">Following</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{profile?.stats.likes?.toLocaleString() || '1,82,501'}</div>
                                        <div className="text-sm text-gray-600">Like</div>
                                    </div>
                                </div>

                                {/* Community Contribution */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Contribution</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Posts:</span>
                                            <span className="font-medium">{profile?.stats.posts || 56}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Views:</span>
                                            <span className="font-medium">{profile?.stats.views?.toLocaleString() || '8.5k'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thanks:</span>
                                            <span className="font-medium">{profile?.stats.thanks || 105}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Insightful:</span>
                                            <span className="font-medium">{profile?.stats.insightful || 435}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <div className="flex px-6">
                                {(['Posts', 'Video', 'News'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === tab
                                                ? 'text-green-600 border-b-2 border-green-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Posts Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {postsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading posts...</p>
                                    </div>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No posts yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {posts.map((post) => (
                                        <div key={post.metadata.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-gray-500">{post.metadata.created}</span>
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-800 mb-3 line-clamp-3">{post.caption}</p>
                                                
                                                {post.images && post.images.length > 0 && (
                                                    <div className="mb-3 rounded-lg overflow-hidden">
                                                        <img
                                                            src={post.images[0]}
                                                            alt="Post"
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center justify-between text-gray-500">
                                                    <button
                                                        onClick={() => handleLike(post.metadata.id)}
                                                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                        <span className="text-xs">{post.metadata.total_likes}</span>
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                                        <MessageCircle className="w-4 h-4" />
                                                        <span className="text-xs">{post.metadata.total_comments}</span>
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                                                        <Share className="w-4 h-4" />
                                                        <span className="text-xs">Share</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
