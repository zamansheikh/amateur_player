'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaGalleryProps {
    media: string[];
    className?: string;
}

export default function MediaGallery({ media, className = "" }: MediaGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    if (!media || media.length === 0) return null;

    // Helper function to check if a media URL is a video
    const isVideo = (url: string): boolean => {
        return url.toLowerCase().includes('.mp4') || 
               url.toLowerCase().includes('.webm') || 
               url.toLowerCase().includes('.mov') || 
               url.toLowerCase().includes('.avi') ||
               url.toLowerCase().includes('.mkv');
    };

    const openLightbox = (index: number) => {
        setCurrentMediaIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.style.overflow = 'unset'; // Restore scroll
    }, []);

    const nextMedia = useCallback(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    }, [media.length]);

    const prevMedia = useCallback(() => {
        setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    }, [media.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    if (media.length > 1) prevMedia();
                    break;
                case 'ArrowRight':
                    if (media.length > 1) nextMedia();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [lightboxOpen, closeLightbox, nextMedia, prevMedia, media.length]);

    // Touch/swipe navigation
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && media.length > 1) {
            nextMedia();
        }
        if (isRightSwipe && media.length > 1) {
            prevMedia();
        }
    };

    // Component to render a single media item
    const renderMediaItem = (mediaUrl: string, index: number, className: string) => {
        if (isVideo(mediaUrl)) {
            return (
                <div key={index} className={`relative ${className} cursor-pointer hover:opacity-95 transition-opacity`} onClick={() => openLightbox(index)}>
                    <video
                        src={mediaUrl}
                        className="w-full h-full object-cover rounded-lg border-2 border-green-200"
                        muted
                        preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-gray-800 ml-1" />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <img
                    key={index}
                    src={mediaUrl}
                    alt={`Post content ${index + 1}`}
                    className={`${className} object-cover rounded-lg border-2 border-green-200 cursor-pointer hover:opacity-95 transition-opacity`}
                    onClick={() => openLightbox(index)}
                />
            );
        }
    };

    const renderSingleMedia = () => (
        <div className="relative w-full">
            {renderMediaItem(media[0], 0, "w-full h-80")}
        </div>
    );

    const renderTwoMedia = () => (
        <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 2).map((mediaUrl, index) => 
                renderMediaItem(mediaUrl, index, "w-full h-64")
            )}
        </div>
    );

    const renderThreeMedia = () => (
        <div className="grid grid-cols-2 gap-2 h-64">
            {renderMediaItem(media[0], 0, "w-full h-full")}
            <div className="grid grid-rows-2 gap-2">
                {media.slice(1, 3).map((mediaUrl, index) => 
                    renderMediaItem(mediaUrl, index + 1, "w-full h-full")
                )}
            </div>
        </div>
    );

    const renderFourMedia = () => (
        <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 4).map((mediaUrl, index) => 
                renderMediaItem(mediaUrl, index, "w-full h-32")
            )}
        </div>
    );

    const renderFiveOrMoreMedia = () => {
        const remainingCount = media.length - 4;
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {media.slice(0, 3).map((mediaUrl, index) => 
                    renderMediaItem(mediaUrl, index, "w-full h-32")
                )}
                <div className="relative">
                    {renderMediaItem(media[3], 3, "w-full h-32")}
                    {remainingCount > 0 && (
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-70 transition-opacity border-2 border-green-200"
                            onClick={() => openLightbox(3)}
                        >
                            <span className="text-white text-xl font-semibold">
                                +{remainingCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMediaGrid = () => {
        const count = media.length;
        
        if (count === 1) return renderSingleMedia();
        if (count === 2) return renderTwoMedia();
        if (count === 3) return renderThreeMedia();
        if (count === 4) return renderFourMedia();
        return renderFiveOrMoreMedia();
    };

    return (
        <>
            <div className={`mb-4 ${className}`}>
                {renderMediaGrid()}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="relative max-w-5xl max-h-full p-4 w-full h-full flex items-center justify-center">
                        {isVideo(media[currentMediaIndex]) ? (
                            <video
                                src={media[currentMediaIndex]}
                                controls
                                autoPlay
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        ) : (
                            <img
                                src={media[currentMediaIndex]}
                                alt={`Post content ${currentMediaIndex + 1}`}
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                        )}
                        
                        {/* Close button - Improved styling */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        {/* Navigation arrows - Improved styling */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={prevMedia}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextMedia}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                        
                        {/* Media counter - Improved styling */}
                        {media.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white border-opacity-20">
                                {currentMediaIndex + 1} / {media.length}
                            </div>
                        )}

                        {/* Swipe instruction for mobile */}
                        {media.length > 1 && (
                            <div className="absolute bottom-6 right-6 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white border-opacity-20 md:hidden">
                                Swipe to navigate
                            </div>
                        )}

                        {/* Keyboard instruction for desktop */}
                        {media.length > 1 && (
                            <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-white border-opacity-20 hidden md:block">
                                Use ← → keys or click arrows
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
