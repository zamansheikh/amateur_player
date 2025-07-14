'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play } from 'lucide-react';
import { api } from '@/lib/api';
import UserPostCard from '@/components/UserPostCard';

interface ProPlayer {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    intro_video_url: string;
    xp: number;
    email: string;
    level: number;
    card_theme: string;
    is_pro: boolean;
    follower_count: number;
    sponsors?: {
        brand_id: number;
        brandType: string;
        name: string;
        formal_name: string;
        logo_url: string;
    }[];
    stats?: {
        id: number;
        user_id: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
    } | null;
    engagement?: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
    };
    is_followed: boolean;
    favorite_brands?: {
        brand_id: number;
        brandType: string;
        name: string;
        formal_name: string;
        logo_url: string;
    }[];
}

interface FeedPost {
    metadata: {
        id: number;
        uid: string;
        post_privacy: string;
        total_likes: number;
        total_comments: number;
        created_at: string;
        updated_at: string;
        created: string;
        last_update: string;
        has_text: boolean;
        has_image: boolean;
        has_video: boolean;
        has_poll: boolean;
        has_event: boolean;
    };
    author: {
        user_id: number;
        name: string;
        profile_pic_url: string;
        is_following: boolean;
        viewer_is_author: boolean;
    };
    likes: [{
        total: number;
        likers: Array<{
            user_id: number;
            name: string;
            profile_pic_url: string;
        }>;
    }];
    comments: [{
        total: number;
        comment_list: Array<{
            comment_id: number;
            user: {
                user_id: number;
                name: string;
                profile_pic_url: string;
            };
            text: string;
            pics: any[];
            replies: any[];
        }>;
    }];
    caption: string;
    images: any[];
    videos: any[];
    poll: any;
    event: any;
    tags: string[];
}

export default function PlayerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const playerId = params.id as string;
    
    const [player, setPlayer] = useState<ProPlayer | null>(null);
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await api.get(`/api/user/${playerId}/profile`);
            console.log("Profile response:", response.data);
            setPlayer(response.data);
            setIsFollowing(response.data?.is_followed || false);
            setFollowerCount(response.data?.follower_count || 0);
        } catch (err) {
            console.error('Error fetching player:', err);
            setError('Failed to load player profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user posts
    const fetchPosts = async () => {
        try {
            setPostsLoading(true);

            const response = await api.get(`/api/user/${playerId}/posts`);
            setPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        if (playerId) {
            fetchProfile();
            fetchPosts();
        }
    }, [playerId]);

    const handleFollow = async () => {
        if (!player) return;
        
        try {
            const response = await api.post('/api/user/follow', {
                user_id: player.user_id
            });

            // Check if the API call was successful (status code 200)
            if (response.status === 200) {
                setIsFollowing(!isFollowing);
                setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    // Get in touch (message user)
    const handleGetInTouch = () => {
        // Navigate to messages or open chat
        console.log("Get in touch with user:", playerId);
    };

    const getCardStyle = () => {
        if (!player) return {};
        
        if (player.card_theme && player.card_theme.startsWith('#')) {
            return {
                background: `linear-gradient(135deg, ${player.card_theme}, ${player.card_theme}dd)`
            };
        } else if (player.card_theme === 'orange') {
            return {
                background: 'linear-gradient(135deg, #ea580c, #dc2626)'
            };
        } else {
            return {
                background: 'linear-gradient(135deg, #16a34a, #15803d)'
            };
        }
    };

    const getInitials = (name: string) => {
        if (!name) return player?.username?.slice(0, 2).toUpperCase() || 'P';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading player profile...</p>
                </div>
            </div>
        );
    }

    if (error || !player) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Player not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-6">
                {/* Header with back button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                </div>

                 {/* Profile Header */}
              <div className="relative">
                {/* Cover Video */}
                <div className="h-64 relative overflow-hidden">
                  {player?.intro_video_url ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={player?.intro_video_url} type="video/mp4" />
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                    </video>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-4 pt-8">
                  <div className="flex items-end gap-4 -mt-16">
                    {/* Profile Picture */}
                    <div className="relative">
                      <img
                        src={player?.profile_picture_url || "/playercard1.png"}
                        alt={player?.name}
                        className="w-32 h-32 rounded-2xl border-4 border-white object-cover"
                      />
                    </div>

                    <div className="flex-1 mt-16">
                      {/* Name, Level, XP, EXP Row */}
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                              {player?.name}
                            </h1>
                            {player?.is_pro && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">
                            {player?.is_pro ? "Pro Player" : "Amateur Player"}
                          </p>
                        </div>

                        {/* Level, EXP Icons */}
                        <div className="flex items-center gap-6 ml-auto">
                          {/* Level */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12">
                              <img
                                src="/icons/level.svg"
                                alt="Level"
                                className="w-full h-full"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {player?.level || 8}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs mt-1">
                              Level
                            </span>
                          </div>

                          {/* XP - Hidden for now */}
                          {/* <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12">
                              <img
                                src="/icons/xp.svg"
                                alt="XP"
                                className="w-full h-full"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {player?.xp || 8}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs mt-1">
                              XP
                            </span>
                          </div> */}

                          {/* EXP */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12">
                              <img
                                src="/icons/exp.svg"
                                alt="EXP"
                                className="w-full h-full"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {player?.stats?.experience || 8}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs mt-1">
                              EXP
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons and Stats Row */}
                      <div className="flex items-center justify-between">
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleFollow}
                            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                              isFollowing
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                          <button
                            onClick={handleGetInTouch}
                            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Get in Touch
                          </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {player?.follower_count?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-gray-600">
                              Followers
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {player?.stats?.high_game?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-gray-600">
                              High Game
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {player?.stats?.high_series?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-gray-600">High Series</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Section Header */}
              <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">Posts</h3>
                </div>
              </div>

              {/* Posts Content */}
              <div className="flex-1 bg-gray-50">
                <div className="flex gap-6 px-6 py-6">
                  {/* Posts Column */}
                  <div className="flex-1 max-w-2xl">
                    {postsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading posts...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-2">No posts yet</p>
                        <p className="text-gray-400">
                          Share your first bowling experience!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {posts.map((post) => (
                          <UserPostCard
                            key={post.metadata.id}
                            post={post}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="w-80 space-y-4">
                    {/* Engagement Section */} 
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Likes:</span>
                          <span className="font-medium">{player?.engagement?.likes ?? "0"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Comments:</span>
                          <span className="font-medium">{player?.engagement?.comments?? "0"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shares:</span>
                          <span className="font-medium">{player?.engagement?.shares ?? "0"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Views:</span>
                          <span className="font-medium">{player?.engagement?.views ?? "0"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sponsors Section */}
                    {player?.sponsors && player.sponsors.length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sponsors</h3>
                        <div className="space-y-3">
                          {player.sponsors.map((sponsor) => (
                            <div key={sponsor.brand_id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <Image
                                src={sponsor.logo_url}
                                alt={sponsor.formal_name}
                                width={40}
                                height={40}
                                className="object-contain rounded-md"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">{sponsor.formal_name}</div>
                                <div className="text-xs text-gray-500">{sponsor.brandType}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Favorite Brands Section */}
                    {player?.favorite_brands && player.favorite_brands.length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Favorite Brands</h3>
                        <div className="space-y-3">
                          {/* Group brands by type */}
                          {['Balls', 'Shoes', 'Accessories', 'Apparels', 'Business'].map((brandType) => {
                            const brandsOfType = player.favorite_brands?.filter(brand => brand.brandType === brandType) || [];
                            if (brandsOfType.length === 0) return null;
                            
                            return (
                              <div key={brandType}>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">{brandType}</h4>
                                <div className="space-y-2">
                                  {brandsOfType.map((brand) => (
                                    <div key={brand.brand_id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                      <Image
                                        src={brand.logo_url}
                                        alt={brand.formal_name}
                                        width={32}
                                        height={32}
                                        className="object-contain rounded-md"
                                      />
                                      <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
}
