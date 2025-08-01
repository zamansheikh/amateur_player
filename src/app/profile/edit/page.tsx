'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, Upload, Mail, Check, Clock } from 'lucide-react';
import { api, userApi } from '@/lib/api';

export default function EditProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        name: '',
        profile_picture_url: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Email verification states
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                username: user.username || '',
                name: user.name || '',
                profile_picture_url: user.profile_picture_url || ''
            });
            
            // Check if email is verified from user data
            setIsEmailVerified(user.email_verified || false);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Reset email verification status if email is changed
        if (name === 'email') {
            setIsEmailVerified(false);
            setCodeSent(false);
            setShowVerificationInput(false);
            setVerificationCode('');
        }
    };

    const sendVerificationCode = async () => {
        if (!formData.email) {
            setError('Please enter an email address first');
            return;
        }

        setIsSendingCode(true);
        setError(null);

        try {
            await userApi.sendVerificationCode(formData.email);
            setCodeSent(true);
            setShowVerificationInput(true);
            setSuccess('Verification code sent to your email!');
        } catch (error: any) {
            console.error('Error sending verification code:', error);
            setError(error.response?.data?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setIsSendingCode(false);
        }
    };

    const verifyEmailCode = async () => {
        if (!verificationCode) {
            setError('Please enter the verification code');
            return;
        }

        setIsVerifyingCode(true);
        setError(null);

        try {
            await userApi.verifyEmail(formData.email, verificationCode);
            setIsEmailVerified(true);
            setShowVerificationInput(false);
            setSuccess('Email verified successfully!');
            setCodeSent(false);
            setVerificationCode('');
        } catch (error: any) {
            console.error('Error verifying email:', error);
            setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsVerifyingCode(false);
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
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                                
                                {/* Email Verification Section */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Email Verification</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isEmailVerified ? (
                                                <>
                                                    <Check className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-green-600 font-medium">Verified</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                    <span className="text-sm text-orange-600 font-medium">Unverified</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {!isEmailVerified && (
                                        <div className="space-y-3">
                                            {!showVerificationInput ? (
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Verify your email address to ensure account security and receive important notifications.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={sendVerificationCode}
                                                        disabled={isSendingCode || !formData.email}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        {isSendingCode ? 'Sending...' : 'Send Verification Code'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-gray-600">
                                                        Enter the 6-digit verification code sent to your email:
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={verificationCode}
                                                            onChange={(e) => setVerificationCode(e.target.value)}
                                                            placeholder="Enter 6-digit code"
                                                            maxLength={6}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={verifyEmailCode}
                                                            disabled={isVerifyingCode || verificationCode.length !== 6}
                                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                                                        >
                                                            {isVerifyingCode ? 'Verifying...' : 'Verify'}
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={sendVerificationCode}
                                                        disabled={isSendingCode}
                                                        className="text-sm text-green-600 hover:text-green-700 underline"
                                                    >
                                                        {isSendingCode ? 'Sending...' : 'Resend Code'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isEmailVerified && (
                                        <p className="text-sm text-green-600">
                                            ✓ Your email address has been verified successfully!
                                        </p>
                                    )}
                                </div>
                            </div>
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
                            {!isEmailVerified && formData.email && (
                                <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm">
                                    <p className="font-medium">Email Verification Recommended</p>
                                    <p>We recommend verifying your email address before saving changes to ensure account security.</p>
                                </div>
                            )}
                            
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
