'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to feed page (which is now the home page)
        router.replace('/feed');
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-xl text-green-600">Redirecting...</div>
        </div>
    );
}
