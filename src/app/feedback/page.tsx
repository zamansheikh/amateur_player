'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Bug, Lightbulb, Send, CheckCircle } from 'lucide-react';

export default function FeedbackPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'bug' as 'bug' | 'suggestion'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeChange = (type: 'bug' | 'suggestion') => {
        setFormData(prev => ({
            ...prev,
            type
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.description.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            // You can replace this with your actual API endpoint
            const response = await api.post('/api/feedback', {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                user_id: user?.user_id,
                user_name: user?.name,
                user_email: user?.email
            });

            if (response.status === 200 || response.status === 201) {
                setIsSubmitted(true);
                setFormData({
                    title: '',
                    description: '',
                    type: 'bug'
                });
                
                // Reset success message after 5 seconds
                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
                    <p className="text-gray-600">
                        Help us improve Bowlers Network by reporting bugs or sharing suggestions
                    </p>
                </div>

                {/* Success Message */}
                {isSubmitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">
                            Thank you for your feedback! We appreciate your contribution to improving our platform.
                        </p>
                    </div>
                )}

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Feedback Type
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('bug')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        formData.type === 'bug'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Bug className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="font-medium">Report a Bug</div>
                                            <div className="text-sm opacity-75">
                                                Something isn't working as expected
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('suggestion')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        formData.type === 'suggestion'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="font-medium">Share a Suggestion</div>
                                            <div className="text-sm opacity-75">
                                                Ideas for new features or improvements
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder={formData.type === 'bug' ? 'Brief description of the bug' : 'Brief description of your suggestion'}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                                placeholder={
                                    formData.type === 'bug'
                                        ? 'Please describe the bug in detail, including steps to reproduce it, expected behavior, and actual behavior.'
                                        : 'Please describe your suggestion in detail, including why it would be beneficial and how it might work.'
                                }
                            />
                        </div>

                        {/* User Info Display */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Name: {user?.name || 'Not provided'}</div>
                                <div>Email: {user?.email || 'Not provided'}</div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                        💡 Tips for Better Feedback
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Be specific and detailed in your descriptions</li>
                        <li>• For bugs: include steps to reproduce the issue</li>
                        <li>• For suggestions: explain the benefit and use case</li>
                        <li>• Check if your issue hasn't been reported before</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
