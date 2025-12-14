export interface UserInfo {
    dob?: string;
    age?: number;
    gender?: string;
    address_str?: string;
    zipcode?: string;
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
    name: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    roles: {
        is_pro: boolean;
        is_center_admin: boolean;
        is_tournament_director: boolean;
    };
    xp: number;
    contact_info: {
        email: string;
        is_public: boolean;
        is_added: boolean;
    };
    gender_data: {
        role: string;
        is_public: boolean;
        is_added: boolean;
    };
    bio: {
        content: string;
        is_public: boolean;
        is_added: boolean;
    };
    birthdate_data: {
        date: string;
        age: number;
        is_public: boolean;
        is_added: boolean;
    };
    address_data: {
        address_str: string;
        zipcode: string;
        is_public: boolean;
        is_added: boolean;
    };
    profile_media: {
        profile_picture_url: string;
        cover_picture_url: string;
        intro_video_url: string;
    };
    home_center_data: {
        center: {
            id: number;
            name: string;
            logo: string;
            lanes: number;
            address_str: string;
            lat: string;
            long: string;
            zipcode: string;
            website_url: string;
            email: string;
            phone_number: string;
            admin: any;
        } | null;
        is_public: boolean;
        is_added: boolean;
    };
    ball_handling_style: {
        description: string;
        is_public: boolean;
        is_added: boolean;
    };
    follow_info: {
        follwers: number;
        followings: number;
    };
    favorite_brands: Brand[];
    
    // Client-side auth fields
    authenticated?: boolean;
    access_token?: string;
    is_complete?: boolean;
    
    // Legacy fields for compatibility (optional)
    id?: number;
    is_pro?: boolean;
    profile_picture_url?: string;
    cover_photo_url?: string;
    follower_count?: number;
    following_count?: number;
    level?: number;
    card_theme?: string;
    stats?: UserStats;
    info?: UserInfo;
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