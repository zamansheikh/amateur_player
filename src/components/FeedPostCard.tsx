"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import MediaGallery from "./MediaGallery";

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
    username: string;
    profile_picture_url: string;
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

interface FeedPostCardProps {
  post: FeedPost;
  onPostUpdate?: () => void;
  onPostChange?: (updatedPost: FeedPost) => void;
}

export default function FeedPostCard({
  post,
  onPostUpdate,
  onPostChange,
}: FeedPostCardProps) {
  const [localLikes, setLocalLikes] = useState(post.metadata.total_likes);
  const [isLiking, setIsLiking] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const router = useRouter();

  // Initialize following state
  const [isFollowing, setIsFollowing] = useState(post.author.is_following);

  const handleUserClick = () => {
    router.push(`/player/${post.author.username}`);
  };

  const handlePostClick = () => {
    router.push(`/post/${post.metadata.id}`);
  };

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      // Optimistic update
      const newLikedState = !localPost.is_liked_by_me;
      const updatedPost: FeedPost = {
        ...localPost,
        is_liked_by_me: newLikedState,
        metadata: {
          ...localPost.metadata,
          total_likes: newLikedState
            ? localPost.metadata.total_likes + 1
            : localPost.metadata.total_likes - 1,
        },
      };
      setLocalPost(updatedPost);
      setLocalLikes(newLikedState ? localLikes + 1 : localLikes - 1);

      // Call API
      await api.get(`/api/user/post/click-like/${post.metadata.id}`);

      // Notify parent of the change
      if (onPostChange) {
        onPostChange(updatedPost);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert optimistic update on error
      setLocalPost(post);
      setLocalLikes(post.metadata.total_likes);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFollow = async () => {
    if (isFollowing) return;

    try {
      setIsFollowing(true);
      const updatedPost = {
        ...localPost,
        author: {
          ...localPost.author,
          is_following: true,
        },
      };
      setLocalPost(updatedPost);

      await api.post("/api/user/follow", {
        user_id: post.author.user_id,
      });

      if (onPostChange) {
        onPostChange(updatedPost);
      }
    } catch (error) {
      console.error("Error following user:", error);
      setIsFollowing(post.author.is_following);
      setLocalPost(post);
    }
  };

  // Function to parse caption (API returns it as string array format)
  const parseCaption = (caption: string): string => {
    try {
      // Handle caption that comes as "['text content']" format
      if (caption.startsWith("[") && caption.endsWith("]")) {
        const parsed = JSON.parse(caption.replace(/'/g, '"'));
        return Array.isArray(parsed) ? parsed[0] || "" : caption;
      }
      return caption;
    } catch (error) {
      return caption;
    }
  };

  // Function to render text with hashtags
  const renderTextWithTags = (text: string, tags: string[]) => {
    const cleanText = parseCaption(text);

    return cleanText.split(/(#\w+)/g).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span key={index} className="text-green-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={handleUserClick}
          >
            <img
              src={post.author.profile_picture_url}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-base">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-500">{post.metadata.created}</p>
            </div>
          </div>
          {!post.author.viewer_is_author && (
            <button
              className={`border px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                post.author.is_following
                  ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                  : "border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700"
              }`}
              onClick={handleFollow}
            >
              {post.author.is_following ? "Following" : "+ Follow"}
            </button>
          )}
        </div>

        {/* Post Content - Clickable */}
        <div className="mb-4 cursor-pointer" onClick={handlePostClick}>
          <p className="text-gray-800 leading-relaxed text-[15px] line-height-6">
            {renderTextWithTags(post.caption, post.tags)}
          </p>
        </div>

        {/* Post Media Gallery - Clickable */}
        {post.media && post.media.length > 0 && (
          <div onClick={handlePostClick} className="cursor-pointer">
            <MediaGallery media={post.media} />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                localPost.is_liked_by_me
                  ? "text-red-500 hover:text-red-600"
                  : "text-green-400 hover:text-red-500"
              }`}
            >
              {localPost.is_liked_by_me ? (
                <Image
                  src="/icons/like_icon.svg"
                  alt="Unlike"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/icons/not_like_icon.svg"
                  alt="Like"
                  width={24}
                  height={24}
                />
              )}
            </button>
            <button
              onClick={handlePostClick}
              className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200"
            >
              <Image
                src="/icons/comment_icon.svg"
                alt="Comment"
                width={24}
                height={24}
              />
              <span className="text-sm font-medium">{localLikes} Likes</span>
              <span className="text-sm font-medium">
                {post.metadata.total_comments} Comment
                {post.metadata.total_comments !== 1 ? "s" : ""}
              </span>
            </button>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200">
            <Image
              src="/icons/share_icon.svg"
              alt="Share"
              width={24}
              height={24}
            />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
