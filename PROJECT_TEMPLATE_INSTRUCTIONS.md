# BowlersNetwork Project Template - Complete Replication Guide

This document provides comprehensive instructions for replicating the BowlersNetwork project structure, design system, authentication approach, and technical implementation in future projects.

## 📋 Table of Contents
1. [Color System & Design Guidelines](#color-system--design-guidelines)
2. [Project Structure & Architecture](#project-structure--architecture)
3. [Authentication System](#authentication-system)
4. [API Integration](#api-integration)
5. [Styling & Theme Configuration](#styling--theme-configuration)
6. [Navigation Component Pattern](#navigation-component-pattern)
7. [Image Optimization Configuration](#image-optimization-configuration)
8. [Dashboard Components Pattern](#dashboard-components-pattern)
9. [Development & Build Setup](#development--build-setup)
10. [Best Practices Summary](#best-practices-summary)

---

## 🎨 Color System & Design Guidelines

### Primary Color Palette
```css
/* Main Brand Colors */
--primary-green: #8BC342;
--primary-green-dark: #6fa332;
--gradient-primary: linear-gradient(to right, #8BC342, #6fa332);

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-600: #4b5563;
--gray-900: #111827;
--white: #ffffff;
```

### Design System Rules
1. **Primary Action Color**: Always use `#8BC342` (green) for primary buttons, active states, and key UI elements
2. **Gradients**: Use `linear-gradient(to right, #8BC342, #6fa332)` for headers, special sections, and emphasis
3. **Success States**: Use the same green (`#8BC342`) for success messages, completed actions, and positive feedback
4. **Hover States**: Darken primary colors by 10-15% or use `#6fa332`
5. **Background**: Light theme with `#f9fafb` as main background, white cards with shadow
6. **Typography**: Dark gray (`#111827`) for main text, lighter grays for secondary text

### Component Styling Patterns
```tsx
// Primary Button
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"

// Card Component
className="bg-white rounded-lg shadow-lg p-6"

// Icon with Background
className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"

// Status Badge
className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
```

## 🏗️ Project Structure & Architecture

### Core Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx          # Home page
│   ├── dashboard/         # Dashboard section
│   ├── auth/             # Authentication pages
│   └── api/              # API routes (Next.js)
├── components/            # Reusable UI components
│   ├── ClientLayout.tsx  # Client-side layout wrapper
│   ├── Navigation.tsx    # Main navigation component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state management
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client setup
│   └── mockData.ts      # Development mock data
└── types/               # TypeScript type definitions
    └── index.ts         # Centralized type exports
```

### Dependencies (package.json)
```json
{
  "dependencies": {
    "axios": "^1.10.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.516.0",
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.3",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## 🔐 Authentication System

### AuthContext Implementation
```tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id?: number;
  email?: string;
  username?: string;
  name: string;
  authenticated: boolean;
  access_token?: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signin: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check stored authentication on mount
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.authenticated) {
            setUser({ ...userData, access_token: storedToken });
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signin = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Call your authentication API
      const response = await axios.post('/api/auth/login', {
        username: emailOrUsername,
        password: password
      });

      if (response.data && response.data.access_token) {
        const { access_token } = response.data;
        
        // Store token
        localStorage.setItem('access_token', access_token);
        
        // Fetch user profile
        const profileResponse = await axios.get('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${access_token}` }
        });

        const userData: User = {
          ...profileResponse.data,
          authenticated: true,
          access_token: access_token
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/signin');
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/api/auth/signup', {
        name,
        username,
        email,
        password
      });

      if (response.status === 201) {
        // Auto-login after successful signup
        return await signin(email, password);
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Protected Route Component
```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.authenticated)) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-green-600">Loading...</div>
      </div>
    );
  }

  if (!user || !user.authenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## 🌐 API Integration

### API Client Setup (lib/api.ts)
```tsx
import axios from 'axios';

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API functions
export const userApi = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};
```

### API Proxy Setup (Next.js API Routes)

Create `/src/app/api/auth/login/route.ts`:
```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward to external API
    const response = await fetch('https://your-api.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🎨 Styling & Theme Configuration

### Global CSS (app/globals.css)
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #8BC342;
  --primary-dark: #6fa332;
}

/* Force light theme */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #ffffff;
    --foreground: #171717;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
}

* {
  color-scheme: light;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #8BC342;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6fa332;
}
```

### Tailwind Configuration
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8BC342',
          dark: '#6fa332',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
}
```

## 📱 Navigation Component Pattern

### Main Navigation Structure
```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, BarChart3, MessageCircle, Settings, Bell, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signout } = useAuth();

  // Public routes
  const publicRoutes = ['/signin', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar implementation */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow bg-white border-r">
              {/* Logo */}
              <div className="flex items-center gap-3 px-6 py-4 border-b">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                     style={{ background: 'linear-gradient(to right, #8BC342, #6fa332)' }}>
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">BowlersNet</span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-600 border-r-2 border-green-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile */}
              <div className="px-4 py-4 border-t">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(to right, #8BC342, #6fa332)' }}>
                    <span className="text-white font-medium text-sm">
                      {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={signout}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

## 🖼️ Image Optimization Configuration

### Next.js Config (next.config.ts)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.com',
        port: '',
        pathname: '/**',
      },
      // Add other image domains as needed
    ],
  },
  // Enable experimental features if needed
  experimental: {
    turbo: {
      // Turbopack configuration
    }
  }
};

export default nextConfig;
```

### Image Component Usage
```tsx
import Image from 'next/image';

// Proper Next.js Image usage
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={400}
  height={300}
  className="rounded-lg"
  priority={false} // Set to true for above-the-fold images
/>

// For user avatars with fallback
{user.avatar ? (
  <Image
    src={user.avatar}
    alt={`${user.name} avatar`}
    width={40}
    height={40}
    className="rounded-full"
  />
) : (
  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
    <span className="text-white font-medium">
      {user.name.split(' ').map(n => n[0]).join('')}
    </span>
  </div>
)}
```

## 📊 Dashboard Components Pattern

### Metrics Card Component
```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: 'green' | 'blue' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, color = 'green', trend }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color === 'green' ? 'text-green-600' : 'text-gray-900'}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 🔧 Development & Build Setup

### Scripts (package.json)
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Environment Variables (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api.com/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Deployment Checklist

1. **Environment Setup**
   - [ ] Configure production API URLs
   - [ ] Set up proper authentication secrets
   - [ ] Configure image domains

2. **Performance Optimization**
   - [ ] Enable Next.js image optimization
   - [ ] Configure proper caching headers
   - [ ] Optimize bundle size

3. **Security**
   - [ ] Implement proper CORS policies
   - [ ] Secure API endpoints
   - [ ] Validate all user inputs

4. **Monitoring**
   - [ ] Set up error tracking
   - [ ] Configure analytics
   - [ ] Monitor API performance

## 📝 Best Practices Summary

1. **Component Architecture**
   - Keep components small and focused
   - Use TypeScript for type safety
   - Implement proper error boundaries

2. **State Management**
   - Use React Context for global state
   - Keep local state in components when possible
   - Implement proper loading states

3. **API Integration**
   - Use axios interceptors for auth
   - Implement proper error handling
   - Use Next.js API routes for proxying

4. **Styling**
   - Maintain consistent color scheme
   - Use Tailwind utility classes
   - Implement responsive design

5. **User Experience**
   - Show loading states
   - Provide proper feedback
   - Handle errors gracefully

## 🔄 Copy-to-Clipboard Implementation

### Utility Function
```tsx
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};
```

### Usage Example
```tsx
const [copySuccess, setCopySuccess] = useState(false);

const handleCopy = async () => {
  const success = await copyToClipboard(referralLink);
  if (success) {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }
};

<button
  onClick={handleCopy}
  className={`px-4 py-2 rounded-lg transition-colors ${
    copySuccess 
      ? 'bg-green-600 text-white' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }`}
>
  {copySuccess ? '✓ Copied!' : 'Copy Link'}
</button>
```

## 🎯 Layout Architecture

### Root Layout (app/layout.tsx)
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your App - Professional Platform",
  description: "Professional platform description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
```

### Client Layout (components/ClientLayout.tsx)
```tsx
'use client';

import Navigation from '@/components/Navigation';
import { AuthProvider } from '@/contexts/AuthContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <Navigation>
        {children}
      </Navigation>
    </AuthProvider>
  );
}
```

## 🎨 Additional Styling Guidelines

### Gradient Implementations
```css
/* Primary brand gradient - use for headers and emphasis */
background: linear-gradient(to right, #8BC342, #6fa332);

/* Success notification gradient */
background: linear-gradient(to right, #10b981, #059669);

/* Card hover effect */
box-shadow: 0 10px 25px -5px rgba(139, 195, 66, 0.1);
```

### Button Variants
```tsx
// Primary button
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"

// Secondary button
className="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"

// Success state button
className="bg-green-600 text-white px-4 py-2 rounded-lg opacity-100"

// Disabled button
className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
```

### Icon Color Consistency
```tsx
// Primary icons
className="w-5 h-5 text-green-600"

// Secondary icons
className="w-5 h-5 text-gray-600"

// Success icons
className="w-5 h-5 text-green-600"

// Warning icons
className="w-5 h-5 text-yellow-600"
```

## 🔑 TypeScript Type Definitions Template

### Base User Types
```tsx
interface User {
  id?: number;
  email?: string;
  username?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  authenticated: boolean;
  access_token?: string;
  stats?: UserStats;
}

interface UserStats {
  id: number;
  user_id: number;
  average_score: number;
  high_game: number;
  high_series: number;
  experience: number;
}
```

### API Response Types
```tsx
interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}
```

This comprehensive template now includes all the essential patterns, implementations, and guidelines needed to replicate the BowlersNetwork project structure and design approach in future projects. The color consistency, authentication flow, component architecture, and best practices are all documented and ready for implementation.
