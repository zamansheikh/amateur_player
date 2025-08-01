'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Brand {
    brand_id: number;
    name: string;
    formal_name: string;
    logo_url: string;
}

interface BrandsResponse {
    Shoes: Brand[];
    Apparels: Brand[];
    Balls: Brand[];
    Accessories: Brand[];
}

export default function CompleteProfilePage() {
    const { user, isLoading: authLoading, refreshUser } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!authLoading && (!user || !user.authenticated)) {
            router.push('/signin');
        }
    }, [user, authLoading, router]);

    // Load any existing temporary data
    useEffect(() => {
        // Load profile data if it exists
        const storedProfileData = localStorage.getItem('temp_profile_data');
        if (storedProfileData) {
            try {
                const profileData = JSON.parse(storedProfileData);
                setBowlingStyle(profileData.bowling_style || '');
                setAverage(profileData.average?.toString() || '');
                setDivision(profileData.division || '');
                setIsPBACardHolder(profileData.pba_card_holder || false);
                setPbaCardNumber(profileData.pba_card_number || '');
                setIsUSBCMember(profileData.usbc_member || false);
                setUSBCMemberNumber(profileData.usbc_member_number || '');
            } catch (error) {
                console.error('Error loading stored profile data:', error);
            }
        }

        // Load location data if it exists
        const storedLocationData = localStorage.getItem('temp_location_data');
        if (storedLocationData) {
            try {
                const locationData = JSON.parse(storedLocationData);
                setCity(locationData.city || '');
                setState(locationData.state || '');
                setZipCode(locationData.zip_code || '');
            } catch (error) {
                console.error('Error loading stored location data:', error);
            }
        }
    }, []);

    // Show loading while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-green-600">Loading...</div>
            </div>
        );
    }

    // Don't render anything if user is not authenticated (will redirect)
    if (!user || !user.authenticated) {
        return null;
    }
    
    // Step 1: Bowling Style & Membership
    const [bowlingStyle, setBowlingStyle] = useState(''); // 'one-handed' or 'two-handed'
    const [average, setAverage] = useState('');
    const [division, setDivision] = useState(''); // 'senior', 'mens', 'womens'
    const [isPBACardHolder, setIsPBACardHolder] = useState(false);
    const [pbaCardNumber, setPbaCardNumber] = useState('');
    const [isUSBCMember, setIsUSBCMember] = useState(false);
    const [usbcMemberNumber, setUSBCMemberNumber] = useState('');
    
    // Step 2: Address Info
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    
    // Step 3: Favorite Brands
    const [selectedBrands, setSelectedBrands] = useState({
        balls: [] as number[],
        shoes: [] as number[],
        accessories: [] as number[],
        apparels: [] as number[]
    });
    
    const [brands, setBrands] = useState<BrandsResponse | null>(null);
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch brands data
    useEffect(() => {
        const fetchBrands = async () => {
            setBrandsLoading(true);
            try {
                const response = await fetch('https://test.bowlersnetwork.com/api/brands');
                if (response.ok) {
                    const data = await response.json();
                    setBrands(data);
                }
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            } finally {
                setBrandsLoading(false);
            }
        };

        if (currentStep === 3) {
            fetchBrands();
        }
    }, [currentStep]);

    const handleBrandToggle = (category: keyof typeof selectedBrands, brandId: number) => {
        setSelectedBrands(prev => ({
            ...prev,
            [category]: prev[category].includes(brandId)
                ? prev[category].filter(id => id !== brandId)
                : [...prev[category], brandId]
        }));
    };

    const validateStep1 = () => {
        if (!bowlingStyle) {
            setError('Please select your bowling style');
            return false;
        }
        if (!average) {
            setError('Please enter your average');
            return false;
        }
        if (!division) {
            setError('Please select your division');
            return false;
        }
        if (isPBACardHolder && !pbaCardNumber) {
            setError('Please enter your PBA card number');
            return false;
        }
        if (isUSBCMember && !usbcMemberNumber) {
            setError('Please enter your USBC member number');
            return false;
        }
        setError('');
        return true;
    };

    const validateStep2 = () => {
        if (!zipCode || !city || !state) {
            setError('Please fill in all location fields');
            return false;
        }
        setError('');
        return true;
    };

    // Save bowling profile data (step 1) - Local storage only
    const saveProfileData = async () => {
        const profileData = {
            bowling_style: bowlingStyle,
            average: parseInt(average),
            division: division,
            pba_card_holder: isPBACardHolder,
            pba_card_number: isPBACardHolder ? pbaCardNumber : null,
            usbc_member: isUSBCMember,
            usbc_member_number: isUSBCMember ? usbcMemberNumber : null,
        };

        // Store locally - no API call
        localStorage.setItem('temp_profile_data', JSON.stringify(profileData));
    };

    // Save location data (step 2) - Local storage only
    const saveLocationData = async () => {
        const locationData = {
            city: city,
            state: state,
            zip_code: zipCode,
        };

        // Store locally - no API call
        localStorage.setItem('temp_location_data', JSON.stringify(locationData));
    };

    const handleNext = async () => {
        if (currentStep === 1 && validateStep1()) {
            await saveProfileData();
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            await saveLocationData();
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Get stored profile and location data
            const storedProfileData = localStorage.getItem('temp_profile_data');
            const storedLocationData = localStorage.getItem('temp_location_data');
            
            // Parse stored data
            const profileData = storedProfileData ? JSON.parse(storedProfileData) : {};
            const locationData = storedLocationData ? JSON.parse(storedLocationData) : {};

            // Combine all profile data and mark as complete
            const completeProfileData = {
                ...profileData,
                ...locationData,
                is_complete: true
            };

            // Update profile with all collected data
            // await userApi.updateProfile(completeProfileData);


            // Flatten all selected brand IDs into a single array
            const allBrandIDs = [
                ...selectedBrands.balls,
                ...selectedBrands.shoes,
                ...selectedBrands.accessories,
                ...selectedBrands.apparels
            ];

            // Call the dedicated brands API with the correct payload format
            await userApi.updateFavoriteBrands(allBrandIDs);
            
            // Refresh user data to get updated profile status
            await refreshUser();
            
            // Clean up temporary storage
            localStorage.removeItem('temp_profile_data');
            localStorage.removeItem('temp_location_data');
            
            // Redirect to home page after completing brands selection
            router.push('/');
        } catch (err) {
            console.error('Profile completion error:', err);
            setError('An error occurred while saving your profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Image
                            src="/logo/logo.png"
                            alt="Amateur Player Logo"
                            width={48}
                            height={48}
                            className="rounded-lg"
                        />
                        <span className="text-2xl font-bold text-gray-900">Bowlers Network</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Step {currentStep} of 3
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={
                    currentStep === 3 ? handleSubmit : async (e) => { 
                        e.preventDefault(); 
                        await handleNext(); 
                    }
                }>
                    {/* Welcome Message */}
                    {currentStep === 1 && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm text-center">
                            <p className="font-medium">👋 Welcome back!</p>
                            <p>Please complete your profile to access the full Bowlers Network experience. This will only take a few minutes.</p>
                        </div>
                    )}

                    {/* Step 1: Bowling Style & Membership */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 text-center">Bowling Style & Membership</h3>
                            
                            {/* Bowling Style */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Bowling Style
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="bowlingStyle"
                                            value="one-handed"
                                            checked={bowlingStyle === 'one-handed'}
                                            onChange={(e) => setBowlingStyle(e.target.value)}
                                            className="border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">One Handed</span>
                                        <span className="text-green-600">✓</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="bowlingStyle"
                                            value="two-handed"
                                            checked={bowlingStyle === 'two-handed'}
                                            onChange={(e) => setBowlingStyle(e.target.value)}
                                            className="border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Two Handed</span>
                                        <span className="text-green-600">✓</span>
                                    </label>
                                </div>
                            </div>

                            {/* Average */}
                            <div>
                                <label htmlFor="average" className="block text-sm font-medium text-gray-700">
                                    Average
                                </label>
                                <input
                                    id="average"
                                    name="average"
                                    type="number"
                                    min="0"
                                    max="300"
                                    required
                                    value={average}
                                    onChange={(e) => setAverage(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your bowling average"
                                />
                            </div>

                            {/* Division */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Division
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="division"
                                            value="senior"
                                            checked={division === 'senior'}
                                            onChange={(e) => setDivision(e.target.value)}
                                            className="border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Senior</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="division"
                                            value="mens"
                                            checked={division === 'mens'}
                                            onChange={(e) => setDivision(e.target.value)}
                                            className="border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Men's</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="division"
                                            value="womens"
                                            checked={division === 'womens'}
                                            onChange={(e) => setDivision(e.target.value)}
                                            className="border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">Women's</span>
                                    </label>
                                </div>
                            </div>

                            {/* PBA Card Holder */}
                            <div>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isPBACardHolder}
                                        onChange={(e) => {
                                            setIsPBACardHolder(e.target.checked);
                                            if (!e.target.checked) {
                                                setPbaCardNumber('');
                                            }
                                        }}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">PBA Card Holder</span>
                                </label>
                                
                                {isPBACardHolder && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            value={pbaCardNumber}
                                            onChange={(e) => setPbaCardNumber(e.target.value)}
                                            placeholder="Enter PBA member number"
                                            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* USBC Member */}
                            <div>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isUSBCMember}
                                        onChange={(e) => {
                                            setIsUSBCMember(e.target.checked);
                                            if (!e.target.checked) {
                                                setUSBCMemberNumber('');
                                            }
                                        }}
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">USBC Member</span>
                                </label>
                                
                                {isUSBCMember && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            value={usbcMemberNumber}
                                            onChange={(e) => setUSBCMemberNumber(e.target.value)}
                                            placeholder="Enter USBC member number"
                                            className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address Information */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 text-center">Location Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        required
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="State"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                    ZIP Code
                                </label>
                                <input
                                    id="zipCode"
                                    name="zipCode"
                                    type="text"
                                    required
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="12345"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Favorite Brands */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 text-center">Choose Your Favorite Brands</h3>
                            <p className="text-sm text-gray-600 text-center">Select brands you're interested in (optional). Your profile will be saved when you complete this step.</p>
                            
                            {brandsLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="text-gray-500">Loading brands...</div>
                                </div>
                            ) : brands ? (
                                <>
                                    {/* Ball Brands */}
                                    {brands.Balls && brands.Balls.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-medium text-gray-800 mb-3">Ball Brands</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {brands.Balls.map((brand) => (
                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBrands.balls.includes(brand.brand_id)}
                                                            onChange={() => handleBrandToggle('balls', brand.brand_id)}
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
                                            <h4 className="text-md font-medium text-gray-800 mb-3">Shoes</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {brands.Shoes.map((brand) => (
                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBrands.shoes.includes(brand.brand_id)}
                                                            onChange={() => handleBrandToggle('shoes', brand.brand_id)}
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
                                            <h4 className="text-md font-medium text-gray-800 mb-3">Accessories</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {brands.Accessories.map((brand) => (
                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBrands.accessories.includes(brand.brand_id)}
                                                            onChange={() => handleBrandToggle('accessories', brand.brand_id)}
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
                                            <h4 className="text-md font-medium text-gray-800 mb-3">Apparel</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {brands.Apparels.map((brand) => (
                                                    <label key={brand.brand_id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg border hover:bg-gray-50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBrands.apparels.includes(brand.brand_id)}
                                                            onChange={() => handleBrandToggle('apparels', brand.brand_id)}
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
                                    <div className="text-gray-500">Failed to load brands. Please try again.</div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{
                                backgroundColor: isLoading ? '#d1d5db' : '#8BC342',
                            }}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#7aa838';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#8BC342';
                                }
                            }}
                        >
                            {currentStep === 3 
                                ? (isLoading ? 'Completing Profile...' : 'Complete Profile')
                                : (isLoading ? 'Please wait...' : 'Next')
                            }
                        </button>
                    </div>

                    {currentStep === 3 && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                By completing your profile, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
