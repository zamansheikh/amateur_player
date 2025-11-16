'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user?.authenticated) {
                // Redirect authenticated users to the home page
                router.replace('/home');
            } else {
                // Redirect non-authenticated users to the no-access page (beta launch)
                router.replace('/no-access');
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-xl text-green-600">Redirecting...</div>
        </div>
    );
}

