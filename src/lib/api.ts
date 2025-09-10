import axios from 'axios';

// API base URL
const API_BASE = 'https://test.bowlersnetwork.com';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Check if we're on a public pro route - don't redirect
                const currentPath = window.location.pathname;
                const isProRoute = currentPath.startsWith('/pro/');
                
                if (!isProRoute) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/signin';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Authentication API functions
export const authApi = {
    login: async (username: string, password: string) => {
        const response = await api.post('/api/amateur-login', {
            username,
            password
        });
        return response.data;
    },

    signup: async (userData: {
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
    }) => {
        const response = await api.post('/api/create-user', userData);
        return response.data;
    },

    validateSignupData: async (validationData: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        password: string;
    }) => {
        const response = await api.post('/api/validate-signup-data', validationData);
        return response.data;
    }
};

// API functions
export const userApi = {
    getProfile: async () => {
        const response = await api.get('/api/user/profile');
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put('/api/user/profile', data);
        return response.data;
    },

    sendVerificationCode: async (email: string) => {
        const response = await api.post('/api/send-verification-code', { email });
        return response.data;
    },

    verifyEmail: async (email: string, code: string) => {
        const response = await api.post('/api/verify-email', { email, code });
        return response.data;
    },

    validateSignupData: async (validationData: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        password: string;
    }) => {
        const response = await api.post('/api/validate-signup-data', validationData);
        return response.data;
    },

    updateFavoriteBrands: async (brandIDs: number[]) => {
        const response = await api.patch('/api/user/brands/favorites', { brandIDs });
        return response.data;
    }
};

// Tournament API functions
export const tournamentApi = {
    getTournaments: async () => {
        const response = await api.get('/api/tournaments');
        return response.data;
    },

    createTournament: async (tournamentData: {
        name: string;
        start_date: string;
        reg_deadline: string;
        reg_fee: string;
        participants_count: number;
        address: string;
        access_type: string;
    }) => {
        const response = await api.post('/api/tournaments', tournamentData);
        return response.data;
    },

    // Singles tournament registration
    registerSingles: async (tournamentId: number, playerId: number) => {
        const response = await api.post(`/api/tournament/${tournamentId}/add-singles-member/${playerId}`);
        return response.data;
    },

    // Doubles/Teams tournament registration
    registerWithTeam: async (tournamentId: number, teamId: number) => {
        const response = await api.post(`/api/tournament/${tournamentId}/add-teams-member/${teamId}`);
        return response.data;
    },

    registerForTournament: async (tournamentId: number) => {
        const response = await api.post(`/api/tournaments/${tournamentId}/register`);
        return response.data;
    },

    unregisterFromTournament: async (tournamentId: number) => {
        const response = await api.delete(`/api/tournaments/${tournamentId}/register`);
        return response.data;
    },

    getTournamentTeams: async (tournamentId: number) => {
        const response = await api.get(`/api/tournament/${tournamentId}/teams`);
        return response.data;
    }
};

// Teams API functions
export const teamsApi = {
    getUserTeams: async () => {
        const response = await api.get('/api/user/teams');
        return response.data;
    },

    getTeamMembers: async (teamId: number) => {
        const response = await api.get(`/api/user/teams/${teamId}/members`);
        return response.data;
    }
};
