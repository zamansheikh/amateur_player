"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Image from "next/image";
import {
  BarChart3,
  MessageCircle,
  Trophy,
  Users,
  TrendingUp,
  Heart,
  Share,
  Eye,
  Calendar,
  Play,
  ArrowRight,
  Info,
  BarChart2,
} from "lucide-react";

interface DashboardData {
  user_id: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  follower_count: number;
  onboarded_user_count: number;
  free_users: number;
  premium_user_count: number;
  conversion_rate: number;
  weighted_index: number;
}

interface Player {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    stats: {
        averageScore: number;
        tournaments: number;
        wins: number;
        pbaRank: number;
        average_score: number;
        high_game: number;
        high_series: number;
        experience: number;
        // Added missing UserStats fields
        id?: number;
        user_id?: number;
    };
    weightedIndex: {
        percentage: number;
        freeUsers: number;
        premiumUsers: number;
        engagement: number;
    };
    // Added missing User fields
    user_id?: number;
    first_name?: string;
    last_name?: string;
    profile_picture_url?: string;
    intro_video_url?: string;
    xp?: number;
    email?: string;
    level?: number;
    card_theme?: string;
    is_pro?: boolean;
    follower_count?: number;
    authenticated?: boolean;
    access_token?: string;
    favorite_brands?: FavoriteBrand[];
    sponsors?: Sponsor[];
}

export interface FavoriteBrand {
    brand_id: number;
    brandType: string;
    name: string;
    formal_name: string;
    logo_url: string;
}

export interface Sponsor {
    // Define Sponsor fields as needed
    sponsor_id: number;
    name: string;
    logo_url: string;
}

export interface UserStats {
    id: number;
    user_id: number;
    average_score: number;
    high_game: number;
    high_series: number;
    experience: number;
}

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Mock data
const mockProPlayer: Player = {
  id: "1",
  name: "Johan Smith",
  username: "@johansmith",
  avatar: "",
  coverImage: "",
  bio: "Professional bowler with 15 years of experience",
  stats: {
    averageScore: 215,
    tournaments: 45,
    wins: 23,
    pbaRank: 12,
    average_score: 215,
    high_game: 300,
    high_series: 850,
    experience: 1200,
  },
  weightedIndex: {
    percentage: 20,
    freeUsers: 0,
    premiumUsers: 0,
    engagement: 19,
  },
};

const mockMessages: Message[] = [
  {
    id: "1",
    from: "fan123",
    content: "Your technique is incredible! Any tips for a beginner?",
    timestamp: "2024-01-17",
    read: false,
  },
  {
    id: "2",
    from: "youngbowler",
    content: "I'm 16 and just started bowling. You're my inspiration!",
    timestamp: "2024-01-17",
    read: false,
  },
  {
    id: "3",
    from: "coachsmith",
    content: "Would love to collaborate on a youth program!",
    timestamp: "2024-01-15",
    read: false,
  },
];

// Metrics Component
function Metrics({
  playerId,
  dashboardData,
  user,
}: {
  playerId: string;
  dashboardData: DashboardData | null;
  user: any;
}) {
  return (
    <div className="space-y-6">
      {/* Fan Base */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Followers</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {dashboardData ? dashboardData.follower_count : 0}
            </div>
            <div className="text-sm text-gray-600">Total Fans</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user && user.authenticated) {
          // Fetch dashboard data from API
          const token = localStorage.getItem("access_token");
          if (token) {
            try {
              const response = await axios.get(
                "https://test.bowlersnetwork.com/api/user/pro-dashboard-data",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                }
              );

              if (response.data) {
                setDashboardData(response.data);
              }
            } catch (error) {
              console.error("Error fetching dashboard data:", error);
            }
          }

          // Create player data from authenticated user
          const playerData: Player = {
            id: user.username || "1",
            name: user.name,
            username: user.username || "",
            avatar: user.profile_picture_url || "",
            coverImage: "",
            bio: `Professional bowler with ${user.xp || 0} XP points`,
            stats: {
              averageScore: user.stats?.average_score || 0,
              tournaments: 0,
              wins: user.stats?.high_game || 0,
              pbaRank: user.stats?.high_series || 0,
              average_score: user.stats?.average_score || 0,
              high_game: user.stats?.high_game || 0,
              high_series: user.stats?.high_series || 0,
              experience: user.stats?.experience || 0,
            },
            weightedIndex: {
              percentage: 85,
              freeUsers: user.follower_count || 0,
              premiumUsers: 0,
              engagement: user.xp || 0,
            },
            favorite_brands: user.favorite_brands || [],
          };
          setPlayer(playerData);
        } else {
          // Use mock data if no user (fallback)
          setPlayer(mockProPlayer);
        }
        setMessages(mockMessages);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-green-600">Loading Dashboard...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Player not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div
        className="text-white px-6 py-6"
        style={{ background: "linear-gradient(to right, #8BC342, #6fa332)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-green-100">
              Welcome back, {player.name || "Johan Smith"}
            </p>
          </div>
        </div>
      </div>
      {/* Fav Brands Section */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="text-xs text-gray-500 mr-6">
               Favorite Brands
            </div>
            <div className="flex items-center justify-center space-x-3">
              {user?.favorite_brands && user.favorite_brands.length > 0 ? (
                user.favorite_brands.map((brand, index) => (
                  <div
                    key={brand.brand_id || index}
                    className="flex items-center justify-center bg-gray-50 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                    title={brand.formal_name}
                  >
                    <Image
                      src={brand.logo_url}
                      alt={brand.formal_name}
                      width={42}
                      height={42}
                      className="object-contain"
                    />
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400">
                  {user?.is_pro ? "No sponsors available" : "No favorite brands available"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* XP Level Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Info className="w-4 h-4" />
                  XP Level
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Level {user?.level || 12}</div>
                <div className="text-sm text-gray-500 mb-3">
                  {user?.xp || 2340} XP • {660 - (user?.xp || 2340 - 2340)} XP to level {(user?.level || 12) + 1}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${((user?.xp || 2340) % 660) / 660 * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <BarChart2 className="w-4 h-4" />
                  Average Score
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.stats?.average_score || 187}
                </div>
                <div className="text-sm text-green-500">
                  +12 from last month
                </div>
              </div>
            </div>
          </div>

          {/* Followers Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  Followers
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {dashboardData?.follower_count || user?.follower_count || 187}
                </div>
                <div className="text-sm text-green-500">
                  +24 new followers this week
                </div>
              </div>
            </div>
          </div>

          {/* Tournaments Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Tournaments
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
                <div className="text-sm text-gray-500">
                  Upcoming tournaments this month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Latest Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Latest Content</h3>
              <p className="text-sm text-gray-500 mt-1">New videos from BEK TV+</p>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <div className="w-full h-32 bg-gradient-to-r from-blue-900 to-yellow-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <Play className="w-12 h-12 text-white z-10" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-medium z-10">
                    Storm
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Learn from the pros how to perfect your hook technique
              </p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                View All Content <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
              <p className="text-sm text-gray-500 mt-1">Recent messages from your network</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">DL</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Downtown Lanes</div>
                  <p className="text-xs text-gray-500 mb-1">New tournament announced! Register by Friday.</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">DL</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Downtown Lanes</div>
                  <p className="text-xs text-gray-500 mb-1">New tournament announced! Register by Friday.</p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                View All Messages <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Upcoming Tournaments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Tournaments</h3>
              <p className="text-sm text-gray-500 mt-1">Tournaments you have registered for</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900 text-sm">City Championship</div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Registered
                  </span>
                </div>
                <p className="text-xs text-gray-500">Downtown Lanes • May 15, 2025</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900 text-sm">Summer Classic</div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Registered
                  </span>
                </div>
                <p className="text-xs text-gray-500">Sunset Bowling Center • June 10, 2025</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900 text-sm">Pro-Am Invitational</div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Registered
                  </span>
                </div>
                <p className="text-xs text-gray-500">Elite Lanes • July 22, 2025</p>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                View All Tournaments <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Performance Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            {/* Simple Bar Chart Representation */}
            <div className="flex items-end justify-between h-64 gap-4">
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-md" style={{ height: '60%' }}></div>
                <div className="text-xs text-gray-500 mt-2">Jan</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-md" style={{ height: '55%' }}></div>
                <div className="text-xs text-gray-500 mt-2">Feb</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-md" style={{ height: '70%' }}></div>
                <div className="text-xs text-gray-500 mt-2">Mar</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-md" style={{ height: '50%' }}></div>
                <div className="text-xs text-gray-500 mt-2">Apr</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-md" style={{ height: '58%' }}></div>
                <div className="text-xs text-gray-500 mt-2">May</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-md" style={{ height: '65%' }}></div>
                <div className="text-xs text-gray-500 mt-2">Jun</div>
              </div>
            </div>
            
            {/* Y-axis labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-4">
              <span>150</span>
              <span>175</span>
              <span>200</span>
              <span>225</span>
              <span>250</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
