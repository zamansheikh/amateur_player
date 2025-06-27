export interface User {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    xp: number;
    email: string;
    level: number;
    card_theme: string;
    is_pro: boolean;
    follower_count: number;
    authenticated: boolean;
    access_token?: string;
    stats: UserStats;
}

export interface UserStats {
    id: number;
    user_id: number;
    average_score: number;
    high_game: number;
    high_series: number;
    experience: number;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        per_page: number;
    };
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signin: (username: string, password: string) => Promise<boolean>;
    signup: (userData: {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }) => Promise<boolean>;
    signout: () => void;
}

export interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: 'green' | 'blue' | 'red';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export interface LoginResponse {
    access_token: string;
}

export interface SignupResponse {
    message: string;
}
