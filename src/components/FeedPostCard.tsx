'use client';

import { Heart, MessageSquare, Share, Send } from 'lucide-react';
import { useState } from 'react';

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

interface FeedPostCardProps {
    post: FeedPost;
}

export default function FeedPostCard({ post }: FeedPostCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(post.metadata.total_likes);
    const [comment, setComment] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);

    const handleLike = () => {
        if (isLiked) {
            setLocalLikes(prev => prev - 1);
        } else {
            setLocalLikes(prev => prev + 1);
        }
        setIsLiked(!isLiked);
    };

    const handleComment = () => {
        setShowCommentInput(!showCommentInput);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            // Handle comment submission here
            console.log('Comment submitted:', comment);
            setComment('');
            setShowCommentInput(false);
        }
    };

    // Function to render text with hashtags
    const renderTextWithTags = (text: string, tags: string[]) => {
        if (tags.length === 0) return text;

        let renderedText = text;
        tags.forEach(tag => {
            const hashtag = `#${tag}`;
            renderedText = renderedText.replace(
                new RegExp(`\\b${tag}\\b`, 'gi'),
                hashtag
            );
        });

        return renderedText.split(/(#\w+)/g).map((part, index) => {
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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={post.author.profile_pic_url}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base">{post.author.name}</h3>
                            <p className="text-sm text-gray-500">{post.metadata.created}</p>
                        </div>
                    </div>
                    {!post.author.viewer_is_author && (
                        <button className={`border px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${post.author.is_following
                                ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                : 'border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700'
                            }`}>
                            {post.author.is_following ? 'Following' : '+ Follow'}
                        </button>
                    )}
                </div>

                {/* Post Content */}
                <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed text-[15px] line-height-6">
                        {renderTextWithTags(post.caption, post.tags)}
                    </p>
                </div>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                    <div className="mb-4 -mx-2">
                        <img
                            src={post.images[0]}
                            alt="Post content"
                            className="w-full h-72 object-cover rounded-xl"
                        />
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition-all duration-200 ${isLiked
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-gray-600 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium">{localLikes}</span>
                        </button>
                        <button
                            onClick={handleComment}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {post.metadata.total_comments} Comment{post.metadata.total_comments !== 1 ? 's' : ''}
                            </span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200">
                        <Share className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                    </button>
                </div>

                {/* Comments Preview */}
                {post.comments[0].comment_list.length > 0 && (
                    <div className="mb-3 space-y-2">
                        {post.comments[0].comment_list.slice(0, 2).map((comment) => (
                            <div key={comment.comment_id} className="flex items-start gap-2">
                                <img
                                    src={comment.user.profile_pic_url}
                                    alt={comment.user.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                                    <span className="text-sm text-gray-700 ml-2">{comment.text}</span>
                                </div>
                            </div>
                        ))}
                        {post.comments[0].comment_list.length > 2 && (
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                                View all {post.metadata.total_comments} comments
                            </button>
                        )}
                    </div>
                )}

                {/* Comment Input */}
                {showCommentInput && (
                    <div className="border-t border-gray-100 pt-3 mt-3">
                        <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-sm">U</span>
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!comment.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
