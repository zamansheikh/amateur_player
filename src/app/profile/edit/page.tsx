'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { api, userApi } from '@/lib/api';

export default function EditProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverFileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        name: '',
        profile_picture_url: '',
        cover_photo_url: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                username: user.username || '',
                name: user.name || '',
                profile_picture_url: user.profile_picture_url || '',
                cover_photo_url: user.cover_photo_url || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        setIsUploadingCover(true);
        setError(null);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await api.post('/api/user/profile/upload-cover-photo', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.image_public_url) {
                setFormData(prev => ({
                    ...prev,
                    cover_photo_url: response.data.image_public_url
                }));
                setSuccess('Cover photo updated successfully!');
                
                // Refresh user data in AuthContext
                await refreshUser();
            }
        } catch (error: any) {
            console.error('Error uploading cover photo:', error);
            setError('Failed to upload cover photo. Please try again.');
        } finally {
            setIsUploadingCover(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        setIsUploadingImage(true);
        setError(null);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await api.post('/api/user/profile/upload-profile-picture', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.image_public_url) {
                setFormData(prev => ({
                    ...prev,
                    profile_picture_url: response.data.image_public_url
                }));
                setSuccess('Profile picture updated successfully!');
                
                // Refresh user data in AuthContext
                await refreshUser();
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.put('/api/user/profile', formData);
            
            if (response.status === 200) {
                setSuccess('Profile updated successfully!');
                
                // Refresh user data in AuthContext
                await refreshUser();
                
                // Small delay to ensure UI updates, then redirect
                setTimeout(() => {
                    router.push('/profile');
                }, 2000);
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-2xl mx-auto px-6 py-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Profile
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture Section */}
                        <div className="text-center">
                            <div className="relative inline-block">
                                <img
                                    src={formData.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer"}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="absolute bottom-2 right-2 w-8 h-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                    {isUploadingImage ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Camera className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
                        </div>

                        {/* Cover Photo Section */}
                        <div className="text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Cover Photo</label>
                            <div className="relative">
                                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-4">
                                    {formData.cover_photo_url ? (
                                        <img
                                            src={formData.cover_photo_url}
                                            alt="Cover"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-sm">No cover photo</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => coverFileInputRef.current?.click()}
                                    disabled={isUploadingCover}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                                >
                                    {isUploadingCover ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            {formData.cover_photo_url ? 'Change Cover Photo' : 'Upload Cover Photo'}
                                        </>
                                    )}
                                </button>
                            </div>
                            <input
                                ref={coverFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                            <p className="text-sm text-gray-500 mt-2">Recommended size: 1200x300 pixels</p>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="space-y-3">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
