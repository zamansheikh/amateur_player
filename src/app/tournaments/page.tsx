'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { Tournament } from '@/types';
import { tournamentApi } from '@/lib/api';
import { format } from 'date-fns';

interface FilterState {
    contentType: string[];
    accessLevel: string[];
    uploadDate: string[];
    duration: string;
}

export default function TournamentsPage() {
    const [activeTab, setActiveTab] = useState('All Tournament');
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<FilterState>({
        contentType: [],
        accessLevel: [],
        uploadDate: [],
        duration: '2-60+ min'
    });
    const [durationValue, setDurationValue] = useState(30);

    const tabs = ['All Tournament', 'Registered', 'Available'];

    // Fetch tournaments from API
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoading(true);
                const data = await tournamentApi.getTournaments();
                setTournaments(data);
            } catch (err) {
                console.error('Error fetching tournaments:', err);
                setError('Failed to load tournaments. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const toggleFilter = (category: keyof FilterState, value: string) => {
        if (category === 'duration') return; // Don't toggle duration
        
        setSelectedFilters(prev => ({
            ...prev,
            [category]: (prev[category] as string[]).includes(value)
                ? (prev[category] as string[]).filter((item: string) => item !== value)
                : [...(prev[category] as string[]), value]
        }));
    };

    const resetFilters = () => {
        setSelectedFilters({
            contentType: [],
            accessLevel: [],
            uploadDate: [],
            duration: '2-60+ min'
        });
        setDurationValue(30);
    };

    // Filter tournaments based on active tab and selected filters
    const getFilteredTournaments = () => {
        let filtered = [...tournaments];

        // Filter by tab
        if (activeTab === 'Registered') {
            // Show tournaments where user is already enrolled
            filtered = filtered.filter(tournament => tournament.already_enrolled > 0);
        } else if (activeTab === 'Available') {
            // Show tournaments where user is not enrolled
            filtered = filtered.filter(tournament => tournament.already_enrolled === 0);
        }
        // 'All Tournament' shows all tournaments

        // Filter by content type (format)
        if (selectedFilters.contentType.length > 0) {
            filtered = filtered.filter(tournament => 
                selectedFilters.contentType.includes(tournament.format)
            );
        }

        // Filter by access level (registration fee)
        if (selectedFilters.accessLevel.includes('Under $50')) {
            filtered = filtered.filter(tournament => tournament.reg_fee < 50);
        }

        return filtered;
    };

    const filteredTournaments = getFilteredTournaments();

    const handleRegistration = async (tournament: Tournament) => {
        try {
            if (tournament.already_enrolled > 0) {
                // Unregister from tournament
                await tournamentApi.unregisterFromTournament(tournament.id);
                // Update local state
                setTournaments(prev => prev.map(t => 
                    t.id === tournament.id ? { ...t, already_enrolled: 0 } : t
                ));
            } else {
                // Register for tournament
                await tournamentApi.registerForTournament(tournament.id);
                // Update local state
                setTournaments(prev => prev.map(t => 
                    t.id === tournament.id ? { ...t, already_enrolled: 1 } : t
                ));
            }
        } catch (error) {
            console.error('Error with tournament registration:', error);
            setError('Failed to update registration. Please try again.');
        }
    };

    const renderTournamentCard = (tournament: Tournament) => (
        <div key={tournament.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                {tournament.already_enrolled > 0 && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Registered
                    </span>
                )}
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tournament.address || 'Location TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                        {format(new Date(tournament.start_date), 'MMM dd, yyyy')}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">${tournament.reg_fee}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{tournament.format}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                        Register by {format(new Date(tournament.reg_deadline), 'MMM dd, yyyy')}
                    </span>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                    View Details
                </button>
                <button 
                    onClick={() => handleRegistration(tournament)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        tournament.already_enrolled > 0
                            ? 'border border-red-600 text-red-600 hover:bg-red-50'
                            : 'border border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                >
                    {tournament.already_enrolled > 0 ? 'Unregister' : 'Register'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Tournaments</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Browse and register for bowling tournaments
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Overview"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                {/* Page Title */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Tournaments</h2>
                    <p className="text-gray-600">Browse and register for bowling tournaments in your area</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                activeTab === tab
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>

                            {/* Content Type */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Format</h4>
                                <div className="space-y-2">
                                    {['Singles', 'Doubles', 'Teams'].map((type) => (
                                        <label key={type} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.contentType.includes(type)}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                onChange={() => toggleFilter('contentType', type)}
                                            />
                                            <span className="text-sm text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Access Level */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Access Level</h4>
                                <div className="space-y-2">
                                    {['Any', 'Under $50'].map((level) => (
                                        <label key={level} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.accessLevel.includes(level)}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                onChange={() => toggleFilter('accessLevel', level)}
                                            />
                                            <span className="text-sm text-gray-700">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Duration</h4>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="2"
                                        max="60"
                                        value={durationValue}
                                        onChange={(e) => setDurationValue(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{durationValue}-60+ min</span>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Date */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-900 mb-3">Upload Date</h4>
                                <div className="space-y-2">
                                    {['Beginner', 'Intermediate', 'Professional'].map((date) => (
                                        <label key={date} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.uploadDate.includes(date)}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                onChange={() => toggleFilter('uploadDate', date)}
                                            />
                                            <span className="text-sm text-gray-700">{date}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={() => {/* Apply filters is already applied automatically */}}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                                >
                                    Apply Filters
                                </button>
                                <button 
                                    onClick={resetFilters}
                                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tournament Cards */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="text-gray-500 text-lg">Loading tournaments...</div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-500 text-lg mb-2">Error</div>
                                <p className="text-gray-500">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {filteredTournaments.length > 0 ? (
                                        filteredTournaments.map((tournament) => renderTournamentCard(tournament))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-500 text-lg mb-2">No tournaments found</div>
                                            <p className="text-gray-400">Try adjusting your filters or check back later for new tournaments.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Load More Button */}
                                {filteredTournaments.length > 0 && (
                                    <div className="text-center">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors">
                                            Load More
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
