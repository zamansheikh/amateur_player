"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import MediaGallery from "./MediaGallery";

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
    has_media: boolean;
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
  media: string[];
  poll: any;
  event: any;
  tags: string[];
  is_liked_by_me: boolean;
}

interface UserPostCardProps {
  post: UserPost;
  onPostUpdate?: () => void;
  onPostChange?: (updatedPost: UserPost) => void;
}

export default function UserPostCard({
  post,
  onPostUpdate,
  onPostChange,
}: UserPostCardProps) {
  const [localLikes, setLocalLikes] = useState(post.metadata.total_likes);
  const [isLiking, setIsLiking] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`/post/${post.metadata.id}`);
  };

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      // Optimistic update
      const newLikedState = !localPost.is_liked_by_me;
      const updatedPost: UserPost = {
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
      await api.get(`/api/user/post/click-like/${localPost.metadata.id}`);

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

    // If no tags, just return the text split by hashtags for styling
    if (tags.length === 0) {
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
    }

    // For texts with tags, we need to ensure hashtags are properly styled
    // Split text by hashtags and style them
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
          <div className="flex items-center gap-3">
            <img
              src={localPost.author.profile_pic_url}
              alt={localPost.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-base">
                {localPost.author.name}
              </h3>
              <p className="text-sm text-gray-500">
                {localPost.metadata.created}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content - Clickable */}
        <div className="mb-4 cursor-pointer" onClick={handlePostClick}>
          <p className="text-gray-800 leading-relaxed text-[15px] line-height-6">
            {renderTextWithTags(localPost.caption, localPost.tags)}
          </p>
        </div>

        {/* Post Media Gallery - Clickable */}
        {localPost.media && localPost.media.length > 0 && (
          <div className="cursor-pointer" onClick={handlePostClick}>
            <MediaGallery media={localPost.media} />
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
                  : "text-gray-600 hover:text-red-500"
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
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
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
