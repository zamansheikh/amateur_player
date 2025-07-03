'use client';

import { useState } from 'react';
import { X, Globe, ChevronDown, BarChart3, Image, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const { user } = useAuth();
    const [postText, setPostText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function to extract hashtags from text
    const extractHashtags = (text: string): string[] => {
        const hashtagRegex = /#(\w+)/g;
        const matches = text.match(hashtagRegex);
        if (!matches) return [];
        
        const tags = matches.map(tag => tag.substring(1));
        return [...new Set(tags)];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postText.trim() || isPosting) return;

        try {
            setIsPosting(true);
            
            const tags = extractHashtags(postText);
            const payload = {
                caption: postText.trim(),
                tags: tags
            };

            await api.post('/api/user/posts', payload);
            
            setPostText('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            if (onPostCreated) {
                onPostCreated();
            }
            
            // Close modal after successful post
            setTimeout(() => {
                onClose();
            }, 1000);
            
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleClose = () => {
        setPostText('');
        setShowSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mx-4 mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
                        ✓ Post created successfully!
                    </div>
                )}

                {/* Modal Content */}
                <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={user?.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900">{user?.name || 'Johan Smith'}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Globe className="w-4 h-4" />
                                <span>Public</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder="Hello, friends! 🎳 With the sun shining bright and temperatures rising, there's no better way to beat the heat than with a refreshing dip in the pool! 🏊‍♂️ ☀️ Dive into Hello, friends! 🎳 With the sun shining bright and..."
                                className="w-full min-h-[120px] p-3 text-gray-800 placeholder-gray-400 border-0 resize-none focus:outline-none text-base"
                                rows={6}
                                disabled={isPosting}
                            />
                        </div>

                        {/* Show extracted hashtags preview */}
                        {postText && extractHashtags(postText).length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-500">Tags:</span>
                                    {extractHashtags(postText).map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add your Post Section */}
                        <div className="border-t border-gray-100 pt-4 mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Add your Post</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-700">Create Poll</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-700">Create Event</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Image className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="text-sm text-gray-700">Photo/ Video</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-yellow-600 font-bold text-sm">GIF</span>
                                    </div>
                                    <span className="text-sm text-gray-700">Gif</span>
                                </button>
                            </div>
                        </div>

                        {/* Post Button */}
                        <button
                            type="submit"
                            disabled={!postText.trim() || isPosting}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {isPosting ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
