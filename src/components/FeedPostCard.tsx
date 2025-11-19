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
  likes: {
    total: number;
    likers: Array<{
      user_id: number;
      name: string;
      profile_pic_url: string;
    }>;
  };
  comments: {
    total: number;
    comment_list: Array<{
      comment_id: number;
      user: {
        user_id: number;
        name: string;
        profile_pic_url: string;
      };
      text: string;
      pics: string[];
      replies: Array<{
        reply_id: number;
        user: {
          user_id: number;
          name: string;
          profile_pic_url: string;
        };
        text: string;
        pics: string[];
      }>;
    }>;
  };
  caption: string;
  media: string[];
  poll: {
    id: number;
    uid: string;
    title: string;
    poll_type: string;
    options: Array<{
      option_id: number;
      content: string;
      vote: number;
      perc: number;
    }>;
  } | null;
  event: {
    id: number;
    title: string;
    date: string;
    location?: string;
  } | null;
  tags: string[];
  is_liked_by_me: boolean;
}

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
  const [localLikes, setLocalLikes] = useState(post.metadata.total_likes);
  const [isLiking, setIsLiking] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
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

  const handlePollVote = async (optionId: number) => {
    if (isVoting || !localPost.poll) return;

    try {
      setIsVoting(true);

      // Calculate current total votes from options
      const currentTotalVotes = localPost.poll.options.reduce((sum, option) => sum + option.vote, 0);
      const newTotalVotes = currentTotalVotes + 1;

      // Optimistic update - update local state immediately
      const updatedPoll = {
        ...localPost.poll,
        options: localPost.poll.options.map(option => {
          if (option.option_id === optionId) {
            return {
              ...option,
              vote: option.vote + 1,
              perc: Math.round(((option.vote + 1) / newTotalVotes) * 100)
            };
          }
          return {
            ...option,
            perc: Math.round((option.vote / newTotalVotes) * 100)
          };
        })
      };

      const updatedPost: FeedPost = {
        ...localPost,
        poll: updatedPoll
      };

      setLocalPost(updatedPost);
      setSelectedPollOption(optionId);

      // Call the poll vote API
      const response = await api.get(`/api/user/post/vote/${optionId}`);

      // Check if response is successful (200-299 status codes)
      if (response.status >= 200 && response.status < 300) {
        // Vote was successful, keep the optimistic update
        if (onPostChange) {
          onPostChange(updatedPost);
        }
      } else {
        // Revert optimistic update on non-success status
        setLocalPost(localPost);
        setSelectedPollOption(null);
      }
    } catch (error) {
      console.error("Error voting in poll:", error);
      // Revert optimistic update on error
      setLocalPost(localPost);
      setSelectedPollOption(null);
    } finally {
      setIsVoting(false);
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
      <div className="p-3 md:p-6 pb-2 md:pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 mb-3 md:mb-4">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50 p-1 md:p-2 rounded-lg transition-colors flex-shrink-0"
            onClick={handleUserClick}
          >
            <img
              src={post.author.profile_picture_url}
              alt={post.author.name}
              className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                {post.author.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 truncate">{post.metadata.created}</p>
            </div>
          </div>
          {!post.author.viewer_is_author && (
            <button
              className={`border px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${post.author.is_following
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
          {post.caption && (
            <p className="text-gray-800 leading-relaxed text-sm md:text-[15px] line-height-6 break-words">
              {renderTextWithTags(post.caption, post.tags)}
            </p>
          )}
        </div>

        {/* Poll Content */}
        {localPost.poll && (
          <div className="mb-3 md:mb-4 bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 break-words">
              📊 {localPost.poll.title}
            </h4>
            <div className="space-y-2 md:space-y-3">
              {localPost.poll.options.map((option) => {
                const totalVotes = localPost.poll!.options.reduce((sum, opt) => sum + opt.vote, 0);
                const percentage = totalVotes > 0 ? (option.vote / totalVotes) * 100 : 0;
                const isSelected = selectedPollOption === option.option_id;

                return (
                  <div key={option.option_id} className="relative">
                    <button
                      onClick={() => handlePollVote(option.option_id)}
                      disabled={isVoting || selectedPollOption !== null}
                      className={`w-full text-left p-2 md:p-3 rounded-lg border transition-all duration-200 relative overflow-hidden ${isSelected
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : selectedPollOption !== null || totalVotes > 0
                          ? 'border-gray-300 bg-white text-gray-700 cursor-default'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'
                        } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Progress bar background */}
                      {(selectedPollOption !== null || totalVotes > 0) && (
                        <div
                          className={`absolute inset-0 transition-all duration-500 ${isSelected ? 'bg-green-200' : 'bg-gray-200'
                            }`}
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      {/* Option content */}
                      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <span className="font-medium text-xs md:text-sm break-words">{option.content}</span>
                        {(selectedPollOption !== null || totalVotes > 0) && (
                          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                              {option.vote} vote{option.vote !== 1 ? 's' : ''}
                            </span>
                            <span className="text-xs md:text-sm font-bold text-gray-800 whitespace-nowrap">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Poll info */}
            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm text-gray-600">
                <span className="whitespace-nowrap">
                  {localPost.poll.options.reduce((sum, opt) => sum + opt.vote, 0)} total vote
                  {localPost.poll.options.reduce((sum, opt) => sum + opt.vote, 0) !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  {localPost.poll.poll_type} Choice
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Post Media Gallery - Clickable */}
        {post.media && post.media.length > 0 && (
          <div
            className={`max-h-fit overflow-hidden ${enableMediaLightbox ? "" : "cursor-pointer"}`}
            onClick={enableMediaLightbox ? undefined : handlePostClick}
          >
            <MediaGallery
              media={post.media}
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
              className={`transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${localPost.is_liked_by_me
                ? "text-red-500 hover:text-red-600"
                : "text-green-400 hover:text-red-500"
                }`}
            >
              {localPost.is_liked_by_me ? (
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
                className="md:w-6 md:h-6 flex-shrink-0"
              />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">{localLikes} Likes</span>
            </button>
            <button
              onClick={handlePostClick}
              className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200"
            >
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                {post.metadata.total_comments} Comment
                {post.metadata.total_comments !== 1 ? "s" : ""}
              </span>
            </button>
          </div>
          <button className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-green-500 transition-colors duration-200 flex-shrink-0">
            <Image
              src="/icons/share_icon.svg"
              alt="Share"
              unoptimized
              width={20}
              height={20}
              className="md:w-6 md:h-6 flex-shrink-0"
            />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
