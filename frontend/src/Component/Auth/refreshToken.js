// src/utils/refreshToken.js

import api from './axios.js';

export const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
        try {
            const response = await api.post('/token/refresh/', { refresh });
            localStorage.setItem('access_token', response.data.access);
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
    }
};
