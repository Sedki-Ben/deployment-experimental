import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Optionally redirect to login page or trigger auth modal
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const auth = {
    login: (email, password) => api.post('/api/auth/login', { email, password }),
    register: (userData) => api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout'),
    getCurrentUser: () => api.get('/api/auth/me'),
    updateProfile: (data) => {
        if (data instanceof FormData) {
            return api.put('/api/auth/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.put('/api/auth/profile', data);
    },
    changePassword: (currentPassword, newPassword) => api.put('/api/auth/password', { currentPassword, newPassword }),
    forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/api/auth/reset-password/${token}`, { password })
};

// Article endpoints
export const articles = {
    getAll: (params) => api.get('/api/articles', { params }),
    getByType: (type, params) => api.get(`/api/articles/type/${type}`, { params }),
    getBySlug: (slug) => api.get(`/api/articles/slug/${slug}`),
    getById: (id) => api.get(`/api/articles/${id}`),
    search: (query, params) => api.get('/api/articles/search', { params: { q: query, ...params } }),
    create: (data) => {
        if (data instanceof FormData) {
            return api.post('/api/articles', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        return api.post('/api/articles', data);
    },
    update: (id, data) => {
        if (data instanceof FormData) {
            return api.put(`/api/articles/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        return api.put(`/api/articles/${id}`, data);
    },
    delete: (id) => api.delete(`/api/articles/${id}`),
    toggleLike: (id) => api.post(`/api/articles/${id}/like`),
    share: (id, platform) => api.post(`/api/articles/${id}/share`, { platform }),
    getStats: () => api.get('/api/articles/stats/me'),
    getDrafts: () => api.get('/api/articles/drafts/me'),
    publish: (id) => api.post(`/api/articles/${id}/publish`),
    archive: (id) => api.post(`/api/articles/${id}/archive`),
    unpublish: (id) => api.post(`/api/articles/${id}/unpublish`)
};

// Comment endpoints
export const comments = {
    getByArticle: (articleId, params) => api.get(`/api/comments/article/${articleId}`, { params }),
    getReplies: (commentId) => api.get(`/api/comments/${commentId}/replies`),
    create: (articleId, data) => api.post(`/api/comments/article/${articleId}`, data),
    update: (commentId, data) => api.put(`/api/comments/${commentId}`, data),
    delete: (commentId) => api.delete(`/api/comments/${commentId}`),
    toggleLike: (commentId) => api.post(`/api/comments/${commentId}/like`),
    getLikes: (commentId) => api.get(`/api/comments/${commentId}/likes`),
    report: (commentId, data) => api.post(`/api/comments/${commentId}/report`, data)
};

// Newsletter endpoints
export const newsletter = {
    subscribe: (email, preferences) => api.post('/api/newsletter/subscribe', { email, preferences }),
    unsubscribe: (email) => api.post('/api/newsletter/unsubscribe', { email }),
    updatePreferences: (email, preferences) => api.put('/api/newsletter/preferences', { email, preferences }),
    verifySubscription: (token) => api.get(`/api/newsletter/verify/${token}`),
    // Admin endpoints
    getSubscribers: () => api.get('/api/newsletter/subscribers'),
    sendNewsletter: (data) => api.post('/api/newsletter/send', data),
    getStats: () => api.get('/api/newsletter/stats'),
    deleteSubscriber: (email) => api.delete(`/api/newsletter/subscribers/${email}`)
};

export default api; 
 