import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    const base_url = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        if (query) {
            const fetchSearch = async () => {
                try {
                    // Buscamos en "Multi" (Películas, Series y Personas a la vez)
                    const res = await tmdbApi.get(`/search/multi?query=${query}&include_adult=false&language=es-ES`);

                    let accumulatedMovies = [];

                    res.data.results.forEach(item => {
                        // CASO 1: El resultado ES una película
                        if (item.media_type === 'movie') {
                            if (item.poster_path) accumulatedMovies.push(item);
                        }
                        // CASO 2: El resultado ES una serie (opcional, si quieres mostrarlas)
                        else if (item.media_type === 'tv') {
                            if (item.poster_path) {
                                // Adaptamos título para que no falle luego
                                item.title = item.name;
                                accumulatedMovies.push(item);
                            }
                        }
                        // CASO 3: El resultado ES una PERSONA (Leonardo DiCaprio, Hitchcock...)
                        else if (item.media_type === 'person') {
                            // TMDB nos da sus trabajos más conocidos en 'known_for'
                            if (item.known_for && item.known_for.length > 0) {
                                item.known_for.forEach(work => {
                                    // Solo añadimos si es película o serie y tiene foto
                                    if ((work.media_type === 'movie' || work.media_type === 'tv') && work.poster_path) {
                                        // Aseguramos que tenga propiedad 'title'
                                        if (!work.title) work.title = work.name;
                                        accumulatedMovies.push(work);
                                    }
                                });
                            }
                        }
                    });

                    // ELIMINAR DUPLICADOS
                    // (Porque puede que busques 'Leonardo' y salga la peli 'Inception' por título 
                    // y también salga porque DiCaprio actúa en ella).
                    const uniqueMovies = Array.from(new Set(accumulatedMovies.map(a => a.id)))
                        .map(id => accumulatedMovies.find(a => a.id === id));

                    setMovies(uniqueMovies);

                } catch (error) {
                    console.error("Error buscando:", error);
                }
            };
            fetchSearch();
        }
    }, [query]);

    return (
        <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white', padding: '100px 40px' }}>
            <button onClick={() => navigate('/home')} style={{
                background: '#e50914', border: 'none', color: 'white', fontWeight: 'bold',
                padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginBottom: '30px',
                display: 'flex', alignItems: 'center', gap: '5px'
            }}>
                ← Volver
            </button>

            <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>Resultados para: <span style={{ color: '#fca311' }}>"{query}"</span></h2>

            {movies.length === 0 ? (
                <p style={{ marginTop: 20, color: '#aaa', fontSize: '1.2rem' }}>No se encontraron coincidencias.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                    {movies.map(movie => (
                        <div
                            key={movie.id}
                            style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img
                                src={`${base_url}${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: '100%', borderRadius: '4px', aspectRatio: '2/3', objectFit: 'cover' }}
                            />
                            <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '8px', fontWeight: '500' }}>
                                {movie.title}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;