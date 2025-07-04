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
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/signin';
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
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }) => {
        const response = await api.post('/api/create-user', userData);
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
    }
};
