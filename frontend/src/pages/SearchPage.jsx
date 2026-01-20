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
                    // Buscamos en TODO (Películas, Personas, Series)
                    const res = await tmdbApi.get(`/search/multi?query=${query}&include_adult=false&language=es-ES`);

                    let results = [];

                    res.data.results.forEach(item => {
                        // Si es una película o serie, la añadimos
                        if (item.media_type === 'movie' || item.media_type === 'tv') {
                            if (item.poster_path) results.push(item);
                        }
                        // Si es una PERSONA (Director, Actor...), sacamos sus películas conocidas
                        else if (item.media_type === 'person') {
                            if (item.known_for) {
                                item.known_for.forEach(knownMovie => {
                                    if (knownMovie.poster_path) results.push(knownMovie);
                                });
                            }
                        }
                    });

                    // Eliminamos duplicados por ID (por si una peli sale 2 veces)
                    const uniqueMovies = Array.from(new Set(results.map(a => a.id)))
                        .map(id => results.find(a => a.id === id));

                    setMovies(uniqueMovies);
                } catch (error) {
                    console.error("Error buscando:", error);
                }
            };
            fetchSearch();
        }
    }, [query]);

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', color: 'white', padding: '80px 40px' }}>
            <button onClick={() => navigate('/home')} style={{
                background: '#e50914', border: 'none', color: 'white', fontWeight: 'bold',
                padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px'
            }}>
                ← Volver al Inicio
            </button>

            <h2>Resultados para: "{query}"</h2>

            {movies.length === 0 ? (
                <p style={{ marginTop: 20, color: '#aaa' }}>No se encontraron películas, series o personas con ese nombre.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                    {movies.map(movie => (
                        <div
                            key={movie.id}
                            style={{ width: '160px', cursor: 'pointer' }}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            <img
                                src={`${base_url}${movie.poster_path}`}
                                alt={movie.title || movie.name}
                                style={{ width: '100%', borderRadius: '5px', transition: 'transform 0.3s' }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                            <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '5px' }}>
                                {movie.title || movie.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;