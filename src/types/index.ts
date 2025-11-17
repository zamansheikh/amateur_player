export interface UserInfo {
    dob?: string;
    age?: number;
    gender?: string;
    address_str?: string;
    lat?: string;
    long?: string;
    home_center?: string;
    handedness?: string;
    thumb_style?: string;
    is_youth?: boolean;
    is_coach?: boolean;
    usbcCardNumber?: string;
    parentFirstName?: string;
    parentLastName?: string;
    parentEmail?: string;
}

export interface Brand {
    brand_id: number;
    brandType: string;
    name: string;
    formal_name: string;
    logo_url: string;
}

export interface UserStats {
    id: number;
    is_added: boolean;
    user_id: number;
    average_score: number;
    high_game: number;
    high_series: number;
    experience: number;
}

export interface User {
    user_id: number;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url?: string;
    intro_video_url?: string;
    cover_photo_url: string;
    xp?: number;
    level?: number;
    card_theme?: string;
    is_pro: boolean;
    sponsors?: Brand[];
    info?: UserInfo;
    follower_count?: number;
    stats?: UserStats;
    favorite_brands?: Brand[];
    is_complete: boolean;
    authenticated?: boolean;
    access_token?: string;
}

export interface Tournament {
    id: number;
    name: string;
    start_date: string;
    reg_deadline: string;
    format: string;
    reg_fee: number;
    address?: string;
    description?: string;
    max_participants?: number;
    prize_pool?: number;
    access_type?: string;
    already_enrolled?: number;
}

export interface TournamentTeam {
    display_name: string;
    profile_picture: string;
    players: Array<{
        user_id: number;
        name: string;
        profile_picture_url: string;
        level: number;
    }>;
}

export interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'green' | 'blue' | 'red';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signin: (username: string, password: string) => Promise<{ success: boolean; profileComplete?: boolean }>;
    privateLogin: (privateKey: string) => Promise<{ success: boolean; error?: string }>;
    signup: (userData: any) => Promise<boolean>;
    signout: () => void;
    refreshUser: () => Promise<void>;
}