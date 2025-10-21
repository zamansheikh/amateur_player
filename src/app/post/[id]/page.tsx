"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Heart, MessageSquare, Share, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import MediaGallery from "@/components/MediaGallery";
import FeedPostCard from "@/components/FeedPostCard";

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
  likes: {
    total: number;
    likers: Array<{
      user_id: number;
      name: string;
      profile_pic_url: string;
    }>;
  };
  comments: {
    total: number;
    comment_list: Array<{
      comment_id: number;
      user: {
        user_id: number;
        name: string;
        profile_pic_url: string;
      };
      text: string;
      pics: string[];
      replies: Array<{
        reply_id: number;
        user: {
          user_id: number;
          name: string;
          profile_pic_url: string;
        };
        text: string;
        pics: string[];
      }>;
    }>;
  };
  caption: string;
  media: string[];
  poll: {
    id: number;
    uid: string;
    title: string;
    poll_type: string;
    options: Array<{
      option_id: number;
      content: string;
      vote: number;
      perc: number;
    }>;
  } | null;
  event: {
    id: number;
    title: string;
    date: string;
    location?: string;
  } | null;
  tags: string[];
  is_liked_by_me: boolean;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id as string;

  const [post, setPost] = useState<FeedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [replyToComment, setReplyToComment] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Fetch post details
  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/api/post/${postId}`);
      setPost(response.data);
    } catch (err: unknown) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Function to parse caption
  const parseCaption = (caption: string): string => {
    try {
      if (caption.startsWith('[') && caption.endsWith(']')) {
        const parsed = JSON.parse(caption.replace(/'/g, '"'));
        return Array.isArray(parsed) ? parsed[0] || '' : caption;
      }
      return caption;
    } catch (error) {
      return caption;
    }
  };

  // Function to render text with hashtags
  const renderTextWithTags = (text: string, tags: string[]) => {
    const cleanText = parseCaption(text);
    
    return cleanText.split(/(#\w+)/g).map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-green-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleLike = async () => {
    if (isLiking || !post) return;

    try {
      setIsLiking(true);
      const newLikedState = !post.is_liked_by_me;
      const updatedPost: FeedPost = {
        ...post,
        is_liked_by_me: newLikedState,
        metadata: {
          ...post.metadata,
          total_likes: newLikedState ? post.metadata.total_likes + 1 : post.metadata.total_likes - 1
        }
      };
      setPost(updatedPost);

      await api.get(`/api/user/post/click-like/${post.metadata.id}`);
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      fetchPost();
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isCommenting || !post) return;

    try {
      setIsCommenting(true);
      const response = await api.post(`/api/user/post/add-comment/${post.metadata.id}`, {
        text: comment.trim()
      });

      const newComment = response.data.comment;
      const updatedPost: FeedPost = {
        ...post,
        metadata: {
          ...post.metadata,
          total_comments: post.metadata.total_comments + 1
        },
        comments: {
          total: post.comments.total + 1,
          comment_list: [newComment, ...post.comments.comment_list]
        }
      };

      setPost(updatedPost);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyToComment(replyToComment === commentId ? null : commentId);
    setReplyText('');
  };

  const handleReplySubmit = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (!replyText.trim() || isReplying) return;

    try {
      setIsReplying(true);
      await api.post(`/api/user/post/add-reply/${commentId}`, {
        text: replyText.trim()
      });

      setReplyText('');
      setReplyToComment(null);
      fetchPost(); // Refresh to show new reply
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleUserClick = (userId: number) => {
    router.push(`/player/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Post not found"}</p>
          <button
            onClick={() => router.back()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Post Card */}
        <FeedPostCard post={post} onPostUpdate={fetchPost} enableMediaLightbox={true} />

        {/* Comments Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-ful flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                 <Image
                    src={user?.profile_picture_url || "/default-avatar.png"}
                    alt={user?.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                    priority={false}
                  />
                </span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || isCommenting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.comment_list.map((comment) => (
                <div key={comment.comment_id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.user.profile_pic_url}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      onClick={() => handleUserClick(comment.user.user_id)}
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => handleReply(comment.comment_id)}
                          className="text-xs text-gray-500 hover:text-green-600 font-medium transition-colors"
                        >
                          Reply
                        </button>
                        {comment.replies.length > 0 && (
                          <span className="text-xs text-gray-400">
                            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-11 space-y-3">
                      {comment.replies.map((reply: { reply_id: number; user: { user_id: number; name: string; profile_picture_url?: string }; text: string; pics: string[] }, replyIndex: number) => (
                        <div key={replyIndex} className="flex items-start gap-3">
                          <img
                            src={reply.user?.profile_picture_url || '/default-avatar.png'}
                            alt={reply.user?.name || 'User'}
                            className="w-6 h-6 rounded-full object-cover cursor-pointer"
                            onClick={() => handleUserClick(reply.user?.user_id)}
                          />
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <span className="font-medium text-xs text-gray-900">{reply.user?.name}</span>
                              <p className="text-xs text-gray-700 mt-1">{reply.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyToComment === comment.comment_id && (
                    <div className="ml-11 mt-3">
                      <form onSubmit={(e) => handleReplySubmit(e, comment.comment_id)} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-medium text-xs">
                            <Image
                              src={user?.profile_picture_url || "/default-avatar.png"}
                              alt={user?.name || "User"}
                              width={24}
                              height={24}
                              className="rounded-full object-cover"
                              priority={false}
                            />
                          </span>
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent pr-10"
                          />
                          <button
                            type="submit"
                            disabled={!replyText.trim() || isReplying}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))}

              {post.comments.comment_list.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
