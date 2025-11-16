'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function PrivateAccessPage() {
    const router = useRouter();
    const params = useParams();
    const { privateLogin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const privateKey = params?.key as string;
    const hasAttemptedLogin = useRef(false);

    useEffect(() => {
        const authenticateWithPrivateKey = async () => {
            // Prevent multiple login attempts
            if (hasAttemptedLogin.current) {
                return;
            }

            if (!privateKey) {
                console.error('No private key found in URL params');
                setError('Invalid private access key');
                setLoading(false);
                return;
            }

            hasAttemptedLogin.current = true;

            console.log('privateLogin function available:', !!privateLogin);
            console.log('Private key from params:', privateKey);

            try {
                setLoading(true);
                console.log('Calling privateLogin...');
                const result = await privateLogin(privateKey);

                console.log('privateLogin result:', result);

                if (result.success) {
                    // Redirect to home page after successful login
                    console.log('Login successful, redirecting to /home');
                    router.replace('/home');
                } else {
                    console.error('Login failed with error:', result.error);
                    setError(result.error || 'Failed to authenticate. Invalid or expired access key.');
                }
            } catch (err) {
                console.error('Private access error:', err);
                setError('An error occurred during authentication');
            } finally {
                setLoading(false);
            }
        };

        authenticateWithPrivateKey();
    }, [privateKey]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                    <Image
                        src="/logo/logo_for_dark.png"
                        alt="Bowlers Network Logo"
                        width={60}
                        height={60}
                        className="object-contain"
                    />
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-white">Accessing Platform...</h1>
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                        </div>
                        <p className="text-gray-400">Verifying your access key...</p>
                    </div>
                ) : error ? (
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-white">Access Error</h1>
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                            <p className="text-red-300">{error}</p>
                        </div>
                        <button
                            onClick={() => router.push('/no-access')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-white">Welcome!</h1>
                        <p className="text-gray-300">You are being authenticated...</p>
                    </div>
                )}
            </div>
        </div>
    );
}