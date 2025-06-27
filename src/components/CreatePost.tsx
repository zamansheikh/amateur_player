'use client';

import { ImageIcon, Video, Link2, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePost() {
    const { user } = useAuth();
    const [postText, setPostText] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (postText.trim()) {
            // Handle post submission here
            console.log('Post submitted:', postText);
            setPostText('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
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
                            placeholder={`What's on your mind, ${user?.first_name || user?.name?.split(' ')[0] || 'Bob'}?`}
                            className="w-full min-h-[80px] p-4 text-gray-800 placeholder-gray-500 border-0 resize-none focus:outline-none text-lg"
                            rows={3}
                        />
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
                        disabled={!postText.trim()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-full transition-colors"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
