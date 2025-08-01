'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';

interface Brand {
    brand_id: number;
    brandType: string;
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

export default function SignUpPage() {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Step 1: Basic Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    
    // Parent information (for users under 18)
    const [parentFirstName, setParentFirstName] = useState('');
    const [parentLastName, setParentLastName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    
    // Step 2: Email Verification
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    
    // Step 3: Address Info (previously Step 2)
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    
    // Step 4: Favorite Brands (previously Step 3)
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

    const { signup } = useAuth();
    const router = useRouter();

    // Helper function to calculate age
    const calculateAge = (birthDate: string): number => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Get user age from birth date
    const userAge = calculateAge(birthDate);
    const isUnder18 = userAge > 0 && userAge < 18;
    const isUnder13 = userAge > 0 && userAge < 13;

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

        if (currentStep === 4) { // Updated from 3 to 4
            fetchBrands();
        }
    }, [currentStep]);

    // Email verification functions
    const sendVerificationCode = async () => {
        if (!email) {
            setError('Please enter an email address first');
            return;
        }

        setIsSendingCode(true);
        setError('');

        try {
            await userApi.sendVerificationCode(email);
            setCodeSent(true);
            setError('');
        } catch (error: any) {
            console.error('Error sending verification code:', error);
            
            // Check if email is already verified (status code 409)
            if (error.response?.status === 409) {
                setIsEmailVerified(true);
                setError('');
                // Auto-advance to next step since email is already verified
                setTimeout(() => {
                    setCurrentStep(3);
                }, 1500);
            } else {
                setError(error.response?.data?.message || 'Failed to send verification code. Please try again.');
            }
        } finally {
            setIsSendingCode(false);
        }
    };

    const verifyEmailCode = async () => {
        if (!verificationCode) {
            setError('Please enter the verification code');
            return;
        }

        setIsVerifyingCode(true);
        setError('');

        try {
            await userApi.verifyEmail(email, verificationCode);
            setIsEmailVerified(true);
            setError('');
            // Auto-advance to next step after successful verification
            setTimeout(() => {
                setCurrentStep(3);
            }, 1500);
        } catch (error: any) {
            console.error('Error verifying email:', error);
            setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsVerifyingCode(false);
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

    const validateStep1 = () => {
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !birthDate) {
            setError('Please fill in all fields');
            return false;
        }
        
        // Check age restrictions
        if (isUnder13) {
            setError('You must be at least 13 years old to create an account');
            return false;
        }
        
        // Check parent information for users under 18
        if (isUnder18 && (!parentFirstName || !parentLastName || !parentEmail)) {
            setError('Parent information is required for users under 18');
            return false;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        // Check if password contains both letters and numbers
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        if (!hasLetter || !hasNumber) {
            setError('Password must contain both letters and numbers');
            return false;
        }
        setError('');
        return true;
    };

    const validateStep2 = () => {
        if (!isEmailVerified) {
            setError('Please verify your email address before continuing');
            return false;
        }
        setError('');
        return true;
    };

    const validateStep3 = () => {
        if (!zipCode || !city || !state) {
            setError('Please fill in all location fields');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            // Reset email verification state when entering step 2 with a new email
            setIsEmailVerified(false);
            setCodeSent(false);
            setVerificationCode('');
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        } else if (currentStep === 3 && validateStep3()) {
            setCurrentStep(4);
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
            // Collect all selected brand IDs from all categories
            const allSelectedBrandIds = [
                ...selectedBrands.balls,
                ...selectedBrands.shoes,
                ...selectedBrands.accessories,
                ...selectedBrands.apparels
            ];

            // Prepare the signup data with birth date and parent info
            const signupData = {
                basicInfo: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                    birth_date: birthDate,
                    // Include parent information if user is under 18
                    ...(isUnder18 && {
                        parent_first_name: parentFirstName,
                        parent_last_name: parentLastName,
                        parent_email: parentEmail
                    })
                },
                brandIDs: allSelectedBrandIds
            };

            const success = await signup(signupData);
            if (success) {
                router.push('/');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
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
                    <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Step {currentStep} of 4
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 text-center">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Choose a username"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                    Birth Date
                                </label>
                                <input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    required
                                    value={birthDate}
                                    onChange={(e) => {
                                        setBirthDate(e.target.value);
                                        // Clear parent fields if user becomes 18 or older
                                        const age = calculateAge(e.target.value);
                                        if (age >= 18) {
                                            setParentFirstName('');
                                            setParentLastName('');
                                            setParentEmail('');
                                        }
                                        // Clear error when birth date changes
                                        setError('');
                                    }}
                                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                />
                            </div>

                            {/* Age restriction warning for users under 13 */}
                            {isUnder13 && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    <p className="font-medium">Age Restriction</p>
                                    <p>You must be at least 13 years old to create an account on this platform.</p>
                                </div>
                            )}

                            {/* Parent information section for users under 18 (but 13 and older) */}
                            {isUnder18 && !isUnder13 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                                    <div className="text-sm text-blue-800">
                                        <p className="font-medium">Parent/Guardian Information Required</p>
                                        <p>Since you are under 18, we need your parent or guardian's information for account verification and safety purposes.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="parentFirstName" className="block text-sm font-medium text-gray-700">
                                                Parent's First Name
                                            </label>
                                            <input
                                                id="parentFirstName"
                                                name="parentFirstName"
                                                type="text"
                                                required={isUnder18}
                                                value={parentFirstName}
                                                onChange={(e) => setParentFirstName(e.target.value)}
                                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                                placeholder="Parent's first name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="parentLastName" className="block text-sm font-medium text-gray-700">
                                                Parent's Last Name
                                            </label>
                                            <input
                                                id="parentLastName"
                                                name="parentLastName"
                                                type="text"
                                                required={isUnder18}
                                                value={parentLastName}
                                                onChange={(e) => setParentLastName(e.target.value)}
                                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                                placeholder="Parent's last name"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                                            Parent's Email Address
                                        </label>
                                        <input
                                            id="parentEmail"
                                            name="parentEmail"
                                            type="email"
                                            required={isUnder18}
                                            value={parentEmail}
                                            onChange={(e) => setParentEmail(e.target.value)}
                                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                            placeholder="Parent's email address"
                                        />
                                        {/* <p className="mt-1 text-xs text-gray-500">
                                            Your parent/guardian will receive a notification about this account creation.
                                        </p> */}
                                    </div>
                                </div>
                            )}

                            {/* Success message for users 18 and older */}
                            {userAge >= 18 && birthDate && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                    <p>✓ You meet the age requirement to create an account independently.</p>
                                </div>
                            )}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Create a password (min. 8 characters, letters & numbers)"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Email Verification */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 text-center">Verify Your Email</h3>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-center">
                                    <p className="text-sm text-blue-800 mb-2">
                                        {isEmailVerified ? 'Email already verified:' : 'We will send a verification code to:'}
                                    </p>
                                    <p className="font-medium text-blue-900 mb-4">{email}</p>
                                    
                                    {!codeSent && !isEmailVerified ? (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600">
                                                Click the button below to send a verification code to your email address.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={sendVerificationCode}
                                                disabled={isSendingCode}
                                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                            >
                                                {isSendingCode ? 'Checking Email Status...' : 'Send Verification Code'}
                                            </button>
                                        </div>
                                    ) : codeSent && !isEmailVerified ? (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600">
                                                Enter the 6-digit verification code sent to your email:
                                            </p>
                                            <div className="flex flex-col items-center space-y-4">
                                                <input
                                                    type="text"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="Enter 6-digit code"
                                                    maxLength={6}
                                                    className="w-48 px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 tracking-widest"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={verifyEmailCode}
                                                    disabled={isVerifyingCode || verificationCode.length !== 6}
                                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                                >
                                                    {isVerifyingCode ? 'Verifying...' : 'Verify Email'}
                                                </button>
                                            </div>
                                            
                                            <div className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCodeSent(false);
                                                        setVerificationCode('');
                                                        setError('');
                                                        sendVerificationCode();
                                                    }}
                                                    disabled={isSendingCode}
                                                    className="text-sm text-green-600 hover:text-green-700 underline"
                                                >
                                                    {isSendingCode ? 'Checking...' : "Didn't receive the code? Resend"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-green-600 font-medium">
                                                {codeSent ? 'Email Verified Successfully!' : 'Email Already Verified!'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {codeSent ? 'Redirecting to the next step...' : 'This email is already verified. Proceeding to the next step...'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Back to step 1 to change email if needed */}
                            {!isEmailVerified && (
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCurrentStep(1);
                                            setCodeSent(false);
                                            setVerificationCode('');
                                            setIsEmailVerified(false);
                                            setError('');
                                        }}
                                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                                    >
                                        Wrong email? Go back to change it
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Address Information (previously Step 2) */}
                    {currentStep === 3 && (
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

                    {/* Step 4: Favorite Brands (previously Step 3) */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 text-center">Choose Your Favorite Brands</h3>
                            <p className="text-sm text-gray-600 text-center">Select brands you're interested in (optional)</p>
                            
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
                            disabled={isLoading || (currentStep === 1 && isUnder13) || (currentStep === 2 && !isEmailVerified)}
                            className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{
                                backgroundColor: (isLoading || (currentStep === 1 && isUnder13) || (currentStep === 2 && !isEmailVerified)) ? '#d1d5db' : '#8BC342',
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
                            {currentStep === 4 
                                ? (isLoading ? 'Creating account...' : 'Create account')
                                : currentStep === 1 && isUnder13 
                                    ? 'Age requirement not met'
                                    : currentStep === 2 && !isEmailVerified
                                        ? 'Verify email to continue'
                                        : 'Next'
                            }
                        </button>
                    </div>

                    {currentStep === 1 && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/signin" className="font-medium text-green-600 hover:text-green-500">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                By creating an account, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
