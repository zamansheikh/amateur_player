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
        hightSeries: number;
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
        hightSeries: 0,
        experience: 0,
        Xp: 0,
        follower: 0,
    },
    borderColor = "#EE2E55",
    backgroundColor = "white",
}) => {
    const [textColor, setTextColor] = useState<string>('black');
    
    // Determine the image source (URL takes priority over path)
    const imageSrc = imageUrl || imagePath || PLAYER_IMAGE;
    
    useEffect(() => {
        // Handle transparent background
        if (backgroundColor === "transparent") {
            setTextColor('black');
            return;
        }

        // Handle RGBA colors - extract RGB values for luminance calculation
        if (backgroundColor.startsWith('rgba(')) {
            const rgbaMatch = backgroundColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
            if (rgbaMatch) {
                const r = parseInt(rgbaMatch[1], 10);
                const g = parseInt(rgbaMatch[2], 10);
                const b = parseInt(rgbaMatch[3], 10);
                const luminance = getLuminance(r, g, b);
                setTextColor(luminance > 0.5 ? 'black' : 'white');
                return;
            }
        }

        // Process the color input to RGB
        const { r, g, b } = processColor(backgroundColor);

        // Calculate luminance
        const luminance = getLuminance(r, g, b);

        // Set text color based on luminance
        // Threshold of 0.5 is based on W3C accessibility guidelines
        setTextColor(luminance > 0.5 ? 'black' : 'white');
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
                    style={{ position: "absolute", top: 80, left: 24, textAlign: "left" }}
                >
                    <div style={{ fontSize: 20, fontWeight: 500, color: textColor }}>
                        Level
                    </div>
                    <div
                        style={{
                            fontSize: 56,
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
                        top: 60,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 280,
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 12,
                        zIndex: 3,
                        // boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                        // background: "#fff",
                    }}
                />
                {/* Name & Follow */}
                <div
                    style={{
                        position: "absolute",
                        top: 250,
                        left: 10,
                        width: "95%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: isTransparent || isRgbaColor ? "rgba(255, 255, 255, 0.95)" : effectiveBackgroundColor,
                        padding: "16px 24px 12px 24px",
                        fontWeight: 700,
                        fontSize: 22,
                        color: textColor,
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
                            color: textColor,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        <span style={{ fontSize: 20, color: textColor, fontWeight: 700 }}>
                            +
                        </span>{" "}
                        Follow
                    </button>
                </div>
                {/* Stats Grid */}
                <div
                    style={{
                        position: "absolute",
                        top: 320,
                        left: 0,
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        fontSize: 18,
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
                            gap: 18,
                            paddingLeft: 32,
                            alignItems: "flex-end",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 24, minWidth: 55, textAlign: "right", fontWeight: 600 }}>{stats.average}</span>
                            <span style={{ color: textColor, fontSize: 16, opacity: 0.7 , minWidth: 35, textAlign: "right" }}>
                                AVG
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 24, minWidth: 55, textAlign: "right", fontWeight: 600 }}>{stats.highGame}</span>
                            <span style={{ color: textColor, fontSize: 16, opacity: 0.7 ,  minWidth: 35, textAlign: "right"}}>
                                HG
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 24, minWidth: 55, textAlign: "right", fontWeight: 600 }}>{stats.hightSeries}</span>
                            <span style={{ color: textColor, fontSize: 16, opacity: 0.7,  minWidth: 35, textAlign: "right" }}>
                                HS
                            </span>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div
                        style={{ 
                            width: 2, 
                            background: textColor === 'white' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(30, 45, 94, 0.3)', 
                            margin: "0 16px",
                            borderRadius: "1px"
                        }}
                    />

                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                            paddingRight: 32,
                            alignItems: "flex-start",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: textColor, fontSize: 16, opacity: 0.7, minWidth: 35 }}>
                                EXP
                            </span>
                            <span style={{ fontSize: 24, minWidth: 55, textAlign: "left", fontWeight: 600 }}>{stats.experience}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: textColor, fontSize: 16, opacity: 0.7, minWidth: 35 }}>
                                XP
                            </span>
                            <span style={{ fontSize: 24, minWidth: 55, textAlign: "left", fontWeight: 600 }}>{stats.Xp}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: textColor, fontSize: 16, opacity: 0.7, minWidth: 35 }}>
                                FOL
                            </span>
                            <span style={{ fontSize: 24, minWidth: 55, textAlign: "left", fontWeight: 600 }}>{stats.follower}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
