'use client';

import { ImageIcon, Video, Link2, Globe, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostModal from './CreatePostModal';

interface CreatePostProps {
    onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreatePostClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFiles([]); // Clear files when modal is closed
    };

    const handlePhotoVideoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFiles(Array.from(files));
            // Open modal when files are selected
            setShowModal(true);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                {/* Action Buttons Row */}
                <div className="flex items-center gap-6 mb-6">
                    <button 
                        onClick={handleCreatePostClick}
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                                <div className="w-3 h-2 bg-white rounded-sm"></div>
                            </div>
                        </div>
                        <span className="font-medium">Create Post</span>
                    </button>

                    <button 
                        onClick={handlePhotoVideoClick}
                        className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition-colors"
                    >
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
                <div className="flex items-start gap-4 mb-4">
                    <img
                        src={user?.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div
                            onClick={handleCreatePostClick}
                            className="w-full min-h-[80px] p-4 text-gray-500 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center text-lg"
                        >
                            What's on your mind, {user?.first_name || user?.name?.split(' ')[0] || 'Bob'}?
                        </div>
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
                        onClick={handleCreatePostClick}
                        className="bg-gray-300 text-gray-500 font-semibold px-8 py-2.5 rounded-full cursor-pointer hover:bg-gray-400 transition-colors"
                    >
                        Post
                    </button>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*,video/*"
                className="hidden"
            />

            {/* Modal */}
            <CreatePostModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onPostCreated={onPostCreated}
                initialFiles={selectedFiles}
            />
        </>
    );
}
