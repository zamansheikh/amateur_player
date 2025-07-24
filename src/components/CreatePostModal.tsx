'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Globe, ChevronDown, BarChart3, Image, Smile, Upload, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
    initialFiles?: File[];
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated, initialFiles = [] }: CreatePostModalProps) {
    const { user } = useAuth();
    const [postText, setPostText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>(initialFiles);
    const [manualTags, setManualTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update selected files when initial files change
    useEffect(() => {
        setSelectedFiles(initialFiles || []);
    }, [initialFiles]);

    // Function to extract hashtags from text
    const extractHashtags = (text: string): string[] => {
        const hashtagRegex = /#(\w+)/g;
        const matches = text.match(hashtagRegex);
        if (!matches) return [];
        
        const tags = matches.map(tag => tag.substring(1));
        return [...new Set(tags)];
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    // Remove selected file
    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Add manual tag
    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            const tag = currentTag.trim().replace('#', '');
            if (!manualTags.includes(tag)) {
                setManualTags(prev => [...prev, tag]);
            }
            setCurrentTag('');
        }
    };

    // Remove manual tag
    const removeTag = (tagToRemove: string) => {
        setManualTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    // Get all tags (hashtags from text + manual tags)
    const getAllTags = (): string[] => {
        const hashtagsFromText = extractHashtags(postText);
        const allTags = [...hashtagsFromText, ...manualTags];
        return [...new Set(allTags)]; // Remove duplicates
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postText.trim() || isPosting) return;

        try {
            setIsPosting(true);
            
            // Create FormData
            const formData = new FormData();
            
            // Add caption
            formData.append('caption', postText.trim());
            
            // Add all tags (from hashtags and manual tags)
            const allTags = getAllTags();
            allTags.forEach(tag => {
                formData.append('tags', tag);
            });
            
            // Add media files
            selectedFiles.forEach(file => {
                formData.append('media', file);
            });

            // Send FormData instead of JSON
            await api.post('/api/user/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            // Reset form
            setPostText('');
            setSelectedFiles([]);
            setManualTags([]);
            setCurrentTag('');
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
        setSelectedFiles([]);
        setManualTags([]);
        setCurrentTag('');
        setShowSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[488px] h-[662px] rounded-[20px] shadow-2xl overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="h-[56px] flex items-center justify-between px-4 border-b border-gray-200">
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
                <div className="flex-1 p-4 flex flex-col">
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
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                        <div className="flex-1 mb-4">
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder="Hello, friends! 🎳 With the sun shining bright and temperatures rising, there's no better way to beat the heat than with a refreshing dip in the pool! 🏊‍♂️ ☀️ Dive into Hello, friends! 🎳 With the sun shining bright and..."
                                className="w-full h-full p-3 text-gray-800 placeholder-gray-400 border-0 resize-none focus:outline-none text-base"
                                disabled={isPosting}
                            />
                        </div>

                        {/* Show extracted hashtags and manual tags preview */}
                        {getAllTags().length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-500">Tags:</span>
                                    {getAllTags().map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"
                                        >
                                            #{tag}
                                            {manualTags.includes(tag) && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 text-green-600 hover:text-green-800"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Manual Tag Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={addTag}
                                placeholder="Add tags (press Enter to add)"
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                        </div>

                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Selected Media ({selectedFiles.length})</h5>
                                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-700 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                        />

                        {/* Add your Post Section */}
                        <div className="border-t border-gray-100 pt-4 mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Add your Post</h4>
                            <div className="grid grid-cols-2 gap-2">
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
                                    onClick={() => fileInputRef.current?.click()}
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
                            className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors"
                            style={{ backgroundColor: '#8BC342' }}
                        >
                            {isPosting ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
