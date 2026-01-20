import axios from 'axios';

// 1. Instancia para TU Backend (Spring Boot)
// CAMBIO IMPORTANTE: Ponemos la URL explícita para asegurar la conexión
const api = axios.create({
    baseURL: 'http://localhost:8080',
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

// 2. Instancia para TMDB (Películas externas)
const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org/3', // Ponemos la URL directa también por seguridad
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY, // Asegúrate de que esta key esté en tu .env
        language: 'es-ES',
    },
});

export { api, tmdbApi };