"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
    FeedV3Post,
    FeedV3Comment,
    isDefaultContent,
    isPollContent,
    isSharedContent,
    LikeResponse,
    PaginatedResponse,
} from "@/types/feedv3";
import MediaGallery from "@/components/MediaGallery";
import AutoExpandingTextarea from "@/components/AutoExpandingTextarea";
import PollCard from "@/components/feedv3/PollCard";
import SharedPostPreview from "@/components/feedv3/SharedPostPreview";

export default function PostV3DetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const postUid = params.uid as string;

    const [post, setPost] = useState<FeedV3Post | null>(null);
    const [comments, setComments] = useState<FeedV3Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [replyTo, setReplyTo] = useState<FeedV3Comment | null>(null);
    const [commentsPage, setCommentsPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [totalComments, setTotalComments] = useState(0);

    // Fetch post details
    const fetchPost = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // First, get the post ID from the UID by fetching feed and finding it
            // Or we can try to fetch directly if the API supports UID
            const response = await api.get(`/api/newsfeed/v1/post/${postUid}/`);
            setPost(response.data);
        } catch (err: any) {
            console.error("Error fetching post:", err);
            // Fallback: try fetching by searching the feed
            try {
                const feedResponse = await api.get(`/api/newsfeed/v1/feed/?page_size=100`);
                const foundPost = feedResponse.data.results.find((p: FeedV3Post) => p.uid === postUid);
                if (foundPost) {
                    setPost(foundPost);
                } else {
                    setError("Post not found");
                }
            } catch (fallbackErr) {
                setError("Failed to load post");
            }
        } finally {
            setIsLoading(false);
        }
    }, [postUid]);

    // Fetch comments for the post
    const fetchComments = useCallback(async (page: number = 1) => {
        if (!post) return;

        try {
            setIsLoadingComments(true);
            const response = await api.get<PaginatedResponse<FeedV3Comment>>(
                `/api/newsfeed/v1/${post.id}/comments/?page=${page}&page_size=15`
            );

            if (page === 1) {
                setComments(response.data.results);
            } else {
                setComments(prev => [...prev, ...response.data.results]);
            }

            setTotalComments(response.data.count);
            setHasMoreComments(!!response.data.next);
            setCommentsPage(page);
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setIsLoadingComments(false);
        }
    }, [post]);

    useEffect(() => {
        if (postUid && user?.access_token) {
            fetchPost();
        }
    }, [postUid, user?.access_token, fetchPost]);

    useEffect(() => {
        if (post) {
            fetchComments(1);
        }
    }, [post, fetchComments]);

    // Handle like/unlike
    const handleLike = async () => {
        if (!post || isLiking) return;

        // Optimistic update
        const previousPost = { ...post };
        const newIsLiked = !post.has_liked;
        const newLikeCount = newIsLiked ? post.likes_count + 1 : post.likes_count - 1;

        setPost({
            ...post,
            has_liked: newIsLiked,
            likes_count: newLikeCount
        });

        try {
            setIsLiking(true);
            const response = await api.post<LikeResponse>(`/api/newsfeed/v1/${post.id}/like/`);

            setPost(prev => prev ? {
                ...prev,
                has_liked: response.data.is_liked,
                likes_count: response.data.likes_count
            } : null);
        } catch (err) {
            console.error("Error toggling like:", err);
            setPost(previousPost);
        } finally {
            setIsLiking(false);
        }
    };

    // Handle comment submission
    const handleSubmitComment = async () => {
        if (!commentText.trim() || isSubmittingComment || !post) return;

        try {
            setIsSubmittingComment(true);
            const payload: { text: string; parent_id?: number } = {
                text: commentText
            };

            if (replyTo) {
                payload.parent_id = replyTo.id;
            }

            await api.post(`/api/newsfeed/v1/${post.id}/comments/`, payload);

            // Clear form
            setCommentText("");
            setReplyTo(null);

            // Refresh comments
            await fetchComments(1);

            // Update post comment count
            setPost(prev => prev ? {
                ...prev,
                comments_count: prev.comments_count + 1
            } : null);
        } catch (err) {
            console.error("Error submitting comment:", err);
            alert("Failed to post comment. Please try again.");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Handle comment like
    const handleLikeComment = async (commentId: number) => {
        try {
            const response = await api.post<LikeResponse>(`/api/newsfeed/v1/comments/${commentId}/like/`);

            // Update comment in local state
            setComments(prev =>
                prev.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            has_liked: response.data.is_liked,
                            likes_count: response.data.likes_count
                        };
                    }
                    if (comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.map(reply =>
                                reply.id === commentId
                                    ? { ...reply, has_liked: response.data.is_liked, likes_count: response.data.likes_count }
                                    : reply
                            )
                        };
                    }
                    return comment;
                })
            );
        } catch (err) {
            console.error("Error liking comment:", err);
        }
    };

    // Render comment
    const renderComment = (comment: FeedV3Comment, isReply = false) => (
        <div key={comment.id} className={`${isReply ? "ml-12 mt-3" : ""}`}>
            <div className="flex gap-3">
                <img
                    src={comment.author.profile_picture_url}
                    alt={comment.author.name}
                    className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full object-cover flex-shrink-0`}
                />
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-2xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900">
                                {comment.author.name}
                            </span>
                            {comment.is_post_author && (
                                <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                                    Author
                                </span>
                            )}
                        </div>
                        <p className="text-gray-800 text-sm">{comment.text}</p>

                        {/* Comment media */}
                        {comment.media_url && (
                            <img
                                src={comment.media_url}
                                alt="Comment media"
                                className="mt-2 rounded-lg max-h-48 object-cover"
                            />
                        )}
                    </div>

                    {/* Comment actions */}
                    <div className="flex items-center gap-4 mt-1.5 ml-1 text-xs text-gray-500">
                        <span>{comment.created}</span>
                        <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`font-medium hover:text-red-500 ${comment.has_liked ? "text-red-500" : ""}`}
                        >
                            {comment.likes_count > 0 && `${comment.likes_count} `}
                            {comment.has_liked ? "Liked" : "Like"}
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => {
                                    setReplyTo(comment);
                                    setCommentText("");
                                }}
                                className="font-medium hover:text-green-600"
                            >
                                Reply
                            </button>
                        )}
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map(reply => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">{error || "Post not found"}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                {/* Post Detail */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => router.push(`/profile/${post.author.username}`)}
                        >
                            <img
                                src={post.author.profile_picture_url}
                                alt={post.author.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors">
                                    {post.author.name}
                                </h3>
                                <p className="text-sm text-gray-500">@{post.author.username} · {post.created}</p>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                        {/* Default post content */}
                        {isDefaultContent(post.content) && (
                            <>
                                {post.content.text && (
                                    <p className="text-gray-900 text-lg mb-4 whitespace-pre-wrap">
                                        {post.content.text}
                                    </p>
                                )}
                                {post.content.media_urls && post.content.media_urls.length > 0 && (
                                    <div className="mt-4">
                                        <MediaGallery
                                            media={post.content.media_urls}
                                            enableLightbox={true}
                                            maxHeight="600px"
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {isPollContent(post.content) && (
                            <PollCard
                                postId={post.id}
                                content={post.content}
                                post={post}
                                onVote={(updatedPost) => setPost(updatedPost)}
                            />
                        )}

                        {/* Shared content */}
                        {isSharedContent(post.content) && (
                            <>
                                {post.content.description && (
                                    <p className="text-gray-900 mb-4 whitespace-pre-wrap">
                                        {post.content.description}
                                    </p>
                                )}
                                <SharedPostPreview originalPost={post.content.original} />
                            </>
                        )}
                    </div>

                    {/* Interaction Stats */}
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Heart className={`w-4 h-4 ${post.has_liked ? "fill-red-500 text-red-500" : ""}`} />
                            {post.likes_count} {post.likes_count === 1 ? "like" : "likes"}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments_count} {post.comments_count === 1 ? "comment" : "comments"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {post.shares_count} {post.shares_count === 1 ? "share" : "shares"}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${post.has_liked
                                ? "text-red-500 bg-red-50"
                                : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${post.has_liked ? "fill-current" : ""}`} />
                            <span className="font-medium">{post.has_liked ? "Liked" : "Like"}</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">Comment</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
                            <Share2 className="w-5 h-5" />
                            <span className="font-medium">Share</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="p-4 border-t border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Comments ({totalComments})
                        </h3>

                        {/* Reply Indicator */}
                        {replyTo && (
                            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 rounded-lg">
                                <span className="text-sm text-green-700">
                                    Replying to <strong>{replyTo.author.name}</strong>
                                </span>
                                <button
                                    onClick={() => setReplyTo(null)}
                                    className="ml-auto text-green-600 hover:text-green-700 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {/* Comment Input */}
                        <div className="flex gap-3 mb-6">
                            <img
                                src={user?.profile_media?.profile_picture_url || "/logo/default-avatar.png"}
                                alt="Your avatar"
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-2"
                            />
                            <div className="flex-1">
                                <AutoExpandingTextarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmitComment();
                                        }
                                    }}
                                    placeholder={replyTo ? `Reply to ${replyTo.author.name}...` : "Write a comment..."}
                                    minRows={1}
                                    maxRows={5}
                                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={handleSubmitComment}
                                        disabled={!commentText.trim() || isSubmittingComment}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {isSubmittingComment ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {isSubmittingComment ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.length > 0 ? (
                                <>
                                    {comments.map(comment => renderComment(comment))}

                                    {/* Load More Comments */}
                                    {hasMoreComments && (
                                        <button
                                            onClick={() => fetchComments(commentsPage + 1)}
                                            disabled={isLoadingComments}
                                            className="w-full py-2 text-green-600 hover:text-green-700 font-medium text-sm"
                                        >
                                            {isLoadingComments ? (
                                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                            ) : (
                                                "Load more comments"
                                            )}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
