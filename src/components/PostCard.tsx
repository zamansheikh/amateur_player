'use client';

import { Heart, MessageSquare, Share, Send } from 'lucide-react';
import { useState } from 'react';

interface PostCardProps {
    post: {
        id: number;
        author: {
            name: string;
            avatar: string;
        };
        content: string;
        image?: string;
        likes: number;
        comments: number;
        timeAgo: string;
    };
}

export default function PostCard({ post }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [localLikes, setLocalLikes] = useState(post.likes);
    const [comment, setComment] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);

    // Function to render text with bold/italic formatting
    const renderFormattedText = (text: string) => {
        // Split by **bold** and *italic* patterns
        const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Bold text
                return (
                    <strong key={index} className="font-bold text-gray-900">
                        {part.slice(2, -2)}
                    </strong>
                );
            } else if (part.startsWith('*') && part.endsWith('*')) {
                // Italic text
                return (
                    <em key={index} className="italic text-gray-700">
                        {part.slice(1, -1)}
                    </em>
                );
            } else {
                // Regular text
                return part;
            }
        });
    };

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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base">{post.author.name}</h3>
                            <p className="text-sm text-gray-500">{post.timeAgo}</p>
                        </div>
                    </div>
                    <button className="text-green-600 border border-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 hover:border-green-700 transition-all duration-200">
                        + Follow
                    </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed text-[15px] line-height-6">
                        {renderFormattedText(post.content)}
                    </p>
                </div>

                {/* Post Image */}
                {post.image && (
                    <div className="mb-4 -mx-2">
                        <img
                            src={post.image}
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
                            <span className="text-sm font-medium">{post.comments} Comment{post.comments !== 1 ? 's' : ''}</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200">
                        <Share className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                    </button>
                </div>

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
