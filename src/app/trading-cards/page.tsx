'use client';

import Link from 'next/link';
import { Zap, AlertCircle, Calendar, CheckCircle } from 'lucide-react';

export default function TradingCardsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                <Zap className="w-6 h-6 text-amber-600" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Trading Cards
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Collect, trade, and showcase your unique bowling player cards with the community.
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
                        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400"></div>

                        <div className="p-12 text-center">
                            {/* Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-12 h-12 text-purple-600" />
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

                            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg mb-8 text-left">
                                <p className="text-lg text-gray-700 mb-3">
                                    Get ready to collect and trade!
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Trading Cards will launch soon! Collect unique bowling player cards, trade with other players, and build your ultimate collection. Each card will feature exclusive stats, achievements, and special variants.
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Coming:</h3>
                                <div className="space-y-4 text-left">
                                    {/* Feature 1 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Collectible Player Cards</p>
                                            <p className="text-sm text-gray-500">Beautifully designed cards featuring bowlers from the community</p>
                                        </div>
                                    </div>

                                    {/* Feature 2 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Trading System</p>
                                            <p className="text-sm text-gray-500">Trade cards with other players to complete your collection</p>
                                        </div>
                                    </div>

                                    {/* Feature 3 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                                            ⏳
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Coming within a few weeks</p>
                                            <p className="text-sm text-gray-500">Launch with full card collection, rarity levels, and trading features</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* How You Can Help */}
                            <div className="bg-amber-50 rounded-lg p-6 mb-8 border border-amber-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Get Ready:</h3>
                                <p className="text-gray-700 mb-4">
                                    Complete your profile and build your bowling stats. Your achievements will be featured on your trading cards!
                                </p>
                                <Link
                                    href="/profile"
                                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    View Your Profile
                                </Link>
                            </div>

                           

                           

                            {/* Footer Note */}
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>Check back in a few weeks for trading cards</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed -bottom-20 -right-20 w-64 h-64 bg-amber-100 rounded-full opacity-20 pointer-events-none"></div>
            <div className="fixed -top-20 -left-20 w-64 h-64 bg-purple-100 rounded-full opacity-20 pointer-events-none"></div>
        </div>
    );
}
