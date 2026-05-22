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
        <div className="min-h-screen bg-[#141414] text-white pt-[100px] px-[4%] pb-12">
            <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="bg-transparent border border-[#555] text-[#ccc] px-4 py-2 rounded hover:bg-[#333] transition font-bold text-sm"
                >
                    ⬅ Volver
                </button>
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map(movie => (
                    <div 
                        key={`${movie.id}-${Math.random()}`}
                        className="cursor-pointer group relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 shadow-lg border border-transparent hover:border-[#555]"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        <img 
                            src={movie.poster_path ? `${base_url}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Imagen'} 
                            alt={movie.title || movie.name}
                            className="w-full h-auto object-cover aspect-[2/3]"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x750?text=Sin+Imagen'; }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-opacity duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                            <h3 className="font-bold text-sm mb-1">{movie.title || movie.name}</h3>
                            <div className="flex justify-between items-center text-xs text-[#aaa]">
                                <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                                <span className="bg-[#e50914] text-white px-2 py-0.5 rounded font-bold">{Math.round(movie.vote_average * 10)}%</span>
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
                <div className="flex justify-center mt-12">
                    <button 
                        onClick={loadMore}
                        className="bg-[#e50914] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
                    >
                        Cargar más películas
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryView;
