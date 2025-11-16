'use client';

import Link from 'next/link';
import { Star, AlertCircle, Calendar, CheckCircle } from 'lucide-react';

export default function ProPlayersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Star className="w-6 h-6 text-green-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Professional Bowlers
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with professional bowlers from around the community and learn from the best.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-16">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Coming Soon Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Top accent bar */}
                        <div className="h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-400"></div>

                        <div className="p-12 text-center">
                            {/* Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-lg">⏳</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Message */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Coming Soon! 🚀
                            </h2>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 text-left">
                                <p className="text-lg text-gray-700 mb-3">
                                    We're building something amazing for you!
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Professional player cards and profiles will be available soon. We're currently gathering data to create beautiful, detailed player cards that showcase their achievements, statistics, and more.
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Happening:</h3>
                                <div className="space-y-4 text-left">
                                    {/* Step 1 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Player profiles are being created</p>
                                            <p className="text-sm text-gray-500">Professional players are joining the platform</p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Data is being collected</p>
                                            <p className="text-sm text-gray-500">Gathering stats, achievements, and details</p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                                            ⏳
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Coming within a few days</p>
                                            <p className="text-sm text-gray-500">We'll launch beautiful player cards with complete data</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* How You Can Help */}
                            <div className="bg-green-50 rounded-lg p-6 mb-8 border border-green-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Help Us Prepare:</h3>
                                <p className="text-gray-700 mb-4">
                                    Complete your profile with your bowling statistics and achievements. This helps us create more meaningful connections!
                                </p>
                                <Link
                                    href="/profile"
                                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Complete Your Profile
                                </Link>
                            </div>

                            

                            

                            {/* Footer Note */}
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Check back in a few days for professional player cards</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed -bottom-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-20 pointer-events-none"></div>
            <div className="fixed -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full opacity-20 pointer-events-none"></div>
        </div>
    );
}
