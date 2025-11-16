'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NoAccessPage() {
    const router = useRouter();

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
                        unoptimized
                        className="object-contain"
                    />
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-white">Access Denied</h1>
                    <div className="text-green-400 text-lg font-semibold">🚀 BETA LAUNCHING SOON</div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <p className="text-gray-300 text-lg leading-relaxed">
                        This platform is currently in <span className="text-green-400 font-semibold">beta launch</span> mode.
                    </p>
                    <p className="text-gray-400 text-base">
                        Only selected members with early access can use this platform at this time.
                    </p>
                </div>

                {/* Footer */}
                <div className="pt-4 text-gray-500 text-xs">
                    <p>Bowlers Network • Beta Launch 2025</p>
                </div>
            </div>
        </div>
    );
}
