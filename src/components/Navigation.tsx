'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BarChart3, MessageCircle, Settings, Bell, Menu, X, LogOut, Rss } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const navigation = [
    { name: 'Pro Players', href: '/', icon: Home },
    { name: 'Feed', href: '/feed', icon: Rss },
    { name: 'Overview', href: '/overview', icon: BarChart3 },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'My Teams', href: '/teams', icon: Settings },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Tournaments', href: '/tournaments', icon: Settings },
];

export default function Navigation({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, signout } = useAuth();

    // Public routes
    const publicRoutes = ['/signin', '/signup', '/landingpage', '/landing'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (isPublicRoute) {
        return <>{children}</>;
    }

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
                {/* Mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                        <div className="relative flex flex-col w-64 h-full bg-gray-900 shadow-xl">
                            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/logo/logo.png"
                                        alt="Bowlers Network Logo"
                                        width={32}
                                        height={32}
                                        className="rounded"
                                    />
                                    <span className="text-xl font-bold">
                                        <span className="text-white">Bowlers </span>
                                        <span className="text-green-400">Network</span>
                                    </span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-gray-300">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-6 space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                                ? 'bg-green-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Desktop sidebar */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <div className="flex flex-col w-64">
                        <div className="flex flex-col flex-grow border-r border-gray-800" style={{ backgroundColor: '#111B05' }}>
                            {/* Logo */}
                            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
                                <Image
                                    src="/logo/logo.png"
                                    alt="Bowlers Network Logo"
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                                <span className="text-xl font-bold text-white">Bowlersnetwork</span>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 py-6 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                                ? 'text-white' : 'text-green-100 hover:text-white'
                                                }`}
                                            style={isActive ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = '';
                                                }
                                            }}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* User Profile */}
                            <div className="px-4 py-4 border-t border-gray-800">
                                <Link
                                    href="/profile"
                                    className="block transition-colors"
                                >
                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                                        {user?.profile_picture_url ? (
                                            <Image
                                                src={user.profile_picture_url}
                                                alt={user?.name || "Profile"}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                                <span className="font-medium text-sm" style={{ color: '#111B05' }}>
                                                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{user?.name}</p>
                                            <span className="text-xs text-gray-400 hover:text-white">
                                                View Profile
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Logout Button */}
                            <div className="px-4 pb-4">
                                <button
                                    onClick={signout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-red-600 hover:text-white w-full text-sm font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
                    {/* Mobile header */}
                    <div className="lg:hidden border-b border-gray-800 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#111B05' }}>
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-300 hover:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="text-lg font-bold text-white">Bowlersnetwork</span>
                        <button
                            onClick={signout}
                            className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
