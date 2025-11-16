'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, TrendingUp, Hash, Gift, Star, ArrowRight, Calendar, Trophy } from 'lucide-react';
import { api } from '@/lib/api';
import { tournamentApi } from '@/lib/api';
import { Tournament } from '@/types';
import EventCard from './EventCard';
import Link from 'next/link';

interface SuggestedUser {
    user_id: number;
    name: string;
    profile_pic_url: string;
    is_following: boolean;
    role?: string;
}

interface TrendingTopic {
    hashtag: string;
    posts_count: number;
    category: string;
}

export default function FeedSidebar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [followingUsers, setFollowingUsers] = useState<Set<number>>(new Set());
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [tournamentsLoading, setTournamentsLoading] = useState(true);
    const router = useRouter();

    // Mock data - replace with real API calls
    useEffect(() => {
        // Fetch tournaments
        const fetchTournaments = async () => {
            try {
                setTournamentsLoading(true);
                const data = await tournamentApi.getTournaments();
                // Show only upcoming tournaments (next 3 for sidebar)
                const upcomingTournaments = data
                    .filter((t: Tournament) => new Date(t.reg_deadline) > new Date())
                    .sort((a: Tournament, b: Tournament) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                    .slice(0, 3);
                setTournaments(upcomingTournaments);
            } catch (err) {
                console.error('Error fetching tournaments:', err);
            } finally {
                setTournamentsLoading(false);
            }
        };

        fetchTournaments();

        // Mock suggested users
        setSuggestedUsers([
            {
                user_id: 1,
                name: "Jennifer",
                profile_pic_url: "/playercard1.png",
                is_following: false,
                role: "Pro Player"
            },
            {
                user_id: 2,
                name: "Jennifer",
                profile_pic_url: "/playercard2.png",
                is_following: false,
                role: "Pro Player"
            },
            {
                user_id: 3,
                name: "Jennifer",
                profile_pic_url: "/playercard3.png",
                is_following: false,
                role: "Pro Player"
            },
            {
                user_id: 4,
                name: "Jennifer",
                profile_pic_url: "/playercard4.png",
                is_following: false,
                role: "Pro Player"
            },
            {
                user_id: 5,
                name: "Jennifer",
                profile_pic_url: "/playercard1.png",
                is_following: false,
                role: "Pro Player"
            }
        ]);

        // Mock trending topics
        setTrendingTopics([
            {
                hashtag: "#worldnews",
                posts_count: 100,
                category: "Pro Player"
            },
            {
                hashtag: "#worldnews",
                posts_count: 100,
                category: "Pro Player"
            },
            {
                hashtag: "#worldnews",
                posts_count: 100,
                category: "Pro Player"
            }
        ]);
    }, []);

    const handleFollow = async (userId: number) => {
        try {
            // Mock API call - replace with real endpoint
            // await api.post(`/api/users/${userId}/follow`);

            // Update local state
            setFollowingUsers(prev => new Set(prev).add(userId));
            setSuggestedUsers(prev =>
                prev.map(user =>
                    user.user_id === userId
                        ? { ...user, is_following: true }
                        : user
                )
            );
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            console.log('Searching for:', searchQuery);
        }
    };

    const handleUserClick = (userId: number) => {
        router.push(`/player/${userId}`);
    };

    return (
        <div className="w-80 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </form>
            </div>

            {/* Who to Follow Section */}
            {/* <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Who to Follow</h3>
                <div className="space-y-3">
                    {suggestedUsers.slice(0, 5).map((user) => (
                        <div key={user.user_id} className="flex items-center justify-between">
                            <div
                                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors flex-1"
                                onClick={() => handleUserClick(user.user_id)}
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={user.profile_pic_url}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = `
                                                <div class="w-full h-full bg-green-100 flex items-center justify-center">
                                                    <span class="text-green-600 font-medium text-sm">
                                                        ${user.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                            `;
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">{user.role || 'Pro Player'}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollow(user.user_id);
                                }}
                                disabled={followingUsers.has(user.user_id)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${followingUsers.has(user.user_id)
                                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {followingUsers.has(user.user_id) ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    ))}
                </div>
                <button className="w-full text-green-600 hover:text-green-700 text-sm font-medium mt-4">
                    Show more
                </button>
            </div> */}

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                    </div>
                    <Link
                        href="/events"
                        className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {tournamentsLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    </div>
                ) : tournaments.length > 0 ? (
                    <div className="space-y-3">
                        {tournaments.map((tournament) => (
                            <EventCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <Trophy className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No upcoming tournaments</p>
                        <Link
                            href="/tournaments"
                            className="text-green-600 hover:text-green-700 font-medium text-sm mt-1 inline-block"
                        >
                            Browse all →
                        </Link>
                    </div>
                )}
            </div>

            {/* Featured Partners */}
            {/* <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Featured Partners</h3>
                    <button
                        onClick={() => router.push('/perks')}
                        className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">Mario&apos;s Italian Kitchen</p>
                        <p className="text-xs text-green-600 font-medium">25% OFF with BOWLERS25</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">4.8</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">Pro Shop Gear</p>
                        <p className="text-xs text-green-600 font-medium">Buy 2 Get 1 Free on Bowling Tape</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">4.9</span>
                    </div>                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Gift className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">FitZone Gym</p>
                            <p className="text-xs text-blue-600 font-medium">30% OFF First Month</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs">4.6</span>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* What's happening Section */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s happening</h3>
                <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                        <div key={index} className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                            <p className="text-sm text-gray-500">{topic.category}</p>
                            <p className="font-semibold text-gray-900">{topic.hashtag}</p>
                            <p className="text-sm text-gray-500">
                                {topic.posts_count.toLocaleString()} Tweets
                            </p>
                        </div>
                    ))}
                </div>
                <button className="w-full text-green-600 hover:text-green-700 text-sm font-medium mt-4">
                    Show more
                </button>
            </div>

        </div>
    );
}
