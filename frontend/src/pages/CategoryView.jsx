import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { tmdbApi } from '../services/api';

const CategoryView = () => {
    const { nombre } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Recuperar el endpoint original o establecer uno por defecto basado en nombre
    const initialEndpoint = location.state?.endpoint || `/search/movie?query=${nombre}`;
    const title = location.state?.title || nombre.replace(/-/g, ' ').toUpperCase();

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const base_url = "https://image.tmdb.org/t/p/w500";

    const fetchMovies = async (pageNum, append = false) => {
        setLoading(true);
        try {
            // Manejar correctamente los query params del endpoint
            const separator = initialEndpoint.includes('?') ? '&' : '?';
            const response = await tmdbApi.get(`${initialEndpoint}${separator}page=${pageNum}`);
            
            const results = response.data.results;
            
            if (append) {
                setMovies(prev => [...prev, ...results]);
            } else {
                setMovies(results);
            }

            if (pageNum >= response.data.total_pages || results.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching category movies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        fetchMovies(1, false);
        window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialEndpoint]);

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMovies(nextPage, true);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" style={{ paddingTop: '100px' }}>
            <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="bg-transparent border border-[#555] text-[#ccc] px-4 py-2 rounded hover:bg-[#333] transition font-bold text-sm"
                >
                    ⬅ Volver
                </button>
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {movies.map(movie => (
                    <div 
                        key={`${movie.id}-${Math.random()}`}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        <img 
                            src={movie.poster_path ? `${base_url}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Imagen'} 
                            alt={movie.title || movie.name}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750?text=Sin+Imagen'; }}
                        />
                        <div className="mt-2 p-2">
                            <h3 className="truncate text-sm font-bold">{movie.title || movie.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                                <span className="bg-green-600/20 text-green-500 px-2 py-0.5 rounded">TMDB: {Math.round(movie.vote_average * 10)}%</span>
                                <span className="text-gray-400">{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center mt-8">
                    <div className="w-10 h-10 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && hasMore && movies.length > 0 && (
                <button 
                    onClick={loadMore}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 mt-8 block mx-auto"
                >
                    Cargar más películas
                </button>
            )}
        </div>
    );
};

export default CategoryView;
