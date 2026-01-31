'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FeedPost } from '@/types';
import CreatePost from '@/components/CreatePost';
import FeedPostCard from '@/components/FeedPostCard';
import FeedSidebar from '@/components/FeedSidebar';

export default function FeedV3Page() {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeed = async (pageNum: number, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            // API returns { results: [], next: string | null, count: number, ... }
            const response = await api.get(`/api/posts/v3/feed?page=${pageNum}`);

            const data = response.data;
            const rawPosts = data.results || [];

            // Map raw API response to FeedPost type
            const newPosts: FeedPost[] = rawPosts.map((post: any) => ({
                post_id: post.default_post_id,
                uid: post.metadata?.uid || '',
                author: post.metadata?.author || {
                    user_id: 0,
                    name: 'Unknown',
                    first_name: '',
                    last_name: '',
                    username: '',
                    email: '',
                    roles: { is_pro: false, is_center_admin: false, is_tournament_director: false },
                    profile_picture_url: '',
                    is_followable: false,
                    is_following: false,
                    follower_count: 0
                },
                text: post.text,
                media_urls: post.media_urls || [],
                created: post.metadata?.created || '',
                like_count: post.metadata?.likes_count || 0,
                is_liked: post.metadata?.has_liked || false,
                comments: post.metadata?.latest_comments?.map((comment: any) => ({
                    post_id: post.default_post_id,
                    comment_id: comment.comment_id,
                    user: comment.user,
                    text: comment.text,
                    media_urls: comment.media_url ? [comment.media_url] : []
                })) || []
            }));

            setHasMore(!!data.next);

            setPosts(prevPosts => isLoadMore ? [...prevPosts, ...newPosts] : newPosts);
            setError(null);
        } catch (err) {
            console.error('Error fetching feed v3:', err);
            setError('Failed to load feed');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchFeed(1, false);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchFeed(nextPage, true);
    };

    const handlePostChange = (updatedPost: FeedPost) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.post_id === updatedPost.post_id ? updatedPost : post
            )
        );
    };

    const reloadFeed = () => {
        setPage(1);
        setHasMore(true);
        fetchFeed(1, false);
    };

    if (loading && posts.length === 0) {
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

    if (error && posts.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex gap-8">
                        <div className="flex-1 max-w-2xl">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={reloadFeed}
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
            <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
                    {/* Main Content */}
                    <div className="flex-1 w-full max-w-4xl">
                        {/* Create Post Section */}
                        <div className="mb-4 md:mb-6">
                            <CreatePost onPostCreated={reloadFeed} />
                        </div>

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
                                        key={post.post_id}
                                        post={post}
                                        onPostChange={handlePostChange}
                                    />
                                ))
                            )}
                        </div>

                        {/* Load More Button */}
                        {posts.length > 0 && hasMore && (
                            <div className="text-center mt-8 pb-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                                >
                                    {loadingMore ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        'Load more posts'
                                    )}
                                </button>
                            </div>
                        )}

                        {posts.length > 0 && !hasMore && (
                            <div className="text-center mt-8 pb-8">
                                <p className="text-gray-500">You've reached the end!</p>
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
