// src/services/api/config.ts
import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:8000';  // Your Django server URL

// Add a request interceptor for CSRF token
axios.interceptors.request.use(
    config => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    error => Promise.reject(error)
);

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default axios;