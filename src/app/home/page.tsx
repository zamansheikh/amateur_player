'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import CreatePost from '@/components/CreatePost';
import FeedPostCard from '@/components/FeedPostCard';
import FeedSidebar from '@/components/FeedSidebar';

interface FeedPost {
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
        has_media: boolean;
        has_poll: boolean;
        has_event: boolean;
    };
    author: {
        user_id: number;
        name: string;
        username: string;
        profile_picture_url: string;
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
    media: string[];
    poll: any;
    event: any;
    tags: string[];
    is_liked_by_me: boolean;
}

export default function HomePage() {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeed = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/feed');
            setPosts(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching feed:', err);
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handlePostChange = (updatedPost: FeedPost) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.metadata.id === updatedPost.metadata.id ? updatedPost : post
            )
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex gap-8">
                        <div className="flex-1 max-w-2xl">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading feed...</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <FeedSidebar />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex gap-8">
                        <div className="flex-1 max-w-2xl">
                            <div className="flex items-center justify-center py-12">
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
                        </div>
                        <div className="hidden lg:block">
                            <FeedSidebar />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex gap-8">
                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Create Post Section */}
                        <CreatePost onPostCreated={fetchFeed} />

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-2">No posts yet</p>
                                    <p className="text-gray-400">Be the first to share something!</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <FeedPostCard
                                        key={post.metadata.id}
                                        post={post}
                                        onPostUpdate={fetchFeed}
                                        onPostChange={handlePostChange}
                                    />
                                ))
                            )}
                        </div>

                        {/* Load More Button (if needed in future) */}
                        {posts.length > 0 && (
                            <div className="text-center mt-8">
                                <button className="text-green-600 hover:text-green-700 font-medium">
                                    Load more posts
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block">
                        <FeedSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
