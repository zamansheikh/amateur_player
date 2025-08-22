'use client';
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
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
};

// Utility function to calculate relative luminance
const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Utility function to process color input
const processColor = (color: string): RGB => {
  const tailwindColorMap: { [key: string]: string } = {
    'blue-500': '#3b82f6',
    'red-500': '#ef4444',
    'green-500': '#10b981',
  };

  if (tailwindColorMap[color]) {
    return hexToRgb(tailwindColorMap[color]);
  }

  if (color.match(/^#[0-9A-F]{3,6}$/i)) {
    return hexToRgb(color);
  }

  const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
    };
  }

  return { r: 255, g: 255, b: 255 };
};

const CARD_WIDTH = 368;
const CARD_HEIGHT = 551;

const PLAYER_IMAGE = "https://randomuser.me/api/portraits/men/32.jpg";

interface PlayerCardV2Props {
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
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
}

const PlayerCardV2: React.FC<PlayerCardV2Props> = ({
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
    primaryColor = "#8BC342",
    secondaryColor = "#385019",
    accentColor = "#75B11D",
}) => {
    const [textColor, setTextColor] = useState<string>('#FFFFFF');
    
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

    // Determine the image source
    const imageSrc = imageUrl || imagePath || PLAYER_IMAGE;
    
    useEffect(() => {
        // Calculate text color based on the primary color
        const { r, g, b } = processColor(primaryColor);
        const luminance = getLuminance(r, g, b);
        setTextColor(luminance > 0.3 ? '#1E2D5E' : '#FFFFFF');
    }, [primaryColor]);

    return (
        <div
            style={{
                width,
                height,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
            }}
        >
            {/* SVG Card Shape - New Design */}
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            >
                {/* Main Card Background */}
                <path 
                    d="M40.5117 60.8364C27.3077 69.8882 9.33557 74.7912 2 76.1113C3.42636 189.447 5.54553 422.454 2.6113 447.799C-0.322931 473.144 17.2824 482.875 26.4519 484.572L78.4122 500.978C142.965 514.556 176.22 538.317 184.778 548.5C200.427 523.155 285.846 498.338 326.599 489.098C357.408 484.119 365.926 466.657 366.333 458.548V76.1113C357.571 76.1113 331.978 69.3225 299.702 42.1672C267.425 15.0119 238.165 9.35455 227.569 9.92029C219.255 26.2135 202.913 21.235 195.781 16.7091L184.167 2L170.107 16.7091C154.947 25.7609 142.598 15.9548 138.319 9.92029C97.3624 10.486 57.0168 49.5217 40.5117 60.8364Z" 
                    fill={`url(#paint0_linear_${width}_${height})`} 
                    stroke={primaryColor} 
                    strokeWidth="2.02407"
                />
                
                {/* Secondary Layer */}
                <path 
                    d="M40.5117 60.8364C27.3077 69.8882 9.33557 74.7912 2 76.1113C3.42636 189.447 5.54553 422.454 2.6113 447.799C-0.322931 473.144 17.2824 482.875 26.4519 484.572L78.4122 500.978C142.965 514.556 176.22 538.317 184.778 548.5C200.427 523.155 285.846 498.338 326.599 489.098C357.408 484.119 365.926 466.657 366.333 458.548V76.1113C357.571 76.1113 331.978 69.3225 299.702 42.1672C267.425 15.0119 238.165 9.35455 227.569 9.92029C219.255 26.2135 202.913 21.235 195.781 16.7091L184.167 2L170.107 16.7091C154.947 25.7609 142.598 15.9548 138.319 9.92029C97.3624 10.486 57.0168 49.5217 40.5117 60.8364Z" 
                    fill={`url(#paint1_linear_${width}_${height})`}
                />
                
                {/* Border Stroke */}
                <path 
                    d="M44.5874 68.1677C31.7579 76.9627 14.2955 81.7267 7.16797 83.0093C8.55387 193.13 10.6129 419.529 7.76193 444.155C4.91092 468.781 22.017 478.236 30.9264 479.885L81.4129 495.826C144.135 509.019 176.447 532.106 184.762 542C199.967 517.374 282.963 493.261 322.561 484.283C352.496 479.445 360.772 462.478 361.168 454.599V83.0093C352.655 83.0093 327.787 76.413 296.426 50.0279C265.065 23.6429 236.634 18.146 226.339 18.6957C218.261 34.5267 202.383 29.6894 195.453 25.2919L184.168 11L170.507 25.2919C155.777 34.087 143.779 24.559 139.621 18.6957C99.8257 19.2453 60.6243 57.1739 44.5874 68.1677Z" 
                    stroke={secondaryColor} 
                    strokeWidth="2.02407"
                />
                
                {/* Left Side Accent */}
                <path 
                    d="M119 311H27V67.1064C31.4675 65.1128 35.9297 62.7507 39.9395 60.002C44.0315 57.1967 49.6006 52.6724 56.375 47.3887C63.1258 42.1233 71.0236 36.1446 79.6943 30.499C91.5999 22.7473 105.023 15.5833 119 11.7705V311Z" 
                    fill={`url(#paint2_linear_${width}_${height})`}
                />
                
                <defs>
                    <linearGradient 
                        id={`paint0_linear_${width}_${height}`} 
                        x1="170.565" 
                        y1="-151.114" 
                        x2="177.093" 
                        y2="548.566" 
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={secondaryColor}/>
                        <stop offset="1" stopColor={accentColor}/>
                    </linearGradient>
                    <linearGradient 
                        id={`paint1_linear_${width}_${height}`} 
                        x1="170.565" 
                        y1="-151.114" 
                        x2="177.093" 
                        y2="548.566" 
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={secondaryColor}/>
                        <stop offset="1" stopColor={accentColor}/>
                    </linearGradient>
                    <linearGradient 
                        id={`paint2_linear_${width}_${height}`} 
                        x1="73" 
                        y1="466.501" 
                        x2="66.8173" 
                        y2="-6.91828" 
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor={primaryColor} stopOpacity="0"/>
                        <stop offset="1" stopColor="#111B05"/>
                    </linearGradient>
                </defs>
            </svg>

            {/* Card Content - Copied from V1 PlayerCard */}
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
                    color: textColor,
                }}
            >
                {/* Level - Moved more to the right */}
                <div
                    style={{ position: "absolute", top: 80 * scaleY, left: 40 * scaleX, textAlign: "left" }}
                >
                    <div style={{ fontSize: 20 * averageScale, fontWeight: 600, color: textColor }}>
                        LEVEL
                    </div>
                    <div
                        style={{
                            fontSize: scaledLevelFontSize,
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1,
                        }}
                    >
                        {level<10 ? `0${level}` : level}
                    </div>
                </div>

                {/* Follow Button - Better alignment and reduced radius */}
                <div
                    style={{
                        position: "absolute",
                        top: 190 * scaleY,
                        left: 40 * scaleX,
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        color: textColor === '#1E2D5E' ? '#1E2D5E' : primaryColor,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 12 * averageScale,
                        padding: `${6 * averageScale}px ${8 * averageScale}px`,
                        borderRadius: `${8 * averageScale}px`,
                        display: "flex",
                        alignItems: "center",
                        gap: 4 * averageScale,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <span style={{ fontSize: 14 * averageScale, fontWeight: 700 }}>+</span>
                    Follow
                </div>

                {/* Player Image - Right-aligned with blue glow effect */}
                <div
                    style={{
                        position: "absolute",
                        top: 60 * scaleY,
                        right: 30 * scaleX,
                        width: scaledImageWidth * 0.75,
                        height: scaledImageHeight * 1.2,
                        borderRadius: 12 * averageScale,
                        overflow: "hidden",
                        zIndex: 3,
                    }}
                >
                    <img
                        src={imageSrc}
                        alt={name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    {/* Blue glow effect at bottom */}
                    {/* <div
                        style={{
                            position: "absolute",
                            bottom: -10,
                            left: -10,
                            right: 0,
                            height: "40%",
                            background: `linear-gradient(to top, rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.3), transparent)`,
                            pointerEvents: "none"
                        }}
                    /> */}
                </div>

                {/* Name with glow spread effect - UPPERCASE and larger */}
                <div
                    style={{
                        position: "absolute",
                        top: 250 * scaleY,
                        left: 10 * scaleX,
                        width: "95%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: `${16 * averageScale}px ${scaledPadding}px ${8 * averageScale}px ${scaledPadding}px`,
                        fontWeight: 700,
                        fontSize: scaledFontSize * 1.5, // Larger font
                        color: textColor,
                        zIndex: 10,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "95%",
                        lineHeight: 1.1,
                    }}
                    title={name}
                >
                    <span
                        style={{
                            textTransform: "uppercase",
                            textShadow: `
                                0 0 10px rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.8),
                                0 0 20px rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.6),
                                0 0 30px rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.4),
                                0 0 40px rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.3),
                                0 0 50px rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.2)
                            `,
                            filter: `drop-shadow(0 0 15px rgba(${hexToRgb(primaryColor).r}, ${hexToRgb(primaryColor).g}, ${hexToRgb(primaryColor).b}, 0.7))`,
                            display: "inline-block",
                            maxWidth: "100%",
                            verticalAlign: "top",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {name}
                    </span>
                    
                    {/* Horizontal divider after name */}
                    <div
                        style={{
                            width: "80%",
                            height: "2px",
                            background: textColor,
                            marginTop: 8 * averageScale,
                            opacity: 0.6,
                            borderRadius: "1px",
                        }}
                    />
                </div>

                {/* Stats Grid - Exact copy from V1 */}
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

                    {/* Vertical Divider - Same as V1 */}
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

                {/* Bottom horizontal divider */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 60 * scaleY,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "15%",
                        height: "1.5px",
                        background: textColor,
                        opacity: 0.4,
                        borderRadius: "1px",
                    }}
                />
            </div>
        </div>
    );
};

export default PlayerCardV2;
