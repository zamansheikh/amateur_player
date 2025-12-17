"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { FeedPost } from "@/types";
import MediaGallery from "./MediaGallery";

interface FeedPostCardProps {
  post: FeedPost;
  onPostUpdate?: () => void;
  onPostChange?: (updatedPost: FeedPost) => void;
  enableMediaLightbox?: boolean; // New prop to control media lightbox
}

export default function FeedPostCard({
  post,
  onPostUpdate,
  onPostChange,
  enableMediaLightbox = false, // Default to false for feeds
}: FeedPostCardProps) {
  const [localLikes, setLocalLikes] = useState(post.like_count);
  const [isLiking, setIsLiking] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const router = useRouter();

  // Initialize following state
  const [isFollowing, setIsFollowing] = useState(post.author.is_following);

  const handleUserClick = () => {
    router.push(`/profile/${post.author.username}`);
  };

  const handlePostClick = () => {
    router.push(`/post/${post.post_id}`);
  };

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      // Optimistic update
      const newLikedState = !localPost.is_liked;
      const updatedPost: FeedPost = {
        ...localPost,
        is_liked: newLikedState,
        like_count: newLikedState
          ? localPost.like_count + 1
          : localPost.like_count - 1,
      };
      setLocalPost(updatedPost);
      setLocalLikes(newLikedState ? localLikes + 1 : localLikes - 1);

      // Call API
      await api.get(`/api/posts/${post.post_id}/like`);

      // Notify parent of the change
      if (onPostChange) {
        onPostChange(updatedPost);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert optimistic update on error
      setLocalPost(post);
      setLocalLikes(post.like_count);
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

  // Function to render text with hashtags
  const renderTextWithTags = (text: string) => {
    return text.split(/(#\w+)/g).map((part, index) => {
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
      <div className="p-3 md:p-6 pb-2 md:pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 mb-3 md:mb-4">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50 p-1 md:p-2 rounded-lg transition-colors shrink-0"
            onClick={handleUserClick}
          >
            <img
              src={post.author.profile_picture_url}
              alt={post.author.name}
              className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover ring-2 ring-gray-100 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                {post.author.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 truncate">{post.created}</p>
            </div>
          </div>
          {post.author.is_followable && (
            <button
              className={`border px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${post.author.is_following
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
        <div className="mb-3 md:mb-4 cursor-pointer" onClick={handlePostClick}>
          {post.text && (
            <p className="text-gray-800 leading-relaxed text-sm md:text-[15px] line-height-6 overflow-wrap break-word">
              {renderTextWithTags(post.text)}
            </p>
          )}
        </div>



        {/* Post Media Gallery - Clickable */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div
            className={`max-h-fit overflow-hidden ${enableMediaLightbox ? "" : "cursor-pointer"}`}
            onClick={enableMediaLightbox ? undefined : handlePostClick}
          >
            <MediaGallery
              media={post.media_urls}
              enableLightbox={enableMediaLightbox}
            // maxHeight="400px"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${localPost.is_liked
                ? "text-red-500 hover:text-red-600"
                : "text-green-400 hover:text-red-500"
                }`}
            >
              {localPost.is_liked ? (
                <Image
                  src="/icons/like_icon.svg"
                  alt="Unlike"
                  unoptimized
                  width={20}
                  height={20}
                  className="md:w-6 md:h-6"
                />
              ) : (
                <Image
                  src="/icons/not_like_icon.svg"
                  alt="Like"
                  unoptimized
                  width={20}
                  height={20}
                  className="md:w-6 md:h-6"
                />
              )}
            </button>
            <button
              onClick={handlePostClick}
              className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200"
            >
              <Image
                src="/icons/comment_icon.svg"
                alt="Comment"
                unoptimized
                width={20}
                height={20}
                className="md:w-6 md:h-6 shrink-0"
              />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">{localLikes} Likes</span>
            </button>
            <button
              onClick={handlePostClick}
              className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200"
            >
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                0 Comment
              </span>
            </button>
          </div>
          <button className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200 shrink-0">
            <Image
              src="/icons/share_icon.svg"
              alt="Share"
              unoptimized
              width={20}
              height={20}
              className="md:w-6 md:h-6 shrink-0"
            />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
