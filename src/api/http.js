import axios from 'axios';
import apiUrl from '../../config.js';

const http = axios.create({
    baseURL: apiUrl,
    headers: {
        Accept: 'application/json',
    },
});

// Interceptor de request: adjunta el token automáticamente si existe
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de response: maneja errores 401 de forma global
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default http;
