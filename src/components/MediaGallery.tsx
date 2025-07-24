'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface MediaGalleryProps {
    media: string[];
    className?: string;
}

export default function MediaGallery({ media, className = "" }: MediaGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

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
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextMedia = () => {
        setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    };

    const prevMedia = () => {
        setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    // Component to render a single media item
    const renderMediaItem = (mediaUrl: string, index: number, className: string) => {
        if (isVideo(mediaUrl)) {
            return (
                <div key={index} className={`relative ${className} cursor-pointer hover:opacity-95 transition-opacity`} onClick={() => openLightbox(index)}>
                    <video
                        src={mediaUrl}
                        className="w-full h-full object-cover rounded-lg"
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
                    className={`${className} object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity`}
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
                            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-70 transition-opacity"
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
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-full p-4">
                        {isVideo(media[currentMediaIndex]) ? (
                            <video
                                src={media[currentMediaIndex]}
                                controls
                                autoPlay
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <img
                                src={media[currentMediaIndex]}
                                alt={`Post content ${currentMediaIndex + 1}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        )}
                        
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold"
                        >
                            ×
                        </button>
                        
                        {/* Navigation arrows */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={prevMedia}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl font-bold"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={nextMedia}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl font-bold"
                                >
                                    →
                                </button>
                            </>
                        )}
                        
                        {/* Media counter */}
                        {media.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                {currentMediaIndex + 1} / {media.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
