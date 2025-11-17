'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign, Clock, X, Plus } from 'lucide-react';
import { Tournament } from '@/types';
import { tournamentApi, teamsApi } from '@/lib/api';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FilterState {
    contentType: string[];
    accessLevel: string[];
    uploadDate: string[];
    duration: string;
}

interface CreateTournamentForm {
    name: string;
    start_date: string;
    reg_deadline: string;
    reg_fee: string;
    address: string;
    lat: string;
    long: string;
    format: 'Singles' | 'Doubles' | 'Teams';
    participants_count: number;
    access_type: string;
    description: string;
    tournament_type: 'Handicap' | 'Scratch';
    average: string;
    percentage: string;
}

interface MapboxFeature {
    id: string;
    place_name: string;
    center: [number, number];
    text: string;
}

interface Team {
    team_id: number;
    name: string;
    logo_url: string;
    member_count?: number;
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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [registrationLoading, setRegistrationLoading] = useState(false);
    const [createTournamentForm, setCreateTournamentForm] = useState<CreateTournamentForm>({
        name: '',
        start_date: '',
        reg_deadline: '',
        reg_fee: '',
        address: '',
        lat: '',
        long: '',
        format: 'Singles',
        participants_count: 1,
        access_type: 'Open',
        description: '',
        tournament_type: 'Handicap',
        average: '',
        percentage: '90'
    });

    // Mapbox address autocomplete states
    const [addressSuggestions, setAddressSuggestions] = useState<MapboxFeature[]>([]);
    const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
    const [addressSearchQuery, setAddressSearchQuery] = useState('');
    const addressInputRef = useRef<HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const tabs = ['All Tournament', 'Registered', 'Available'];
    const { user } = useAuth();

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
        setCreateTournamentForm(prev => ({
            ...prev,
            address: value
        }));

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for debounced search
        debounceTimerRef.current = setTimeout(() => {
            searchAddress(value);
        }, 300); // 300ms debounce
    };

    // Handle suggestion selection
    const handleSelectAddress = (suggestion: MapboxFeature) => {
        setCreateTournamentForm(prev => ({
            ...prev,
            address: suggestion.place_name,
            lat: suggestion.center[1].toString(), // Latitude
            long: suggestion.center[0].toString() // Longitude
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
                !suggestionsRef.current.contains(event.target as Node) &&
                addressInputRef.current &&
                !addressInputRef.current.contains(event.target as Node)
            ) {
                setShowAddressSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

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

    // Fetch user's teams for registration
    useEffect(() => {
        const fetchTeams = async () => {
            if (!user?.authenticated) return;

            try {
                const teamsResponse = await teamsApi.getUserTeams();
                if (teamsResponse.my_teams) {
                    const teamsWithCount = await Promise.all(
                        teamsResponse.my_teams.map(async (team: Team) => {
                            try {
                                const membersResponse = await teamsApi.getTeamMembers(team.team_id);
                                return {
                                    ...team,
                                    member_count: membersResponse.members?.member_count || 0
                                };
                            } catch (error) {
                                return { ...team, member_count: 0 };
                            }
                        })
                    );
                    setTeams(teamsWithCount);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, [user]);

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
            filtered = filtered.filter(tournament => (tournament.already_enrolled ?? 0) > 0);
        } else if (activeTab === 'Available') {
            // Show tournaments where user is not enrolled
            filtered = filtered.filter(tournament => (tournament.already_enrolled ?? 0) === 0);
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
        if ((tournament.already_enrolled ?? 0) > 0) {
            // Handle unregistration
            try {
                await tournamentApi.unregisterFromTournament(tournament.id);
                setTournaments(prev => prev.map(t =>
                    t.id === tournament.id ? { ...t, already_enrolled: 0 } : t
                ));
            } catch (error) {
                console.error('Error with tournament unregistration:', error);
                setError('Failed to unregister. Please try again.');
            }
        } else {
            // Show registration modal for enrollment
            setSelectedTournament(tournament);
            setSelectedTeamId(null);
            setShowRegistrationModal(true);
        }
    };

    const handleConfirmRegistration = async () => {
        if (!selectedTournament || !user) return;

        try {
            setRegistrationLoading(true);

            if (selectedTournament.format === 'Singles') {
                // Register for singles tournament
                await tournamentApi.registerSingles(selectedTournament.id, user.user_id);
            } else {
                // Register for doubles/teams tournament
                if (!selectedTeamId) {
                    setError('Please select a team for this tournament format.');
                    return;
                }
                await tournamentApi.registerWithTeam(selectedTournament.id, selectedTeamId);
            }

            // Update local state
            setTournaments(prev => prev.map(t =>
                t.id === selectedTournament.id ? { ...t, already_enrolled: 1 } : t
            ));

            // Close modal
            setShowRegistrationModal(false);
            setSelectedTournament(null);
            setSelectedTeamId(null);

        } catch (error) {
            console.error('Error with tournament registration:', error);
            setError('Failed to register. Please try again.');
        } finally {
            setRegistrationLoading(false);
        }
    };

    const handleFormatChange = (format: 'Singles' | 'Doubles' | 'Teams') => {
        let participants_count = 1;
        if (format === 'Doubles') {
            participants_count = 2;
        } else if (format === 'Teams') {
            participants_count = 10; // Default team size
        }

        setCreateTournamentForm(prev => ({
            ...prev,
            format,
            participants_count
        }));
    };

    const handleCreateTournament = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            // Format dates for API
            const formattedData = {
                name: createTournamentForm.name,
                start_date: new Date(createTournamentForm.start_date).toISOString(),
                reg_deadline: new Date(createTournamentForm.reg_deadline).toISOString(),
                reg_fee: createTournamentForm.reg_fee,
                participants_count: createTournamentForm.participants_count,
                address: createTournamentForm.address,
                lat: createTournamentForm.lat,
                long: createTournamentForm.long,
                access_type: createTournamentForm.access_type,
                description: createTournamentForm.description,
                tournament_type: createTournamentForm.tournament_type,
                average: createTournamentForm.average ? parseFloat(createTournamentForm.average) : undefined,
                percentage: createTournamentForm.percentage ? parseFloat(createTournamentForm.percentage) : undefined
            };

            const newTournament = await tournamentApi.createTournament(formattedData);

            // Refresh tournaments list
            const updatedTournaments = await tournamentApi.getTournaments();
            setTournaments(updatedTournaments);

            // Reset form and close modal
            setCreateTournamentForm({
                name: '',
                start_date: '',
                reg_deadline: '',
                reg_fee: '',
                address: '',
                lat: '',
                long: '',
                format: 'Singles',
                participants_count: 1,
                access_type: 'Open',
                description: '',
                tournament_type: 'Handicap',
                average: '',
                percentage: '90'
            });
            setAddressSearchQuery('');
            setAddressSuggestions([]);
            setShowAddressSuggestions(false);
            setShowCreateModal(false);

        } catch (error) {
            console.error('Error creating tournament:', error);
            setError('Failed to create tournament. Please try again.');
        } finally {
            setCreateLoading(false);
        }
    };

    const renderTournamentCard = (tournament: Tournament) => (
        <div key={tournament.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                {(tournament.already_enrolled ?? 0) > 0 && (
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
                <Link
                    href={`/tournaments/${tournament.id}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-center"
                >
                    View Details
                </Link>
                <button
                    onClick={() => handleRegistration(tournament)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${(tournament.already_enrolled ?? 0) > 0
                        ? 'border border-red-600 text-red-600 hover:bg-red-50'
                        : 'border border-green-600 text-green-600 hover:bg-green-50'
                        }`}
                >
                    {(tournament.already_enrolled ?? 0) > 0 ? 'Unregister' : 'Register'}
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
                        {/* <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Tournament
                        </button> */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search tournaments..."
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
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab
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
                                    onClick={() => {/* Apply filters is already applied automatically */ }}
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

            {/* Tournament Registration Modal */}
            {showRegistrationModal && selectedTournament && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">Register for Tournament</h3>
                            <button
                                onClick={() => {
                                    setShowRegistrationModal(false);
                                    setSelectedTournament(null);
                                    setSelectedTeamId(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Tournament Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">{selectedTournament.name}</h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(selectedTournament.start_date), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        <span>${selectedTournament.reg_fee}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{selectedTournament.format}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Form */}
                            {selectedTournament.format === 'Singles' ? (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-green-600 mb-2">
                                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                        <span className="text-sm font-medium">Individual Registration</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        You will be registered as an individual player for this singles tournament.
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Select Team for {selectedTournament.format} Tournament *
                                    </label>

                                    {teams.length > 0 ? (
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {teams.map((team) => (
                                                <div
                                                    key={team.team_id}
                                                    onClick={() => setSelectedTeamId(team.team_id)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedTeamId === team.team_id
                                                        ? 'border-green-600 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                            {team.logo_url ? (
                                                                <img src={team.logo_url} alt={team.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                    <span className="text-gray-500 text-lg">👥</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-medium text-gray-900 truncate">{team.name}</h5>
                                                            <p className="text-xs text-gray-500">{team.member_count || 0} members</p>
                                                        </div>
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTeamId === team.team_id
                                                            ? 'border-green-600 bg-green-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {selectedTeamId === team.team_id && (
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-gray-400 text-xl">👥</span>
                                            </div>
                                            <p className="text-sm">No teams available</p>
                                            <p className="text-xs text-gray-400 mt-1">Create a team first to register for this tournament</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRegistrationModal(false);
                                        setSelectedTournament(null);
                                        setSelectedTeamId(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={registrationLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmRegistration}
                                    disabled={
                                        registrationLoading ||
                                        (selectedTournament.format !== 'Singles' && !selectedTeamId)
                                    }
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {registrationLoading ? 'Registering...' : 'Confirm Registration'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Tournament Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">Create New Tournament</h3>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setAddressSearchQuery('');
                                    setAddressSuggestions([]);
                                    setShowAddressSuggestions(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTournament} className="p-6 space-y-6">
                            {/* Tournament Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tournament Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createTournamentForm.name}
                                    onChange={(e) => setCreateTournamentForm(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter tournament name"
                                />
                            </div>

                            {/* Format Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Format *
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['Singles', 'Doubles', 'Teams'] as const).map((format) => (
                                        <button
                                            key={format}
                                            type="button"
                                            onClick={() => handleFormatChange(format)}
                                            className={`p-3 rounded-lg border text-center transition-colors ${createTournamentForm.format === format
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="font-medium">{format}</div>
                                            <div className="text-xs text-gray-500">
                                                {format === 'Singles' && 'Individual play'}
                                                {format === 'Doubles' && '2 players'}
                                                {format === 'Teams' && 'Team play'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Team Size (only show if Teams format is selected) */}
                            {createTournamentForm.format === 'Teams' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team Size
                                    </label>
                                    <input
                                        type="number"
                                        min="3"
                                        max="50"
                                        value={createTournamentForm.participants_count}
                                        onChange={(e) => setCreateTournamentForm(prev => ({
                                            ...prev,
                                            participants_count: parseInt(e.target.value) || 3
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            )}

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={createTournamentForm.start_date}
                                        onChange={(e) => setCreateTournamentForm(prev => ({
                                            ...prev,
                                            start_date: e.target.value
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Registration Deadline *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={createTournamentForm.reg_deadline}
                                        onChange={(e) => setCreateTournamentForm(prev => ({
                                            ...prev,
                                            reg_deadline: e.target.value
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Registration Fee */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Registration Fee ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={createTournamentForm.reg_fee}
                                    onChange={(e) => setCreateTournamentForm(prev => ({
                                        ...prev,
                                        reg_fee: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Address */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Venue Address
                                </label>
                                <div className="relative">
                                    <textarea
                                        ref={addressInputRef}
                                        rows={3}
                                        value={createTournamentForm.address}
                                        onChange={(e) => handleAddressChange(e.target.value)}
                                        onFocus={() => {
                                            if (addressSuggestions.length > 0) {
                                                setShowAddressSuggestions(true);
                                            }
                                        }}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                        placeholder="Start typing address (e.g., 123 Main St, New York)"
                                    />
                                    <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                </div>

                                {/* Address Suggestions Dropdown */}
                                {showAddressSuggestions && addressSuggestions.length > 0 && (
                                    <div
                                        ref={suggestionsRef}
                                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                                    >
                                        {addressSuggestions.map((suggestion) => (
                                            <button
                                                key={suggestion.id}
                                                type="button"
                                                onClick={() => handleSelectAddress(suggestion)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">
                                                            {suggestion.text}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {suggestion.place_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={createTournamentForm.description}
                                    onChange={(e) => setCreateTournamentForm(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                    placeholder="Enter tournament description..."
                                />
                            </div>

                            {/* Tournament Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tournament Type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Handicap', 'Scratch'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setCreateTournamentForm(prev => ({
                                                ...prev,
                                                tournament_type: type
                                            }))}
                                            className={`px-4 py-2 border-2 rounded-lg transition-all ${createTournamentForm.tournament_type === type
                                                    ? 'border-green-600 bg-green-50 text-green-600 font-medium'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bowling Average */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bowling Average {createTournamentForm.tournament_type === 'Handicap' && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="number"
                                    value={createTournamentForm.average}
                                    onChange={(e) => setCreateTournamentForm(prev => ({
                                        ...prev,
                                        average: e.target.value
                                    }))}
                                    min="0"
                                    max="300"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter bowling average (0-300)"
                                    required={createTournamentForm.tournament_type === 'Handicap'}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {createTournamentForm.tournament_type === 'Handicap'
                                        ? 'Required for handicap tournaments'
                                        : 'Optional for scratch tournaments'}
                                </p>
                            </div>

                            {/* Handicap Percentage - Only show for Handicap type */}
                            {createTournamentForm.tournament_type === 'Handicap' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Handicap Percentage <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={createTournamentForm.percentage}
                                        onChange={(e) => setCreateTournamentForm(prev => ({
                                            ...prev,
                                            percentage: e.target.value
                                        }))}
                                        min="50"
                                        max="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter percentage (50-100)"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Typical range: 50% - 100%
                                    </p>
                                </div>
                            )}

                            {/* Access Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Access Type
                                </label>
                                <select
                                    value={createTournamentForm.access_type}
                                    onChange={(e) => setCreateTournamentForm(prev => ({
                                        ...prev,
                                        access_type: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="Open">Open</option>
                                    <option value="Invitational">Invitational</option>
                                </select>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setAddressSearchQuery('');
                                        setAddressSuggestions([]);
                                        setShowAddressSuggestions(false);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={createLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {createLoading ? 'Creating...' : 'Create Tournament'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
