'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Image
                        src="/logo/logo.png"
                        alt="Bowlers Network Logo"
                        width={64}
                        height={64}
                        className="rounded-lg"
                    />
                    <h1 className="text-4xl font-bold text-gray-900">Bowlers Network</h1>
                </div>

                {/* Hello World Message */}
                <div className="mb-12">
                    <h2 className="text-6xl font-bold text-green-600 mb-4">Hello World!</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Welcome to Bowlers Network - Where amateurs meet the pros
                    </p>
                    <p className="text-gray-500">
                        This is a simple landing page. Please sign in to access the full platform.
                    </p>
                </div>

                {/* Authentication Buttons */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signin"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        New to bowling? Join our community and learn from the pros!
                    </p>
                </div>

                {/* Features Preview */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-2xl">🎳</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Connect with Pros</h3>
                        <p className="text-gray-600 text-sm">Follow professional bowlers and learn from their experience</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 text-2xl">📊</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                        <p className="text-gray-600 text-sm">Monitor your bowling statistics and improvements</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-purple-600 text-2xl">💬</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Share & Learn</h3>
                        <p className="text-gray-600 text-sm">Post about your games and get tips from the community</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
