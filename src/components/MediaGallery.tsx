'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MediaGalleryProps {
    media: string[];
    className?: string;
}

export default function MediaGallery({ media, className = "" }: MediaGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!media || media.length === 0) return null;

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % media.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const renderSingleImage = () => (
        <div className="relative w-full">
            <img
                src={media[0]}
                alt="Post content"
                className="w-full h-80 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => openLightbox(0)}
            />
        </div>
    );

    const renderTwoImages = () => (
        <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 2).map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => openLightbox(index)}
                />
            ))}
        </div>
    );

    const renderThreeImages = () => (
        <div className="grid grid-cols-2 gap-2 h-64">
            <img
                src={media[0]}
                alt="Post content 1"
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => openLightbox(0)}
            />
            <div className="grid grid-rows-2 gap-2">
                {media.slice(1, 3).map((image, index) => (
                    <img
                        key={index + 1}
                        src={image}
                        alt={`Post content ${index + 2}`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => openLightbox(index + 1)}
                    />
                ))}
            </div>
        </div>
    );

    const renderFourImages = () => (
        <div className="grid grid-cols-2 gap-2">
            {media.slice(0, 4).map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => openLightbox(index)}
                />
            ))}
        </div>
    );

    const renderFiveOrMoreImages = () => {
        const remainingCount = media.length - 4;
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {media.slice(0, 3).map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Post content ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => openLightbox(index)}
                    />
                ))}
                <div className="relative">
                    <img
                        src={media[3]}
                        alt={`Post content 4`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => openLightbox(3)}
                    />
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
        
        if (count === 1) return renderSingleImage();
        if (count === 2) return renderTwoImages();
        if (count === 3) return renderThreeImages();
        if (count === 4) return renderFourImages();
        return renderFiveOrMoreImages();
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
                        <img
                            src={media[currentImageIndex]}
                            alt={`Post content ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                        
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
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl font-bold"
                                >
                                    ←
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-3xl font-bold"
                                >
                                    →
                                </button>
                            </>
                        )}
                        
                        {/* Image counter */}
                        {media.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {media.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
