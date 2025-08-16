'use client'; // Use client-side rendering for dynamic color calculation
import React from "react";
import { useEffect, useState } from 'react';

// Interface for RGB color values
interface RGB {
  r: number;
  g: number;
  b: number;
}

// Utility function to convert hex to RGB
const hexToRgb = (hex: string): RGB => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  // Handle shorthand hex (e.g., #FFF)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  // Parse to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
};

// Utility function to calculate relative luminance
const getLuminance = (r: number, g: number, b: number): number => {
  // Normalize RGB values to [0, 1]
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  // W3C luminance calculation
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Utility function to process color input
const processColor = (color: string): RGB => {
  // If color is a Tailwind class (e.g., bg-blue-500), map to approximate hex
  const tailwindColorMap: { [key: string]: string } = {
    'blue-500': '#3b82f6',
    'red-500': '#ef4444',
    'green-500': '#10b981',
    // Add more Tailwind colors as needed
  };

  if (tailwindColorMap[color]) {
    return hexToRgb(tailwindColorMap[color]);
  }

  // If color is hex, convert directly
  if (color.match(/^#[0-9A-F]{3,6}$/i)) {
    return hexToRgb(color);
  }

  // If color is rgba(r, g, b, a) or rgb(r, g, b)
  const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
    };
  }

  // Default to white if color is invalid
  return { r: 255, g: 255, b: 255 };
};



const CARD_WIDTH = 363;
const CARD_HEIGHT = 544;

const PLAYER_IMAGE = "https://randomuser.me/api/portraits/men/32.jpg"; // Replace with actual player image if needed
interface PlayerCardProps {
    imageUrl?: string;
    imagePath?: string;
    width?: number;
    height?: number;
    level?: number;
    name?: string;
    stats?: {
        average: number;
        highGame: number;
        highSeries: number;
        experience: number;
        Xp: number;
        follower: number;
    };
    borderColor?: string;
    backgroundColor?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
    imageUrl,
    imagePath,
    width = CARD_WIDTH,
    height = CARD_HEIGHT,
    level = 1,
    name = "Player Name",
    stats = {
        average: 0,
        highGame: 0,
        highSeries: 0,
        experience: 0,
        Xp: 0,
        follower: 0,
    },
    borderColor = "#EE2E55",
    backgroundColor = "white",
}) => {
    const [textColor, setTextColor] = useState<string>('black');
    
    // Calculate scaling factor based on card size
    const scaleX = width / CARD_WIDTH;
    const scaleY = height / CARD_HEIGHT;
    const averageScale = (scaleX + scaleY) / 2;
    
    // Scaled dimensions and positions
    const scaledImageWidth = 280 * scaleX;
    const scaledImageHeight = 180 * scaleY;
    const scaledFontSize = Math.max(16, 22 * averageScale);
    const scaledStatsFontSize = Math.max(18, 24 * averageScale);
    const scaledLevelFontSize = Math.max(40, 56 * averageScale);
    const scaledPadding = Math.max(16, 24 * averageScale);

    // Determine the image source (URL takes priority over path)
    const imageSrc = imageUrl || imagePath || PLAYER_IMAGE;
    
    useEffect(() => {
        // Handle transparent background
        if (backgroundColor === "transparent") {
            setTextColor('#1E2D5E');
            return;
        }

        // Handle RGBA colors - extract RGB values for luminance calculation
        if (backgroundColor.startsWith('rgba(')) {
            const rgbaMatch = backgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
            if (rgbaMatch) {
                const r = parseInt(rgbaMatch[1], 10);
                const g = parseInt(rgbaMatch[2], 10);
                const b = parseInt(rgbaMatch[3], 10);
                const alpha = parseFloat(rgbaMatch[4] || '1');
                
                // For very low alpha values (< 0.1), treat as white background
                if (alpha < 0.1) {
                    setTextColor('#1E2D5E');
                    return;
                }
                
                // Blend with white background for alpha calculation
                const blendedR = Math.round(r * alpha + 255 * (1 - alpha));
                const blendedG = Math.round(g * alpha + 255 * (1 - alpha));
                const blendedB = Math.round(b * alpha + 255 * (1 - alpha));
                
                const luminance = getLuminance(blendedR, blendedG, blendedB);
                setTextColor(luminance > 0.5 ? '#1E2D5E' : 'white');
                return;
            }
        }

        // Process the color input to RGB
        const { r, g, b } = processColor(backgroundColor);

        // Calculate luminance
        const luminance = getLuminance(r, g, b);

        // Set text color based on luminance
        // Use darker blue for light backgrounds, white for dark backgrounds
        setTextColor(luminance > 0.5 ? '#1E2D5E' : 'white');
    }, [backgroundColor]);

    // Determine the effective background color for rendering
    const effectiveBackgroundColor = backgroundColor === "transparent" ? "white" : backgroundColor;
    const isTransparent = backgroundColor === "transparent";
    const isRgbaColor = backgroundColor.startsWith('rgba(');
    const shouldShowBackground = !isTransparent;

    // Determine if color is a Tailwind class or a raw color value
    const isTailwindClass = backgroundColor.includes('-') && !backgroundColor.startsWith('#') && !backgroundColor.startsWith('rgb');
    const backgroundStyle = isTailwindClass ? {} : { backgroundColor: backgroundColor };
    const backgroundClass = isTailwindClass ? `bg-${backgroundColor}` : '';
    return (
        <div
            style={{
                width,
                height,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent", // Always transparent wrapper
            }}
        >
            {/* SVG Card Shape */}
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            >
                {/* Strong base background layer - always solid white */}
                <path
                    d="M40.0537 60.1366C27.0067 69.0807 9.24832 73.9255 2 75.2298C3.4094 187.217 5.50336 417.453 2.60403 442.497C-0.295302 467.54 17.1007 477.155 26.1611 478.832L77.5034 495.043C141.289 508.46 174.148 531.938 182.604 542C198.067 516.957 282.47 492.435 322.738 483.304C353.181 478.385 361.597 461.13 362 453.118V75.2298C353.342 75.2298 328.054 68.5217 296.161 41.6894C264.268 14.8571 235.356 9.26708 224.886 9.82609C216.671 25.9255 200.523 21.0062 193.477 16.5342L182 2L168.107 16.5342C153.128 25.4783 140.926 15.7888 136.698 9.82609C96.2282 10.3851 56.3624 48.9565 40.0537 60.1366Z"
                    fill="white"
                    stroke="none"
                />
                {/* Overlay background with specified color */}
                <path
                    d="M40.0537 60.1366C27.0067 69.0807 9.24832 73.9255 2 75.2298C3.4094 187.217 5.50336 417.453 2.60403 442.497C-0.295302 467.54 17.1007 477.155 26.1611 478.832L77.5034 495.043C141.289 508.46 174.148 531.938 182.604 542C198.067 516.957 282.47 492.435 322.738 483.304C353.181 478.385 361.597 461.13 362 453.118V75.2298C353.342 75.2298 328.054 68.5217 296.161 41.6894C264.268 14.8571 235.356 9.26708 224.886 9.82609C216.671 25.9255 200.523 21.0062 193.477 16.5342L182 2L168.107 16.5342C153.128 25.4783 140.926 15.7888 136.698 9.82609C96.2282 10.3851 56.3624 48.9565 40.0537 60.1366Z"
                    fill={isTransparent ? "rgba(255, 255, 255, 0.8)" : (isRgbaColor ? backgroundColor : effectiveBackgroundColor)}
                    stroke={`url(#paint0_linear_${width}_${height})`}
                    strokeWidth="2"
                />
                <defs>
                    <linearGradient
                        id={`paint0_linear_${width}_${height}`}
                        x1="182"
                        y1="2"
                        x2="182"
                        y2="542"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={borderColor} />
                        <stop offset="1" stopColor={borderColor} stopOpacity="0.7" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Card Content */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontFamily: "sans-serif",
                    color: "#1E2D5E",
                }}
            >
                {/* Level */}
                <div
                    style={{ position: "absolute", top: 80 * scaleY, left: 24 * scaleX, textAlign: "left" }}
                >
                    <div style={{ fontSize: 20 * averageScale, fontWeight: 500, color: textColor }}>
                        Level
                    </div>
                    <div
                        style={{
                            fontSize: scaledLevelFontSize,
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1,
                        }}
                    >
                        {level}
                    </div>
                </div>
                {/* Player Image */}
                <img
                    src={imageSrc}
                    alt={name}
                    style={{
                        position: "absolute",
                        top: 60 * scaleY,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: scaledImageWidth,
                        height: scaledImageHeight,
                        objectFit: "cover",
                        borderRadius: 12 * averageScale,
                        zIndex: 3,
                        // boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                        // background: "#fff",
                    }}
                />
                {/* Name & Follow */}
                <div
                    style={{
                        position: "absolute",
                        top: 250 * scaleY,
                        left: 10 * scaleX,
                        width: "95%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: isTransparent || isRgbaColor || textColor === '#1E2D5E' ? "rgba(255, 255, 255, 0.95)" : "rgba(30, 45, 94, 0.95)",
                        padding: `${16 * averageScale}px ${scaledPadding}px ${12 * averageScale}px ${scaledPadding}px`,
                        fontWeight: 700,
                        fontSize: scaledFontSize,
                        color: textColor === '#1E2D5E' ? '#1E2D5E' : 'white',
                        borderRadius: 0,
                        borderBottom: textColor === 'white' ? '1.5px solid rgba(255, 255, 255, 0.2)' : '1.5px solid rgba(30, 45, 94, 0.13)',
                        boxSizing: "border-box",
                    }}
                >
                    <span>{name}</span>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: textColor === '#1E2D5E' ? '#1E2D5E' : 'white',
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: 16 * averageScale,
                            display: "flex",
                            alignItems: "center",
                            gap: 4 * averageScale,
                        }}
                    >
                        <span style={{ fontSize: 20 * averageScale, color: textColor === '#1E2D5E' ? '#1E2D5E' : 'white', fontWeight: 700 }}>
                            +
                        </span>{" "}
                        Follow
                    </button>
                </div>
                {/* Stats Grid */}
                <div
                    style={{
                        position: "absolute",
                        top: 320 * scaleY,
                        left: 0,
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: `${20 * averageScale}px ${scaledPadding}px`,
                        fontSize: 18 * averageScale,
                        color: textColor,
                        fontWeight: 500,
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 18 * averageScale,
                            paddingLeft: 32 * scaleX,
                            alignItems: "flex-end",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 * averageScale }}>
                            <span style={{ fontSize: scaledStatsFontSize, minWidth: 55 * scaleX, textAlign: "right", fontWeight: 600 }}>{stats.average}</span>
                            <span style={{ color: textColor, fontSize: 16 * averageScale, opacity: 0.7 , minWidth: 35 * scaleX, textAlign: "right" }}>
                                AVG
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 * averageScale }}>
                            <span style={{ fontSize: scaledStatsFontSize, minWidth: 55 * scaleX, textAlign: "right", fontWeight: 600 }}>{stats.highGame}</span>
                            <span style={{ color: textColor, fontSize: 16 * averageScale, opacity: 0.7 ,  minWidth: 35 * scaleX, textAlign: "right"}}>
                                HG
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 * averageScale }}>
                            <span style={{ fontSize: scaledStatsFontSize, minWidth: 55 * scaleX, textAlign: "right", fontWeight: 600 }}>{stats.highSeries}</span>
                            <span style={{ color: textColor, fontSize: 16 * averageScale, opacity: 0.7,  minWidth: 35 * scaleX, textAlign: "right" }}>
                                HS
                            </span>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div
                        style={{ 
                            width: 3 * averageScale, 
                            minWidth: 3 * averageScale,
                            background: textColor === 'white' 
                                ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))' 
                                : 'linear-gradient(to bottom, rgba(30, 45, 94, 0.6), rgba(30, 45, 94, 0.2))', 
                            margin: `0 ${20 * averageScale}px`,
                            borderRadius: `${2 * averageScale}px`,
                            boxShadow: textColor === 'white' 
                                ? '0 0 4px rgba(255, 255, 255, 0.3)' 
                                : '0 0 4px rgba(30, 45, 94, 0.2)',
                            position: 'relative',
                            zIndex: 5
                        }}
                    />

                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 18 * averageScale,
                            paddingRight: 32 * scaleX,
                            alignItems: "flex-start",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 * averageScale }}>
                            <span style={{ color: textColor, fontSize: 16 * averageScale, opacity: 0.7, minWidth: 35 * scaleX }}>
                                EXP
                            </span>
                            <span style={{ fontSize: scaledStatsFontSize, minWidth: 55 * scaleX, textAlign: "left", fontWeight: 600 }}>{stats.experience}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 * averageScale }}>
                            <span style={{ color: textColor, fontSize: 16 * averageScale, opacity: 0.7, minWidth: 35 * scaleX }}>
                                XP
                            </span>
                            <span style={{ fontSize: scaledStatsFontSize, minWidth: 55 * scaleX, textAlign: "left", fontWeight: 600 }}>{stats.Xp}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 * averageScale }}>
                            <span style={{ color: textColor, fontSize: 16 * averageScale, opacity: 0.7, minWidth: 35 * scaleX }}>
                                FOL
                            </span>
                            <span style={{ fontSize: scaledStatsFontSize, minWidth: 55 * scaleX, textAlign: "left", fontWeight: 600 }}>{stats.follower}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
