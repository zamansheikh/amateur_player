"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import UserPostCard from "@/components/UserPostCard";

interface ProPlayer {
  user_id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  intro_video_url: string;
  cover_photo_url: string;
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
  socials?: {
    pro_player_id: number;
    social_link_id: number;
    social_id: number;
    social: string;
    logo: string;
    url: string;
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
    has_media: boolean;
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
  likes: [
    {
      total: number;
      likers: Array<{
        user_id: number;
        name: string;
        profile_pic_url: string;
      }>;
    }
  ];
  comments: [
    {
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
    }
  ];
  caption: string;
  media: string[];
  poll: any;
  event: any;
  tags: string[];
  is_liked_by_me: boolean;
}

export default function PlayerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth(); // Add auth context
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

      const response = await api.get(`/api/pro/profile/${playerId}`);
      console.log("Profile response:", response.data);
      setPlayer(response.data);
      setIsFollowing(response.data?.is_followed || false);
      setFollowerCount(response.data?.follower_count || 0);
      if (response.data?.user_id) {
        // Fetch posts only after profile is successfully loaded
        await fetchPosts(response.data?.user_id);
      }
    } catch (err: any) {
      console.error("Error fetching player:", err);

      // Handle 401 errors specifically for pro routes (when not authenticated)
      if (err.response?.status === 401) {
        setError("This profile requires authentication to view full details");
      } else {
        setError("Failed to load player profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user posts
  const fetchPosts = async (userId: number | string) => {
    try {
      setPostsLoading(true);

      // Use the playerId instead of hardcoded 55
      const response = await api.get(`/api/user/${userId}/posts`);
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      // setError('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    if (playerId) {
      fetchProfile();
    }
  }, [playerId]);

  const handleFollow = async () => {
    if (!player || !user) {
      // Redirect to login if not authenticated
      router.push("/signin");
      return;
    }

    try {
      const response = await api.post("/api/user/follow", {
        user_id: player.user_id,
      });

      // Check if the API call was successful (status code 200)
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Get in touch (message user)
  const handleGetInTouch = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/signin");
      return;
    }
    // Navigate to messages or open chat
    console.log("Get in touch with user:", playerId);
  };

  const getCardStyle = () => {
    if (!player) return {};

    if (player.card_theme && player.card_theme.startsWith("#")) {
      return {
        background: `linear-gradient(135deg, ${player.card_theme}, ${player.card_theme}dd)`,
      };
    } else if (player.card_theme === "orange") {
      return {
        background: "linear-gradient(135deg, #ea580c, #dc2626)",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #16a34a, #15803d)",
      };
    }
  };

  const getInitials = (name: string) => {
    if (!name) return player?.username?.slice(0, 2).toUpperCase() || "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
          <p className="text-red-600 mb-4">{error || "Player not found"}</p>
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover Video */}
          <div className="h-80 relative overflow-hidden rounded-lg">
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

          {/* Profile Info Section */}
          <div className="px-6 py-6">
            {/* Name and Title Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex col-auto">
                  <div className="w-40 ">
                    {/* Profile Picture Overlay - positioned at bottom left of video */}
                    <div className="relative -top-12">
                      <img
                        src={player?.profile_picture_url || "/playercard1.png"}
                        alt={player?.name}
                        className="w-40 h-40 rounded-2xl border-4 border-white object-cover shadow-xl"
                      />
                    </div>
                  </div>
                  <div className="pl-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {player?.name}
                      </h1>
                      {player?.is_pro && (
                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            ✓
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-lg">
                      {player?.is_pro ? "Pro Player" : "Amateur Player"}
                    </p>
                  </div>
                </div>

                {/* Social Media Section - Only show if socials exist */}
                {player?.socials && player.socials.length > 0 && (
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-3">Follow me on</p>
                    <div className="flex items-center gap-3">
                      {player.socials.map((social) => (
                        <a
                          key={social.social_link_id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:shadow-lg transition-all bg-gray-100 hover:bg-gray-200"
                          title={`Follow on ${social.social}`}
                        >
                          <img
                            src={social.logo}
                            alt={social.social}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class='text-gray-700 text-xs font-bold'>${social.social.charAt(
                                  0
                                )}</span>`;
                              }
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons and Stats */}
            <div className="flex items-center justify-between">
              {/* Action Buttons */}
              <div className="flex gap-3">
                {user ? (
                  <button
                    onClick={handleFollow}
                    className={`px-8 py-3 rounded-full font-medium transition-colors text-sm ${
                      isFollowing
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 rounded-full font-medium transition-colors text-sm"
                  >
                    Follow
                  </Link>
                )}

                {user ? (
                  <button
                    onClick={handleGetInTouch}
                    className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Get in Touch
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Get in Touch
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {player?.follower_count?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {player?.stats?.high_game?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-600">High Game</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {player?.stats?.high_series?.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-gray-600">High Series</div>
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
                    <UserPostCard key={post.metadata.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-4">
              {/* Engagement Section */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Engagement
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Likes:</span>
                    <span className="font-medium">
                      {player?.engagement?.likes ?? "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Comments:</span>
                    <span className="font-medium">
                      {player?.engagement?.comments ?? "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shares:</span>
                    <span className="font-medium">
                      {player?.engagement?.shares ?? "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">
                      {player?.engagement?.views ?? "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sponsors Section - Only for Pro Players */}
              {player?.is_pro &&
                player?.sponsors &&
                player.sponsors.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Sponsors
                    </h3>
                    <div className="space-y-3">
                      {player.sponsors.map((sponsor) => (
                        <div
                          key={sponsor.brand_id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                        >
                          <Image
                            src={sponsor.logo_url}
                            alt={sponsor.formal_name}
                            width={40}
                            height={40}
                            className="object-contain rounded-md"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {sponsor.formal_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {sponsor.brandType}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Favorite Brands Section - Only for Non-Pro Players */}
              {!player?.is_pro &&
                player?.favorite_brands &&
                player.favorite_brands.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Favorite Brands
                    </h3>
                    <div className="space-y-3">
                      {/* Group brands by type */}
                      {[
                        "Balls",
                        "Shoes",
                        "Accessories",
                        "Apparels",
                        "Business",
                      ].map((brandType) => {
                        const brandsOfType =
                          player.favorite_brands?.filter(
                            (brand) => brand.brandType === brandType
                          ) || [];
                        if (brandsOfType.length === 0) return null;

                        return (
                          <div key={brandType}>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              {brandType}
                            </h4>
                            <div className="space-y-2">
                              {brandsOfType.map((brand) => (
                                <div
                                  key={brand.brand_id}
                                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                                >
                                  <Image
                                    src={brand.logo_url}
                                    alt={brand.formal_name}
                                    width={32}
                                    height={32}
                                    className="object-contain rounded-md"
                                  />
                                  <span className="text-sm text-gray-700 flex-1">
                                    {brand.formal_name}
                                  </span>
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
