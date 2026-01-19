import axios from 'axios';

// 1. Instancia para Backend (Spring Boot)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Inyecta el token SOLO si no estamos haciendo login/registro
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // Solo añadimos el token si existe Y si la petición NO es de autenticación
        if (token && !config.url.includes('/auth')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Instancia para TMDB (Películas externas) - 
const tmdbApi = axios.create({
    baseURL: import.meta.env.VITE_TMDB_BASE_URL,
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: 'es-ES',
    },
});

export { api, tmdbApi };