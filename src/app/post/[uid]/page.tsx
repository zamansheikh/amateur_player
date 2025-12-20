"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import FeedPostCard from "@/components/FeedPostCard";

interface PostDetail {
  post_id: number;
  uid: string;
  author: {
    user_id: number;
    name: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    roles: {
      is_pro: boolean;
      is_center_admin: boolean;
      is_tournament_director: boolean;
    };
    profile_picture_url: string;
    is_followable: boolean;
    is_following: boolean;
    follower_count: number;
  };
  text: string;
  media_urls: string[];
  created: string;
  like_count: number;
  is_liked: boolean;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postUid = params.uid as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post details using the new API
  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(
        `https://test.bowlersnetwork.com/api/posts/v2/details/${postUid}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      
      setPost(response.data);
    } catch (err: unknown) {
      console.error("Error fetching post:", err);
      setError("Failed to load post");
    } finally {
      setIsLoading(false);
    }
  }, [postUid, user?.access_token]);

  useEffect(() => {
    if (postUid && user?.access_token) {
      fetchPost();
    }
  }, [postUid, user?.access_token, fetchPost]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">{error || "Post not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Convert PostDetail to FeedPost format for FeedPostCard
  const feedPost: any = {
    post_id: post.post_id,
    uid: post.uid,
    author: post.author,
    text: post.text,
    media_urls: post.media_urls,
    created: post.created,
    like_count: post.like_count,
    is_liked: post.is_liked,
    comment_count: 0,
    share_count: 0,
    is_commented: false,
    is_shared: false,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Post Detail */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <FeedPostCard
            post={feedPost}
            enableMediaLightbox={true}
          />
        </div>

        {/* Related Posts / Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            <p>Comments coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
