'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Edit, ChevronDown, ChevronUp, AlertCircle, Lock, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api, userApi } from '@/lib/api';
import { Brand } from '@/types';
import UserPostCard from '@/components/UserPostCard';
import CreatePost from '@/components/CreatePost';

interface MapboxFeature {
    id: string;
    place_name: string;
    center: [number, number];
    text: string;
}

interface UserPost {
    metadata: {
        id: number;
        uid: string;
        post_privacy: string;
        total_likes: number;
        total_comments: number;
        created_at: string;
        updated_at: string;
        created: string;
        last_update: string;
        has_text: boolean;
        has_media: boolean;
        has_poll: boolean;
        has_event: boolean;
    };
    author: {
        user_id: number;
        name: string;
        profile_picture_url: string;
    };
    likes: {
        total: number;
        likers: Array<{
            user_id: number;
            name: string;
            profile_picture_url: string;
        }>;
    };
    comments: {
        total: number;
        comment_list: Array<{
            comment_id: number;
            user: {
                user_id: number;
                name: string;
                profile_picture_url: string;
            };
            text: string;
            pics: string[];
            replies: Array<{
                reply_id: number;
                user: {
                    user_id: number;
                    name: string;
                    profile_picture_url: string;
                };
                text: string;
                pics: string[];
            }>;
        }>;
    };
    caption: string;
    media: string[];
    poll: {
        id: number;
        uid: string;
        title: string;
        poll_type: string;
        options: Array<{
            option_id: number;
            content: string;
            vote: number;
            perc: number;
        }>;
    } | null;
    event: {
        id: number;
        title: string;
        date: string;
        location?: string;
    } | null;
    tags: string[];
    is_liked_by_me: boolean;
}

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ===== GROUP 1: GAME STATS =====
    const [isEditingGameStats, setIsEditingGameStats] = useState(false);
    const [isUpdatingGameStats, setIsUpdatingGameStats] = useState(false);
    const [gameStatsForm, setGameStatsForm] = useState({
        average_score: 0,
        high_game: 0,
        high_series: 0,
        experience: 0,
        handedness: '',
        thumb_style: ''
    });

    // ===== GROUP 2: USER INFO =====
    const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
    const [isUpdatingUserInfo, setIsUpdatingUserInfo] = useState(false);
    const [userInfoForm, setUserInfoForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        bio: '',
        dob: '',
        gender: '',
        address_str: '',
        zipcode: '',
        lat: '',
        long: '',
        home_center: '',
        handedness: '',
        thumb_style: '',
        is_youth: false,
        is_coach: false,
        usbcCardNumber: '',
        parentFirstName: '',
        parentLastName: '',
        parentEmail: ''
    });

    // Privacy settings state
    const [privacySettings, setPrivacySettings] = useState({
        bio: true,
        gender: true,
        birthdate: true,
        address: false,
    });

    // Address and center suggestion states
    const [addressSuggestions, setAddressSuggestions] = useState<MapboxFeature[]>([]);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [addressSearchQuery, setAddressSearchQuery] = useState('');
    const [homeCenterSearch, setHomeCenterSearch] = useState('');
    const [showCenterSuggestions, setShowCenterSuggestions] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const centerSuggestionsRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Mock bowling centers data
    const mockBowlingCenters = [
        { id: 1, name: 'Stone Lane Bowling Center', city: 'Los Angeles', state: 'CA', lat: 34.0522, long: -118.2437 },
        { id: 2, name: 'AMF Bowl Pasadena', city: 'Pasadena', state: 'CA', lat: 34.1478, long: -118.1445 },
        { id: 3, name: 'Lucky Strike Chatter', city: 'Hollywood', state: 'CA', lat: 34.1028, long: -118.3259 },
        { id: 4, name: 'Bowling Barn', city: 'Santa Monica', state: 'CA', lat: 34.0195, long: -118.4912 },
        { id: 5, name: 'The Bowling Alley', city: 'Downtown LA', state: 'CA', lat: 34.0522, long: -118.2451 }
    ];

    // Calculate age from DOB
    const calculateAge = (dobString: string): number => {
        if (!dobString) return 0;
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const userAge = userInfoForm.dob ? calculateAge(userInfoForm.dob) : 0;
    const is13to18 = userAge >= 13 && userAge < 18;
    const is18Plus = userAge >= 18;

    // Privacy toggle helper functions
    const getPrivacyIcon = (isPublic: boolean) => {
        return isPublic ? <Globe className="w-3 h-3 text-blue-500" /> : <Lock className="w-3 h-3 text-gray-400" />;
    };

    const togglePrivacy = (field: keyof typeof privacySettings) => {
        if (isEditingUserInfo) {
            setPrivacySettings(prev => ({
                ...prev,
                [field]: !prev[field]
            }));
        }
    };

    // Helper function to check if bowling statistics are incomplete
    const isGameStatsIncomplete = () => {
        return !user?.stats?.average_score ||
            !user?.stats?.high_game ||
            !user?.stats?.high_series ||
            !user?.stats?.experience ||
            !user?.info?.handedness ||
            !user?.info?.thumb_style;
    };

    // Helper function to check if personal information is incomplete
    const isUserInfoIncomplete = () => {
        return !user?.first_name ||
            !user?.last_name ||
            !user?.email ||
            !user?.info?.dob ||
            !user?.info?.gender ||
            !user?.info?.address_str ||
            !user?.info?.home_center ||
            !user?.info?.handedness ||
            !user?.info?.thumb_style;
    };

    // Helper function to check if sponsors/brands are incomplete
    const isSponsorsIncomplete = () => {
        if (user?.is_pro) {
            const sponsors = user?.favorite_brands?.filter(b => b.brandType === 'Business Sponsors') || [];
            return sponsors.length === 0;
        } else {
            return !user?.favorite_brands || user.favorite_brands.length === 0;
        }
    };



    // ===== GROUP 3: FAV BRANDS =====
    // (Read-only, no editing needed here)

    // UI State
    const [expandedGroups, setExpandedGroups] = useState({
        gameStats: true,
        userInfo: false,
        favBrands: true
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Brand selection state
    const [isEditingBrands, setIsEditingBrands] = useState(false);
    const [isUpdatingBrands, setIsUpdatingBrands] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState({
        balls: [] as number[],
        shoes: [] as number[],
        accessories: [] as number[],
        apparels: [] as number[]
    });
    const [brands, setBrands] = useState<{
        Balls: Array<{ brand_id: number; formal_name: string; logo_url: string }>;
        Shoes: Array<{ brand_id: number; formal_name: string; logo_url: string }>;
        Accessories: Array<{ brand_id: number; formal_name: string; logo_url: string }>;
        Apparels: Array<{ brand_id: number; formal_name: string; logo_url: string }>;
    } | null>(null);
    const [brandsLoading, setBrandsLoading] = useState(false);

    // Mapbox Geocoding API search function
    const searchAddress = async (query: string) => {
        if (!query.trim()) {
            setAddressSuggestions([]);
            return;
        }

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!mapboxToken) {
            console.error('Mapbox access token is not configured');
            return;
        }

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&types=address,place&limit=5`
            );
            const data = await response.json();

            if (data.features) {
                setAddressSuggestions(data.features);
                setShowAddressSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        }
    };

    // Handle address input change with debounce
    const handleAddressChange = (value: string) => {
        setAddressSearchQuery(value);
        setUserInfoForm(prev => ({ ...prev, address_str: value }));

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            searchAddress(value);
        }, 300);
    };

    // Handle address suggestion selection
    const handleSelectAddress = (suggestion: MapboxFeature) => {
        setUserInfoForm(prev => ({
            ...prev,
            address_str: suggestion.place_name
        }));
        setAddressSearchQuery(suggestion.place_name);
        setShowAddressSuggestions(false);
        setAddressSuggestions([]);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowAddressSuggestions(false);
            }
            if (
                centerSuggestionsRef.current &&
                !centerSuggestionsRef.current.contains(event.target as Node)
            ) {
                setShowCenterSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchUserPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user/posts');
            setPosts(response.data.posts);
            setError(null);
        } catch (err) {
            console.error('Error fetching user posts:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const loadBrands = async () => {
        try {
            setBrandsLoading(true);
            const response = await api.get('/api/brands');
            setBrands(response.data);
        } catch (error) {
            console.error('Error loading brands:', error);
        } finally {
            setBrandsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();

        // Initialize all forms with user data
        if (user) {
            // Combine all into 3 groups
            setGameStatsForm({
                average_score: user.stats?.average_score || 0,
                high_game: user.stats?.high_game || 0,
                high_series: user.stats?.high_series || 0,
                experience: user.stats?.experience || 0,
                handedness: user.info?.handedness || '',
                thumb_style: user.info?.thumb_style || ''
            });

            setUserInfoForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                username: user.username || '',
                bio: user.bio?.content || '',
                dob: user.birthdate_data?.date || '',
                gender: user.gender_data?.role || '',
                address_str: user.address_data?.address_str || '',
                zipcode: user.address_data?.zipcode || '',
                lat: '',
                long: '',
                home_center: user.home_center_data?.center?.name || '',
                handedness: user.ball_handling_style?.description?.toLowerCase().includes('right') ? 'right' : 
                           user.ball_handling_style?.description?.toLowerCase().includes('left') ? 'left' : '',
                thumb_style: user.ball_handling_style?.description?.toLowerCase().includes('two handed') ? 'no-thumb' : 'thumb',
                is_youth: false,
                is_coach: false,
                usbcCardNumber: '',
                parentFirstName: '',
                parentLastName: '',
                parentEmail: ''
            });

            // Set home center search to match home_center
            setHomeCenterSearch(user.home_center_data?.center?.name || '');
            setAddressSearchQuery(user.address_data?.address_str || '');

            // Initialize privacy settings from API response
            setPrivacySettings({
                bio: user.bio?.is_public ?? true,
                gender: user.gender_data?.is_public ?? true,
                birthdate: user.birthdate_data?.is_public ?? true,
                address: user.address_data?.is_public ?? false,
            });
        }
    }, [user]);

    // Load brands when user starts editing
    useEffect(() => {
        if (isEditingBrands && !brands) {
            loadBrands();
        }

        // Initialize selectedBrands from user's favorite_brands
        if (isEditingBrands && user?.favorite_brands) {
            const newSelectedBrands = {
                balls: [] as number[],
                shoes: [] as number[],
                accessories: [] as number[],
                apparels: [] as number[]
            };

            user.favorite_brands.forEach((brand: Brand) => {
                const categoryKey = (brand.brandType?.toLowerCase() || 'balls') as keyof typeof newSelectedBrands;
                if (categoryKey in newSelectedBrands) {
                    newSelectedBrands[categoryKey].push(brand.brand_id);
                }
            });

            setSelectedBrands(newSelectedBrands);
        }
    }, [isEditingBrands, brands, user?.favorite_brands]);

    // ===== GAME STATS HANDLERS =====
    const handleGameStatsFormChange = (field: string, value: string | boolean) => {
        setGameStatsForm(prev => ({
            ...prev,
            [field]: typeof value === 'boolean' ? value :
                (field === 'average_score' || field === 'high_game' || field === 'high_series' || field === 'experience') ?
                    (field === 'average_score' ? parseFloat(value) || 0 : parseInt(value) || 0) :
                    value
        }));
    }; const handleGameStatsUpdate = async () => {
        try {
            setIsUpdatingGameStats(true);
            setErrorMessage('');

            // Update stats
            const statsPayload = {
                average_score: parseFloat(gameStatsForm.average_score.toString()),
                high_game: parseInt(gameStatsForm.high_game.toString()),
                high_series: parseInt(gameStatsForm.high_series.toString()),
                experience: parseInt(gameStatsForm.experience.toString())
            };

            await api.post('api/user/stats/game-stats', statsPayload);

            // Update playing style
            if (gameStatsForm.handedness && gameStatsForm.thumb_style) {
                const stylePayload = {
                    handedness: gameStatsForm.handedness,
                    thumb_style: gameStatsForm.thumb_style
                };
                await userApi.updateUserInfo(stylePayload);
            }

            await refreshUser();
            setIsEditingGameStats(false);
            setSuccessMessage('Game stats updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: unknown) {
            console.error('Error updating game stats:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to update game stats';
            setErrorMessage(errorMsg);
        } finally {
            setIsUpdatingGameStats(false);
        }
    };

    // ===== USER INFO HANDLERS =====
    const handleUserInfoFormChange = (field: string, value: string | boolean | number) => {
        setUserInfoForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUserInfoUpdate = async () => {
        try {
            setIsUpdatingUserInfo(true);
            setErrorMessage('');

            // Update gender
            if (userInfoForm.gender) {
                await api.post(
                    '/api/profile/gender',
                    { 
                        role: userInfoForm.gender, 
                        is_public: privacySettings.gender 
                    }
                );
            }

            // Update bio
            if (userInfoForm.bio !== undefined) {
                await api.post(
                    '/api/profile/bio',
                    { 
                        bio: userInfoForm.bio, 
                        is_public: privacySettings.bio 
                    }
                );
            }

            // Update birthdate
            if (userInfoForm.dob) {
                await api.post(
                    '/api/profile/birth-date',
                    { 
                        date: userInfoForm.dob, 
                        is_public: privacySettings.birthdate 
                    }
                );
            }

            // Update address
            if (userInfoForm.address_str) {
                await api.post(
                    '/api/profile/address',
                    { 
                        address_str: userInfoForm.address_str,
                        zipcode: userInfoForm.zipcode || '',
                        lat: userInfoForm.lat || '0',
                        long: userInfoForm.long || '0',
                        is_public: privacySettings.address 
                    }
                );
            }

            // Update other user info (existing API)
            const payload: any = {
                dob: userInfoForm.dob,
                gender: userInfoForm.gender,
                address_str: userInfoForm.address_str,
                lat: userInfoForm.lat,
                long: userInfoForm.long,
                home_center: userInfoForm.home_center,
                handedness: userInfoForm.handedness,
                thumb_style: userInfoForm.thumb_style,
                is_youth: is13to18,
                is_coach: is18Plus && userInfoForm.is_coach ? userInfoForm.is_coach : false,
                usbcCardNumber: is18Plus && userInfoForm.is_coach ? userInfoForm.usbcCardNumber : '',
                parentFirstName: is13to18 ? userInfoForm.parentFirstName : '',
                parentLastName: is13to18 ? userInfoForm.parentLastName : '',
                parentEmail: is13to18 ? userInfoForm.parentEmail : ''
            };

            await api.post('/api/user/info', payload);

            await refreshUser();
            setIsEditingUserInfo(false);
            setSuccessMessage('User information updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: unknown) {
            console.error('Error updating user info:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to update user information';
            setErrorMessage(errorMsg);
        } finally {
            setIsUpdatingUserInfo(false);
        }
    };

    const handleBrandToggle = (category: keyof typeof selectedBrands, brandId: number) => {
        setSelectedBrands(prev => ({
            ...prev,
            [category]: prev[category].includes(brandId)
                ? prev[category].filter(id => id !== brandId)
                : [...prev[category], brandId]
        }));
    };

    const handleBrandsUpdate = async () => {
        try {
            setIsUpdatingBrands(true);
            setErrorMessage('');

            // Flatten all selected brand IDs into a single array
            const allBrandIDs = [
                ...selectedBrands.balls,
                ...selectedBrands.shoes,
                ...selectedBrands.accessories,
                ...selectedBrands.apparels
            ];

            // Call the API to update favorite brands
            await userApi.updateFavoriteBrands(allBrandIDs);

            await refreshUser();
            setIsEditingBrands(false);
            setSuccessMessage('Favorite brands updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error: unknown) {
            console.error('Error updating brands:', error);
            const errorMsg = error instanceof Error ? error.message : 'Failed to update favorite brands';
            setErrorMessage(errorMsg);
        } finally {
            setIsUpdatingBrands(false);
        }
    };

    const toggleGroup = (group: keyof typeof expandedGroups) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handlePostChange = (updatedPost: UserPost) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.metadata.id === updatedPost.metadata.id ? updatedPost : post
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Create Post Section */}
                        <CreatePost onPostCreated={fetchUserPosts} />

                        {/* Posts Feed */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading posts...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg mb-2">No posts yet</p>
                                    <p className="text-gray-400">Share your first bowling experience!</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <UserPostCard
                                        key={post.metadata.id}
                                        post={post}
                                        onPostUpdate={fetchUserPosts}
                                        onPostChange={handlePostChange}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Success/Error Messages */}
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{successMessage}</p>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* Profile Header */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <img
                                        src={user?.profile_picture_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer"}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.name || "User Name"}</h2>
                                <p className="text-green-600 font-medium">{user?.is_pro ? "Pro Player" : "Amateur Player"}</p>
                                <button
                                    onClick={() => router.push('/profile/edit')}
                                    className="text-green-600 text-sm hover:underline flex items-center justify-center gap-1 mx-auto mt-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Photos & Basic
                                </button>
                            </div>

                            {/* Level and EXP */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{user?.level !== undefined ? user.level : 'N/A'}</div>
                                    <div className="text-sm text-gray-600">Level</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{user?.xp !== undefined ? user.xp : 'N/A'}</div>
                                    <div className="text-sm text-gray-600">XP</div>
                                </div>
                            </div>
                        </div>

                        {/* ===== GROUP 1: GAME STATS ===== */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-l-yellow-400">
                            <button
                                onClick={() => toggleGroup('gameStats')}
                                className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-gray-900">Bowling Statistics</h3>
                                    {isGameStatsIncomplete() && (
                                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Incomplete</span>
                                        </div>
                                    )}
                                </div>
                                {expandedGroups.gameStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {expandedGroups.gameStats && (
                                <div className="border-t px-6 pb-6">
                                    {isEditingGameStats ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Average Score</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={gameStatsForm.average_score}
                                                    onChange={(e) => handleGameStatsFormChange('average_score', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    disabled={isUpdatingGameStats}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">High Game</label>
                                                <input
                                                    type="number"
                                                    value={gameStatsForm.high_game}
                                                    onChange={(e) => handleGameStatsFormChange('high_game', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    disabled={isUpdatingGameStats}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">High Series</label>
                                                <input
                                                    type="number"
                                                    value={gameStatsForm.high_series}
                                                    onChange={(e) => handleGameStatsFormChange('high_series', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    disabled={isUpdatingGameStats}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                                                <input
                                                    type="number"
                                                    value={gameStatsForm.experience}
                                                    onChange={(e) => handleGameStatsFormChange('experience', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    disabled={isUpdatingGameStats}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditingGameStats(false)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleGameStatsUpdate}
                                                    disabled={isUpdatingGameStats}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                                                >
                                                    {isUpdatingGameStats ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Avg. Score:</span>
                                                <span className="font-medium">{user?.stats?.average_score !== undefined ? Math.round(user.stats.average_score) : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">High Game:</span>
                                                <span className="font-medium">{user?.stats?.high_game !== undefined ? user.stats.high_game : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">High Series:</span>
                                                <span className="font-medium">{user?.stats?.high_series !== undefined ? user.stats.high_series : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Experience (yrs):</span>
                                                <span className="font-medium">{user?.stats?.experience !== undefined ? user.stats.experience : 'N/A'}</span>
                                            </div>
                                            <button
                                                onClick={() => setIsEditingGameStats(true)}
                                                className="w-full mt-4 text-green-600 text-sm hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ===== GROUP 2: USER INFO ===== */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-l-yellow-400">
                            <button
                                onClick={() => toggleGroup('userInfo')}
                                className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                    {isUserInfoIncomplete() && (
                                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Incomplete</span>
                                        </div>
                                    )}
                                </div>
                                {expandedGroups.userInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {expandedGroups.userInfo && (
                                <div className="border-t px-6 pb-6">
                                    {isEditingUserInfo ? (
                                        <div className="space-y-4">
                                            {/* Bio */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                                                    <button 
                                                        onClick={() => togglePrivacy('bio')}
                                                        className="hover:bg-gray-100 p-1 rounded transition flex items-center gap-1 text-xs text-gray-600"
                                                        type="button"
                                                    >
                                                        {getPrivacyIcon(privacySettings.bio)}
                                                        <span>{privacySettings.bio ? 'Public' : 'Private'}</span>
                                                    </button>
                                                </div>
                                                <textarea
                                                    value={userInfoForm.bio}
                                                    onChange={(e) => handleUserInfoFormChange('bio', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                                                    disabled={isUpdatingUserInfo}
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>

                                            {/* Date of Birth */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                                    <button 
                                                        onClick={() => togglePrivacy('birthdate')}
                                                        className="hover:bg-gray-100 p-1 rounded transition flex items-center gap-1 text-xs text-gray-600"
                                                        type="button"
                                                    >
                                                        {getPrivacyIcon(privacySettings.birthdate)}
                                                        <span>{privacySettings.birthdate ? 'Public' : 'Private'}</span>
                                                    </button>
                                                </div>
                                                <input
                                                    type="date"
                                                    value={userInfoForm.dob ? userInfoForm.dob.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const dateStr = e.target.value;
                                                        if (dateStr) {
                                                            const selectedDate = new Date(dateStr);
                                                            const today = new Date();
                                                            let age = today.getFullYear() - selectedDate.getFullYear();
                                                            const monthDiff = today.getMonth() - selectedDate.getMonth();
                                                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                                                                age--;
                                                            }

                                                            // Only allow if user is 13 or older
                                                            if (age >= 13) {
                                                                const isoString = selectedDate.toISOString();
                                                                handleUserInfoFormChange('dob', isoString);
                                                            } else {
                                                                alert('Users must be at least 13 years old to use this platform.');
                                                            }
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    disabled={isUpdatingUserInfo}
                                                    max={new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]}
                                                />
                                                {userAge > 0 && (
                                                    <p className="mt-1 text-sm text-gray-600">Age: {userAge} years old</p>
                                                )}
                                            </div>

                                            {/* Gender */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                                    <button 
                                                        onClick={() => togglePrivacy('gender')}
                                                        className="hover:bg-gray-100 p-1 rounded transition flex items-center gap-1 text-xs text-gray-600"
                                                        type="button"
                                                    >
                                                        {getPrivacyIcon(privacySettings.gender)}
                                                        <span>{privacySettings.gender ? 'Public' : 'Private'}</span>
                                                    </button>
                                                </div>
                                                <select
                                                    value={userInfoForm.gender}
                                                    onChange={(e) => handleUserInfoFormChange('gender', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                    disabled={isUpdatingUserInfo}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Man">Man</option>
                                                    <option value="Woman">Woman</option>
                                                </select>
                                            </div>
                                            {/* Address with Mapbox */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                                    <button 
                                                        onClick={() => togglePrivacy('address')}
                                                        className="hover:bg-gray-100 p-1 rounded transition flex items-center gap-1 text-xs text-gray-600"
                                                        type="button"
                                                    >
                                                        {getPrivacyIcon(privacySettings.address)}
                                                        <span>{privacySettings.address ? 'Public' : 'Private'}</span>
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={userInfoForm.address_str}
                                                        onChange={(e) => handleAddressChange(e.target.value)}
                                                        onFocus={() => userInfoForm.address_str && setShowAddressSuggestions(true)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                        disabled={isUpdatingUserInfo}
                                                        placeholder="Enter your address"
                                                        autoComplete="off"
                                                    />
                                                    {showAddressSuggestions && addressSuggestions.length > 0 && (
                                                        <div
                                                            ref={suggestionsRef}
                                                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                                        >
                                                            {addressSuggestions.map((suggestion) => (
                                                                <div
                                                                    key={suggestion.id}
                                                                    onClick={() => {
                                                                        setUserInfoForm(prev => ({
                                                                            ...prev,
                                                                            address_str: suggestion.place_name,
                                                                            lat: suggestion.center[1].toString(),
                                                                            long: suggestion.center[0].toString()
                                                                        }));
                                                                        setAddressSearchQuery(suggestion.place_name);
                                                                        setShowAddressSuggestions(false);
                                                                        setAddressSuggestions([]);
                                                                    }}
                                                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0"
                                                                >
                                                                    <div className="text-sm text-gray-900">{suggestion.place_name}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">Location will be saved automatically</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Handedness</label>
                                                    <select
                                                        value={userInfoForm.handedness || ''}
                                                        onChange={(e) => handleUserInfoFormChange('handedness', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                        disabled={isUpdatingUserInfo}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="right">Right</option>
                                                        <option value="left">Left</option>
                                                        <option value="both">Both</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumb Style</label>
                                                    <select
                                                        value={userInfoForm.thumb_style || ''}
                                                        onChange={(e) => handleUserInfoFormChange('thumb_style', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                        disabled={isUpdatingUserInfo}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="thumb">Thumb</option>
                                                        <option value="no-thumb">No Thumb</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Home Bowling Center</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={homeCenterSearch}
                                                        onChange={(e) => {
                                                            setHomeCenterSearch(e.target.value);
                                                            setShowCenterSuggestions(e.target.value.length > 0);
                                                        }}
                                                        onFocus={() => setShowCenterSuggestions(true)}
                                                        onBlur={() => setTimeout(() => setShowCenterSuggestions(false), 200)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                        disabled={isUpdatingUserInfo}
                                                        placeholder="Search or select a bowling center"
                                                        autoComplete="off"
                                                    />
                                                    {showCenterSuggestions && (
                                                        <div
                                                            ref={centerSuggestionsRef}
                                                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                                        >
                                                            {mockBowlingCenters
                                                                .filter(center =>
                                                                    center.name.toLowerCase().includes(homeCenterSearch.toLowerCase()) ||
                                                                    center.city.toLowerCase().includes(homeCenterSearch.toLowerCase())
                                                                )
                                                                .map((center) => (
                                                                    <div
                                                                        key={center.id}
                                                                        onClick={() => {
                                                                            setUserInfoForm(prev => ({
                                                                                ...prev,
                                                                                home_center: center.name
                                                                            }));
                                                                            setHomeCenterSearch(center.name);
                                                                            setShowCenterSuggestions(false);
                                                                        }}
                                                                        className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0"
                                                                    >
                                                                        <div className="text-sm font-medium text-gray-900">{center.name}</div>
                                                                        <div className="text-xs text-gray-500">{center.city}, {center.state}</div>
                                                                    </div>
                                                                ))}
                                                            {mockBowlingCenters.filter(center =>
                                                                center.name.toLowerCase().includes(homeCenterSearch.toLowerCase()) ||
                                                                center.city.toLowerCase().includes(homeCenterSearch.toLowerCase())
                                                            ).length === 0 && homeCenterSearch && (
                                                                    <div className="px-4 py-3 text-sm text-gray-500">
                                                                        No bowling centers found. You can still enter a custom name.
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Parent Information (for ages 13-18) */}
                                            {is13to18 && (
                                                <div className="border-t-2 border-yellow-300 pt-4 mt-4">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3 bg-yellow-50 p-2 rounded">Parent/Guardian Information</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent First Name</label>
                                                            <input
                                                                type="text"
                                                                value={userInfoForm.parentFirstName}
                                                                onChange={(e) => handleUserInfoFormChange('parentFirstName', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                                disabled={isUpdatingUserInfo}
                                                                placeholder="First name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Last Name</label>
                                                            <input
                                                                type="text"
                                                                value={userInfoForm.parentLastName}
                                                                onChange={(e) => handleUserInfoFormChange('parentLastName', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                                disabled={isUpdatingUserInfo}
                                                                placeholder="Last name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">Parent Email</label>
                                                        <input
                                                            type="email"
                                                            value={userInfoForm.parentEmail}
                                                            onChange={(e) => handleUserInfoFormChange('parentEmail', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                            disabled={isUpdatingUserInfo}
                                                            placeholder="Parent email"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Coach & USBC Information (for ages 18+) */}
                                            {is18Plus && (
                                                <div className="border-t-2 border-blue-300 pt-4 mt-4">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3 bg-blue-50 p-2 rounded">Professional Information</h4>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <input
                                                            type="checkbox"
                                                            id="is_coach"
                                                            checked={userInfoForm.is_coach}
                                                            onChange={(e) => handleUserInfoFormChange('is_coach', e.target.checked)}
                                                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                            disabled={isUpdatingUserInfo}
                                                        />
                                                        <label htmlFor="is_coach" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                            Are you a coach?
                                                        </label>
                                                    </div>

                                                    {userInfoForm.is_coach && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">USBC Card Number</label>
                                                            <input
                                                                type="text"
                                                                value={userInfoForm.usbcCardNumber}
                                                                onChange={(e) => handleUserInfoFormChange('usbcCardNumber', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                                                disabled={isUpdatingUserInfo}
                                                                placeholder="Enter USBC card number"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => setIsEditingUserInfo(false)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUserInfoUpdate}
                                                    disabled={isUpdatingUserInfo}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                                                >
                                                    {isUpdatingUserInfo ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-gray-600 shrink-0 mr-4">Bio:</span>
                                                <span className="font-medium text-right">{user?.bio?.content || 'No bio added'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Date of Birth:</span>
                                                <span className="font-medium">{user?.birthdate_data?.date ? new Date(user.birthdate_data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'} (Age: {user?.birthdate_data?.age || 'N/A'})</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Gender:</span>
                                                <span className="font-medium capitalize">{user?.gender_data?.role || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Address:</span>
                                                <span className="font-medium text-sm">{user?.address_data?.address_str || 'Not set'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Home Center:</span>
                                                <span className="font-medium">{user?.home_center_data?.center?.name || 'Not set'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Handedness:</span>
                                                <span className="font-medium capitalize">{user?.ball_handling_style?.description || 'Not set'}</span>
                                            </div>
                                            {user?.info?.is_youth && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                                                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">Parent/Guardian Information</h4>
                                                    <div className="space-y-1 text-sm text-yellow-700">
                                                        <p><span className="font-medium">Name:</span> {user.info.parentFirstName} {user.info.parentLastName}</p>
                                                        <p><span className="font-medium">Email:</span> {user.info.parentEmail}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {user?.info?.is_coach && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Coach Information</h4>
                                                    <p className="text-sm text-blue-700"><span className="font-medium">USBC Card:</span> {user.info.usbcCardNumber || 'Not provided'}</p>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setIsEditingUserInfo(true)}
                                                className="w-full mt-4 text-green-600 text-sm hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ===== GROUP 3: FAV BRANDS ===== */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-l-yellow-400">
                            <button
                                onClick={() => toggleGroup('favBrands')}
                                className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{user?.is_pro ? "Sponsors" : "Favorite Brands"}</h3>
                                    {isSponsorsIncomplete() && (
                                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Incomplete</span>
                                        </div>
                                    )}
                                </div>
                                {expandedGroups.favBrands ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            {expandedGroups.favBrands && (
                                <div className="border-t px-6 pb-6">
                                    {user?.is_pro ? (
                                        <div>
                                            {user?.favorite_brands && user.favorite_brands.filter(b => b.brandType === 'Business Sponsors').length > 0 ? (
                                                <div className="space-y-3">
                                                    {user.favorite_brands.filter(b => b.brandType === 'Business Sponsors').map((sponsor: Brand) => (
                                                        <div key={sponsor.brand_id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                                            <Image
                                                                src={sponsor.logo_url}
                                                                alt={`${sponsor.formal_name} logo`}
                                                                width={32}
                                                                height={32}
                                                                className="object-contain"
                                                            />
                                                            <span className="text-sm text-gray-700 flex-1">{sponsor.formal_name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-500 text-sm">No sponsors yet</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : isEditingBrands ? (
                                        <div className="space-y-6">
                                            {brandsLoading ? (
                                                <div className="flex justify-center py-8">
                                                    <div className="text-gray-500">Loading brands...</div>
                                                </div>
                                            ) : brands ? (
                                                <>
                                                    {/* Ball Brands */}
                                                    {brands.Balls && brands.Balls.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800 mb-3">Ball Brands</h4>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {brands.Balls.map((brand) => (
                                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedBrands.balls.includes(brand.brand_id)}
                                                                            onChange={() => handleBrandToggle('balls', brand.brand_id)}
                                                                            disabled={isUpdatingBrands}
                                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                        />
                                                                        <Image
                                                                            src={brand.logo_url}
                                                                            alt={`${brand.formal_name} logo`}
                                                                            width={32}
                                                                            height={32}
                                                                            className="object-contain"
                                                                        />
                                                                        <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Shoes */}
                                                    {brands.Shoes && brands.Shoes.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800 mb-3">Shoes</h4>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {brands.Shoes.map((brand) => (
                                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedBrands.shoes.includes(brand.brand_id)}
                                                                            onChange={() => handleBrandToggle('shoes', brand.brand_id)}
                                                                            disabled={isUpdatingBrands}
                                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                        />
                                                                        <Image
                                                                            src={brand.logo_url}
                                                                            alt={`${brand.formal_name} logo`}
                                                                            width={32}
                                                                            height={32}
                                                                            className="object-contain"
                                                                        />
                                                                        <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Accessories */}
                                                    {brands.Accessories && brands.Accessories.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800 mb-3">Accessories</h4>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {brands.Accessories.map((brand) => (
                                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedBrands.accessories.includes(brand.brand_id)}
                                                                            onChange={() => handleBrandToggle('accessories', brand.brand_id)}
                                                                            disabled={isUpdatingBrands}
                                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                        />
                                                                        <Image
                                                                            src={brand.logo_url}
                                                                            alt={`${brand.formal_name} logo`}
                                                                            width={32}
                                                                            height={32}
                                                                            className="object-contain"
                                                                        />
                                                                        <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Apparel */}
                                                    {brands.Apparels && brands.Apparels.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800 mb-3">Apparel</h4>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {brands.Apparels.map((brand) => (
                                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedBrands.apparels.includes(brand.brand_id)}
                                                                            onChange={() => handleBrandToggle('apparels', brand.brand_id)}
                                                                            disabled={isUpdatingBrands}
                                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                                        />
                                                                        <Image
                                                                            src={brand.logo_url}
                                                                            alt={`${brand.formal_name} logo`}
                                                                            width={32}
                                                                            height={32}
                                                                            className="object-contain"
                                                                        />
                                                                        <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500">Failed to load brands</p>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditingBrands(false)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleBrandsUpdate}
                                                    disabled={isUpdatingBrands}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-2 px-3 rounded-lg transition-colors"
                                                >
                                                    {isUpdatingBrands ? 'Saving...' : 'Save Brands'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {user?.favorite_brands && user.favorite_brands.length > 0 ? (
                                                <>
                                                    {['Balls', 'Shoes', 'Accessories', 'Apparels'].map((brandType) => {
                                                        const brandsOfType = user.favorite_brands?.filter((brand: Brand) => brand.brandType === brandType) || [];
                                                        if (brandsOfType.length === 0) return null;

                                                        return (
                                                            <div key={brandType}>
                                                                <h4 className="text-sm font-medium text-gray-700 mb-2">{brandType}</h4>
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    {brandsOfType.map((brand: Brand) => (
                                                                        <div key={brand.brand_id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                                                                            <Image
                                                                                src={brand.logo_url}
                                                                                alt={`${brand.formal_name} logo`}
                                                                                width={32}
                                                                                height={32}
                                                                                className="object-contain"
                                                                            />
                                                                            <span className="text-sm text-gray-700 flex-1">{brand.formal_name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <button
                                                        onClick={() => setIsEditingBrands(true)}
                                                        className="w-full mt-4 text-green-600 text-sm hover:underline"
                                                    >
                                                        Edit Brands
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-500 text-sm">No favorite brands selected</p>
                                                    <button
                                                        onClick={() => setIsEditingBrands(true)}
                                                        className="text-green-600 text-sm hover:underline mt-2"
                                                    >
                                                        Add Brands
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
