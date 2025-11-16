export interface User {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
    cover_photo_url?: string;
    intro_video_url?: string;
    xp: number;
    email: string;
    email_verified?: boolean;
    level: number;
    card_theme: string;
    is_pro: boolean;
    is_complete?: boolean;
    follower_count: number;
    authenticated: boolean;
    access_token?: string;
    stats: UserStats;
    favorite_brands?: FavoriteBrand[];
    sponsors?: Sponsor[];
    // Personal Information
    age?: number;
    gender?: string;
    // Playing Style
    handedness?: string;
    thumb_style?: string;
    // Location Information
    address_str?: string;
    lat?: number | string;
    long?: number | string;
    home_center?: string;
    // USBC Information
    is_youth?: boolean;
    is_coach?: boolean;
    usbc_card_number?: string;
}

export interface FavoriteBrand {
    brand_id: number;
    brandType: string;
    name: string;
    formal_name: string;
    logo_url: string;
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
    signin: (username: string, password: string) => Promise<{ success: boolean; profileComplete?: boolean }>;
    signup: (userData: {
        basicInfo: {
            username: string;
            first_name: string;
            last_name: string;
            email: string;
            password: string;
            birth_date?: string;
            parent_first_name?: string;
            parent_last_name?: string;
            parent_email?: string;
        };
        brandIDs: number[];
    }) => Promise<boolean>;
    signout: () => void;
    refreshUser: () => Promise<void>;
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

export interface Sponsor {
    brand_id: number;
    brandType: string;
    name: string;
    formal_name: string;
    logo_url: string;
}

export interface Tournament {
    id: number;
    name: string;
    start_date: string;
    reg_deadline: string;
    address: string;
    lat?: string;
    long?: string;
    reg_fee: number;
    access_type: string;
    format: 'Singles' | 'Doubles' | 'Teams';
    already_enrolled: number;
    participants_count?: number;
    description?: string;
    status?: string;
    tournament_type: 'Handicap' | 'Scratch';
    average?: number;
    percentage?: number;
}

export interface TournamentTeam {
    display_name: string;
    profile_picture: string;
    players: TournamentPlayer[];
}

export interface TournamentPlayer {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url: string;
    intro_video_url?: string;
    cover_photo_url: string;
    xp: number;
    level: number;
    card_theme: string;
}
