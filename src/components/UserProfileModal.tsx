"use client";

import { useState, useEffect } from "react";
import {
  X,
  Play,
  MessageCircle,
  Heart,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import UserPostCard from "./UserPostCard";

interface UserProfile {
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
    stats: {
        id: number;
        user_id: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
    };
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
    };
    is_followed: boolean;
}

interface UserPost {
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
  images: any[];
  videos: any[];
  poll: any;
  event: any;
  tags: string[];
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  userId,
}: UserProfileModalProps) {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await api.get(`/api/user/${userId}/profile`);
      console.log("Profile response:", response.data);
      setProfile(response.data);
      setIsFollowing(response.data?.is_followed || false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user posts
  const fetchPosts = async () => {
    try {
      setPostsLoading(true);

      // Replace with your actual API endpoint
      const response = await api.get(`/api/user/${userId}/posts`);
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Follow/Unfollow user
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/api/user/${userId}/follow`);
        setIsFollowing(false);
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
            },
            follower_count: profile.follower_count - 1,
          });
        }
      } else {
        await api.post(`/api/user/${userId}/follow`);
        setIsFollowing(true);
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
            },
            follower_count: profile.follower_count + 1,
          });
        }
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  // Get in touch (message user)
  const handleGetInTouch = () => {
    // Navigate to messages or open chat
    console.log("Get in touch with user:", userId);
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
      fetchPosts();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[95vw] max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Modal Header with Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-full">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="relative">
                {/* Cover Video */}
                <div className="h-64 relative overflow-hidden">
                  {profile?.intro_video_url ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={profile?.intro_video_url} type="video/mp4" />
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
                        src={profile?.profile_picture_url || "/playercard1.png"}
                        alt={profile?.name}
                        className="w-32 h-32 rounded-2xl border-4 border-white object-cover"
                      />
                    </div>

                    <div className="flex-1 mt-16">
                      {/* Name, Level, XP, EXP Row */}
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                              {profile?.name}
                            </h1>
                            {profile?.is_pro && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">
                            {profile?.is_pro ? "Pro Player" : "Amateur Player"}
                          </p>
                        </div>

                        {/* Level, XP, EXP Icons */}
                        <div className="flex items-center gap-4 ml-auto">
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
                                  {profile?.level || 8}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs mt-1">
                              Level
                            </span>
                          </div>

                          {/* XP */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-12 h-12">
                              <img
                                src="/icons/xp.svg"
                                alt="XP"
                                className="w-full h-full"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {profile?.xp || 8}
                                </span>
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs mt-1">
                              XP
                            </span>
                          </div>

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
                                  {profile?.stats.experience || 8}
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
                              {profile?.follower_count?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-gray-600">
                              Followers
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {profile?.stats.high_game?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-gray-600">
                              High Game
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {profile?.stats.high_series?.toLocaleString() || "0"}
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
                            onPostUpdate={fetchPosts}
                            onPostChange={() => {}}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar */}
                  <div className="w-80 space-y-4">
                    {/* Dummy Section 1 */} 
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Engagement</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Likes:</span>
                          <span className="font-medium">{profile?.engagement?.likes ?? "0"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Comments:</span>
                          <span className="font-medium">{profile?.engagement?.comments?? "0"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shares:</span>
                          <span className="font-medium">{profile?.engagement?.shares ?? "0"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Views:</span>
                          <span className="font-medium">{profile?.engagement?.views ?? "0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
