'use client';

import { Heart, MessageCircle, Share, Eye } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlayerPost {
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
    };
    likes: [
        {
            total: number;
            likers: Array<{
                user_id: number;
                name: string;
                profile_pic_url: string;
            }>;
        }
    ];
    comments: [
        {
            total: number;
            users: Array<{
                user_id: number;
                name: string;
                profile_pic_url: string;
                comment: string;
            }>;
        }
    ];
    text?: {
        content: string;
    };
    image?: {
        url: string;
        caption: string;
    };
    video?: {
        url: string;
        caption: string;
    };
}

interface PlayerPostCardProps {
    post: PlayerPost;
}

export default function PlayerPostCard({ post }: PlayerPostCardProps) {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleUserClick = () => {
        router.push(`/player/${post.author.user_id}`);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleUserClick}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                        {post.author.profile_pic_url ? (
                            <img
                                src={post.author.profile_pic_url}
                                alt={post.author.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-medium">
                                {getInitials(post.author.name)}
                            </div>
                        )}
                    </button>
                    <div className="flex-1">
                        <button
                            onClick={handleUserClick}
                            className="text-left hover:underline"
                        >
                            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                        </button>
                        <p className="text-sm text-gray-500">
                            {formatDate(post.metadata.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
                {/* Text Content */}
                {post.text && (
                    <p className="text-gray-800 mb-4 leading-relaxed">
                        {post.text.content}
                    </p>
                )}

                {/* Image Content */}
                {post.image && (
                    <div className="mb-4">
                        <img
                            src={post.image.url}
                            alt={post.image.caption || 'Post image'}
                            className="w-full rounded-lg object-cover max-h-96"
                        />
                        {post.image.caption && (
                            <p className="text-gray-600 text-sm mt-2">
                                {post.image.caption}
                            </p>
                        )}
                    </div>
                )}

                {/* Video Content */}
                {post.video && (
                    <div className="mb-4">
                        <video
                            controls
                            className="w-full rounded-lg max-h-96"
                            poster={post.video.url + '?t=1'}
                        >
                            <source src={post.video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        {post.video.caption && (
                            <p className="text-gray-600 text-sm mt-2">
                                {post.video.caption}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Post Stats */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.metadata.total_likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.metadata.total_comments}</span>
                        </div>
                    </div>
                    <div className="text-xs">
                        {post.metadata.post_privacy === 'public' ? 'Public' : 'Private'}
                    </div>
                </div>
            </div>
        </div>
    );
}
