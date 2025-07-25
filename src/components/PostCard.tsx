'use client';

import { Heart, MessageSquare, Share } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

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

    const handlePostClick = () => {
        router.push(`/post/${post.id}`);
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

                {/* Post Content - Clickable */}
                <div className="mb-4 cursor-pointer" onClick={handlePostClick}>
                    <p className="text-gray-800 leading-relaxed text-[15px] line-height-6">
                        {renderFormattedText(post.content)}
                    </p>
                </div>

                {/* Post Image - Clickable */}
                {post.image && (
                    <div className="mb-4 -mx-2 cursor-pointer" onClick={handlePostClick}>
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
                <div className="flex items-center justify-between">
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
                            onClick={handlePostClick}
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
            </div>
        </div>
    );
}
