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

export default function SignUpPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    
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
    const [userCreated, setUserCreated] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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
            
            if (error.response?.status === 409) {
                setIsEmailVerified(true);
                setError('');
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
        } catch (error: any) {
            console.error('Error verifying email:', error);
            setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsVerifyingCode(false);
        }
    };

    const validateStep1 = async (): Promise<boolean> => {
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !birthDate) {
            setError('Please fill in all fields');
            return false;
        }
        
        if (isUnder13) {
            setError('You must be at least 13 years old to create an account');
            return false;
        }
        
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
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        if (!hasLetter || !hasNumber) {
            setError('Password must contain both letters and numbers');
            return false;
        }

        try {
            setIsLoading(true);
            const validationData = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                password: password
            };

            const result = await userApi.validateSignupData(validationData);

            if (result.isValid) {
                setError('');
                return true;
            } else {
                const errorMessage = result.errors ? result.errors.join(' ') : 'Validation failed';
                setError(errorMessage);
                return false;
            }
        } catch (error) {
            console.error('Validation error:', error);
            setError('An error occurred while validating your information. Please try again.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const validateStep2 = () => {
        if (!isEmailVerified) {
            setError('Please verify your email address before continuing');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            const isValid = await validateStep1();
            if (isValid) {
                setIsEmailVerified(false);
                setCodeSent(false);
                setVerificationCode('');
                setCurrentStep(2);
            }
        } else if (currentStep === 2 && validateStep2()) {
            await handleCoreSignup();
        }
    };

    const handleCoreSignup = async () => {
        setError('');
        setIsCreatingAccount(true);

        try {
            const userData = {
                basicInfo: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password,
                    birth_date: birthDate,
                    ...(isUnder18 && {
                        parent_first_name: parentFirstName,
                        parent_last_name: parentLastName,
                        parent_email: parentEmail
                    })
                },
                brandIDs: []
            };

            const success = await signup(userData);
            if (success) {
                setUserCreated(true);
                router.push('/');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('An error occurred during account creation. Please try again.');
        } finally {
            setIsCreatingAccount(false);
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
                    <p className="mt-2 text-sm text-gray-600">Step {currentStep} of 2</p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 2) * 100}%` }}
                    ></div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={async (e) => { 
                    e.preventDefault(); 
                    if (currentStep === 1) {
                        await handleNext(); 
                    }
                }}>
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
                                        const age = calculateAge(e.target.value);
                                        if (age >= 18) {
                                            setParentFirstName('');
                                            setParentLastName('');
                                            setParentEmail('');
                                        }
                                        setError('');
                                    }}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                />
                            </div>

                            {isUnder13 && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    <p className="font-medium">Age Restriction</p>
                                    <p>You must be at least 13 years old to create an account on this platform.</p>
                                </div>
                            )}

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
                                    </div>
                                </div>
                            )}

                            {userAge >= 18 && birthDate && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                    <p>✓ You meet the age requirement to create an account independently.</p>
                                </div>
                            )}

                            {birthDate && userAge > 0 && (
                                <div className="space-y-3">
                                    {userAge < 18 ? (
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">I am a USBC youth bowler</span>
                                        </label>
                                    ) : (
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">I am a USBC youth coach</span>
                                        </label>
                                    )}
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
                                                    className="w-64 px-4 py-3 text-center text-sm font-mono border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 tracking-widest"
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
                                                Click the button below to create your account.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleCoreSignup}
                                                disabled={isCreatingAccount}
                                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                            >
                                                {isCreatingAccount ? 'Creating Account...' : 'Create Account'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentStep(1);
                                        setCodeSent(false);
                                        setVerificationCode('');
                                        setIsEmailVerified(false);
                                        setError('');
                                    }}
                                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                {!isEmailVerified && (
                                    <div className="flex-1 flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Verify email to continue</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {currentStep !== 2 && (
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading || isCreatingAccount || (currentStep === 1 && isUnder13)}
                                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                style={{
                                    backgroundColor: (isLoading || isCreatingAccount || (currentStep === 1 && isUnder13)) ? '#d1d5db' : '#8BC342',
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
                                {currentStep === 1 && isUnder13 
                                    ? 'Age requirement not met'
                                    : (isLoading ? 'Validating...' : 'Next')
                                }
                            </button>
                        </div>
                    )}

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

                    {currentStep === 2 && (
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