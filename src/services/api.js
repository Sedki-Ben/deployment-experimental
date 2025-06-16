import axios from 'axios';

// Get the API URL from environment variables
const getApiUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!apiUrl) {
    console.error('REACT_APP_API_URL is not set in environment variables');
    throw new Error('API URL is not configured. Please check your environment variables.');
  }
  // Ensure the URL ends with /api
  return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
};

// Validate API configuration
const validateApiConfig = () => {
  try {
    const apiUrl = getApiUrl();
    console.log('API Configuration:', {
      baseURL: apiUrl,
      environment: process.env.NODE_ENV,
      hasApiUrl: !!process.env.REACT_APP_API_URL
    });
    return apiUrl;
  } catch (error) {
    console.error('API Configuration Error:', error);
    throw error;
  }
};

const api = axios.create({
    baseURL: validateApiConfig(),
    headers: {
        'Content-Type': 'application/json'
    },
    // Add timeout and validate status
    timeout: 10000,
    validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all status codes less than 500
    }
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            // Log the request for debugging
            console.log('API Request:', {
                url: `${config.baseURL}${config.url}`,
                method: config.method,
                headers: config.headers,
                data: config.data
            });
            return config;
        } catch (error) {
            console.error('Request Interceptor Error:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error('Request Error:', {
            message: error.message,
            config: error.config
        });
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        // Log successful responses for debugging
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
        return response;
    },
    (error) => {
        // Log detailed error information
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            headers: error.config?.headers
        });
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: async (email, password) => {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email format');
            }

            console.log('Attempting login with email:', email);
            const response = await api.post('/auth/login', { email, password });
            
            // Validate response
            if (!response.data || !response.data.token) {
                throw new Error('Invalid server response');
            }

            // Store token
            localStorage.setItem('token', response.data.token);
            
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            // Clear any existing token on error
            localStorage.removeItem('token');
            throw error;
        }
    },

    register: async (userData) => {
        try {
            if (!userData.email || !userData.password) {
                throw new Error('Email and password are required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Invalid email format');
            }

            // Validate password strength
            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            console.log('Attempting registration with data:', { ...userData, password: '[REDACTED]' });
            const response = await api.post('/auth/register', userData);
            
            // Validate response
            if (!response.data || !response.data.token) {
                throw new Error('Invalid server response');
            }

            // Store token
            localStorage.setItem('token', response.data.token);
            
            return response.data;
        } catch (error) {
            console.error('Registration Error:', error);
            // Clear any existing token on error
            localStorage.removeItem('token');
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            // Always clear token on logout
            localStorage.removeItem('token');
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            if (!response.data) {
                throw new Error('Invalid user data');
            }
            return response.data;
        } catch (error) {
            console.error('Get Current User Error:', error);
            // Clear token if unauthorized
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
            throw error;
        }
    },

    updateProfile: (data) => {
        if (data instanceof FormData) {
            return api.put('/auth/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.put('/auth/profile', data);
    },
    changePassword: (currentPassword, newPassword) => api.put('/auth/password', { currentPassword, newPassword }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password })
};

// Article endpoints
export const articles = {
    getAll: (params) => api.get('/articles', { params }),
    getByType: (type, params) => api.get(`/articles/type/${type}`, { params }),
    getBySlug: (slug) => api.get(`/articles/slug/${slug}`),
    getById: (id) => api.get(`/articles/${id}`),
    search: (query, params) => api.get('/articles/search', { params: { q: query, ...params } }),
    create: (data) => {
        if (data instanceof FormData) {
            return api.post('/articles', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        return api.post('/articles', data);
    },
    update: (id, data) => {
        if (data instanceof FormData) {
            return api.put(`/articles/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        return api.put(`/articles/${id}`, data);
    },
    delete: (id) => api.delete(`/articles/${id}`),
    toggleLike: (id) => api.post(`/articles/${id}/like`),
    share: (id, platform) => api.post(`/articles/${id}/share`, { platform }),
    getStats: () => api.get('/articles/stats/me'),
    getDrafts: () => api.get('/articles/drafts/me'),
    publish: (id) => api.post(`/articles/${id}/publish`),
    archive: (id) => api.post(`/articles/${id}/archive`),
    unpublish: (id) => api.post(`/articles/${id}/unpublish`)
};

// Comment endpoints
export const comments = {
    getByArticle: (articleId, params) => api.get(`/comments/article/${articleId}`, { params }),
    getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
    create: (articleId, data) => api.post(`/comments/article/${articleId}`, data),
    update: (commentId, data) => api.put(`/comments/${commentId}`, data),
    delete: (commentId) => api.delete(`/comments/${commentId}`),
    toggleLike: (commentId) => api.post(`/comments/${commentId}/like`),
    getLikes: (commentId) => api.get(`/comments/${commentId}/likes`),
    report: (commentId, data) => api.post(`/comments/${commentId}/report`, data)
};

// Newsletter endpoints
export const newsletter = {
    subscribe: (email, preferences) => api.post('/newsletter/subscribe', { email, preferences }),
    unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
    updatePreferences: (email, preferences) => api.put('/newsletter/preferences', { email, preferences }),
    verifySubscription: (token) => api.get(`/newsletter/verify/${token}`),
    // Admin endpoints
    getSubscribers: () => api.get('/newsletter/subscribers'),
    sendNewsletter: (data) => api.post('/newsletter/send', data),
    getStats: () => api.get('/newsletter/stats'),
    deleteSubscriber: (email) => api.delete(`/newsletter/subscribers/${email}`)
};

export default api; 
 