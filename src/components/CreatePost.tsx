'use client';

import { ImageIcon, Video, Link2, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface CreatePostProps {
    onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const { user } = useAuth();
    const [postText, setPostText] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function to extract hashtags from text
    const extractHashtags = (text: string): string[] => {
        const hashtagRegex = /#(\w+)/g;
        const matches = text.match(hashtagRegex);
        if (!matches) return [];
        
        // Remove # symbol and return unique tags
        const tags = matches.map(tag => tag.substring(1));
        return [...new Set(tags)];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postText.trim() || isPosting) return;

        try {
            setIsPosting(true);
            
            // Extract hashtags from the post text
            const tags = extractHashtags(postText);
            
            // Prepare payload
            const payload = {
                caption: postText.trim(),
                tags: tags
            };

            console.log('Sending post payload:', payload); // Debug log
            
            // Send POST request to create new post
            await api.post('/api/user/posts', payload);
            
            // Clear the post text
            setPostText('');
            
            // Show success feedback
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Notify parent component to refresh posts
            if (onPostCreated) {
                onPostCreated();
            }
            
        } catch (error) {
            console.error('Error creating post:', error);
            // Could add toast notification here for errors
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Success Message */}
            {showSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✓ Post created successfully!
                </div>
            )}
            
            {/* Action Buttons Row */}
            <div className="flex items-center gap-6 mb-6">
                <button className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                            <div className="w-3 h-2 bg-white rounded-sm"></div>
                        </div>
                    </div>
                    <span className="font-medium">Create Post</span>
                </button>

                <button className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-medium">Add Photos/Videos</span>
                </button>

                <button className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">Attach Link</span>
                </button>
            </div>

            {/* Main Post Input Area */}
            <form onSubmit={handleSubmit}>
                <div className="flex items-start gap-4 mb-4">
                    <img
                        src={user?.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder={`What's on your mind, ${user?.first_name || user?.name?.split(' ')[0] || 'there'}?`}
                            className="w-full min-h-[80px] p-4 text-gray-800 placeholder-gray-500 border-0 resize-none focus:outline-none text-lg"
                            rows={3}
                            disabled={isPosting}
                        />
                        
                        {/* Show extracted hashtags preview */}
                        {postText && extractHashtags(postText).length > 0 && (
                            <div className="mt-2 px-4">
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
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600 font-medium">Public</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </div>

                    <button
                        type="submit"
                        disabled={!postText.trim() || isPosting}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-full transition-colors"
                    >
                        {isPosting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
