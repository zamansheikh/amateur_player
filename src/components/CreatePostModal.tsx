'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Globe, ChevronDown, BarChart3, Image, Smile, Upload, Trash2, Plus, Video, CheckCircle } from 'lucide-react';
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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [postingStep, setPostingStep] = useState('');
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

    // Helper function to check if a file is a video
    const isVideo = (file: File): boolean => {
        return file.type.startsWith('video/');
    };

    // Helper function to create preview URL for files
    const getPreviewUrl = (file: File): string => {
        return URL.createObjectURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Allow posting if there's either text content or media files
        if ((!postText.trim() && selectedFiles.length === 0) || isPosting) return;

        try {
            setIsPosting(true);
            setUploadProgress(0);
            setPostingStep('Preparing your post...');
            
            // Simulate initial progress
            setUploadProgress(10);
            
            // Create FormData
            const formData = new FormData();
            
            // Add caption (can be empty if there are media files)
            formData.append('caption', postText.trim() || '');
            
            // Add all tags (from hashtags and manual tags)
            const allTags = getAllTags();
            allTags.forEach(tag => {
                formData.append('tags', tag);
            });
            
            setPostingStep('Uploading media files...');
            setUploadProgress(30);
            
            // Add media files
            selectedFiles.forEach(file => {
                formData.append('media', file);
            });

            setUploadProgress(60);
            setPostingStep('Creating your post...');

            // Send FormData with progress tracking
            await api.post('/api/user/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 40) / progressEvent.total) + 60;
                        setUploadProgress(Math.min(progress, 95));
                    }
                }
            });
            
            setUploadProgress(100);
            setPostingStep('Post created successfully!');
            
            // Reset form
            setPostText('');
            setSelectedFiles([]);
            setManualTags([]);
            setCurrentTag('');
            setShowSuccess(true);
            
            if (onPostCreated) {
                onPostCreated();
            }
            
            // Close modal after successful post with a short delay to show success
            setTimeout(() => {
                handleClose();
            }, 1500);
            
        } catch (error) {
            console.error('Error creating post:', error);
            setPostingStep('Failed to create post. Please try again.');
            setUploadProgress(0);
            
            // Reset posting state after showing error
            setTimeout(() => {
                setIsPosting(false);
                setPostingStep('');
            }, 2000);
        }
    };

    const handleClose = () => {
        if (isPosting) return; // Prevent closing while posting
        setPostText('');
        setSelectedFiles([]);
        setManualTags([]);
        setCurrentTag('');
        setShowSuccess(false);
        setUploadProgress(0);
        setPostingStep('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
                className={`bg-white rounded-[20px] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                    selectedFiles.length > 0 
                        ? 'w-full max-w-2xl max-h-[85vh]' 
                        : 'w-[488px] max-h-[762px]'
                }`}
            >
                {/* Modal Header */}
                <div className="h-[56px] flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isPosting ? 'Creating Post...' : 'Create Post'}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isPosting}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isPosting 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mx-4 mt-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2 flex-shrink-0">
                        <CheckCircle className="w-4 h-4" />
                        Post created successfully!
                    </div>
                )}

                {/* Progress Indicator */}
                {isPosting && (
                    <div className="mx-4 mt-4 flex-shrink-0">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium text-blue-900">{postingStep}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-blue-700 mt-1">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Content */}
                <div className="flex-1 p-4 flex flex-col overflow-hidden min-h-0">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4 flex-shrink-0">
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
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
                        <div className="flex-shrink-0 mb-4" style={{ minHeight: '80px' }}>
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder={selectedFiles.length > 0 
                                    ? "Write a caption... (optional)" 
                                    : "What's on your mind? Share your thoughts with the bowling community! 🎳"
                                }
                                className={`w-full h-20 p-3 text-gray-800 placeholder-gray-400 border-0 resize-none focus:outline-none text-base ${
                                    isPosting ? 'bg-gray-50 cursor-not-allowed' : ''
                                }`}
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
                        <div className="mb-3 flex-shrink-0">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={addTag}
                                placeholder="Add tags (press Enter to add)"
                                disabled={isPosting}
                                className={`w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm ${
                                    isPosting ? 'bg-gray-50 cursor-not-allowed' : ''
                                }`}
                            />
                        </div>

                        {/* Selected Files Preview */}
                        {selectedFiles.length > 0 && (
                            <div className="mb-4 flex-shrink-0">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">
                                    Selected Media ({selectedFiles.length})
                                </h5>
                                <div className={`grid gap-2 ${
                                    selectedFiles.length === 1 ? 'grid-cols-1' :
                                    selectedFiles.length === 2 ? 'grid-cols-2' :
                                    selectedFiles.length === 3 ? 'grid-cols-3' :
                                    'grid-cols-4'
                                } max-h-32 overflow-y-auto p-1`}>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative group" style={{ aspectRatio: '1/1', height: '120px' }}>
                                            {isVideo(file) ? (
                                                <div className="relative w-full h-full">
                                                    <video
                                                        src={getPreviewUrl(file)}
                                                        className="w-full h-full object-cover rounded-lg border-2 border-green-200"
                                                        muted
                                                        preload="metadata"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                                                        <div className="bg-white bg-opacity-90 rounded-full p-1">
                                                            <Video className="w-3 h-3 text-gray-800" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={getPreviewUrl(file)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-lg border-2 border-green-200"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-10"
                                            >
                                                <X className="w-3 h-3" />
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
                        <div className={`border-t border-gray-100 pt-3 mb-3 flex-shrink-0 ${isPosting ? 'opacity-50' : ''}`}>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Add your Post</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    disabled={isPosting}
                                    className={`flex items-center gap-2 p-2 border border-gray-200 rounded-lg transition-colors ${
                                        isPosting ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs text-gray-700">Create Poll</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={isPosting}
                                    className={`flex items-center gap-2 p-2 border border-gray-200 rounded-lg transition-colors ${
                                        isPosting ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                        <div className="w-4 h-4 bg-green-600 rounded flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-sm"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-700">Create Event</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => !isPosting && fileInputRef.current?.click()}
                                    disabled={isPosting}
                                    className={`flex items-center gap-2 p-2 border border-gray-200 rounded-lg transition-colors ${
                                        isPosting ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Image className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-xs text-gray-700">Photo/ Video</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={isPosting}
                                    className={`flex items-center gap-2 p-2 border border-gray-200 rounded-lg transition-colors ${
                                        isPosting ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <span className="text-yellow-600 font-bold text-xs">GIF</span>
                                    </div>
                                    <span className="text-xs text-gray-700">Gif</span>
                                </button>
                            </div>
                        </div>

                        {/* Post Button */}
                        <button
                            type="submit"
                            disabled={(!postText.trim() && selectedFiles.length === 0) || isPosting}
                            className={`w-full h-10 font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0 ${
                                isPosting
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : (!postText.trim() && selectedFiles.length === 0)
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            style={!isPosting && (postText.trim() || selectedFiles.length > 0) ? { backgroundColor: '#8BC342' } : {}}
                        >
                            {isPosting && (
                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {isPosting ? 'Creating Post...' : 'Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
