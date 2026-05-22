import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tmdbApi } from '../services/api';

const ChevronLeft = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRight = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);

const Row = ({ title, endpoint, isLarge }) => {
    const [movies, setMovies] = useState([]);
    const base_url = "https://image.tmdb.org/t/p/w500";
    const navigate = useNavigate();
    const rowRef = useRef(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await tmdbApi.get(endpoint);
                setMovies(response.data.results);
            } catch (error) {
                console.error(`Error cargando películas para ${title}:`, error);
            }
        };
        if (endpoint) {
            fetchMovies();
        }
    }, [endpoint, title]);

    const scroll = (offset) => {
        if (rowRef.current) {
            rowRef.current.scrollLeft += offset;
        }
    };

    if (movies.length === 0) return null;

    // Crear un slug básico para la URL
    const slug = title.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return (
        <div className="row">
            <div className="flex flex-col items-start mb-4 px-4 gap-1">
                <h2 className="text-xl md:text-2xl font-bold text-white m-0">{title}</h2>
                <Link to={`/categoria/${slug}`} state={{ endpoint, title }} className="text-sm font-semibold text-gray-400 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                    Ver todo
                </Link>
            </div>
            <div className={`row-slider-container ${isLarge ? "is-large" : ""}`}>
                <div className="slider-arrow left" onClick={() => scroll(-300)}>
                    <ChevronLeft />
                </div>
                <div className="row-posters" ref={rowRef}>
                    {movies.map(movie => (
                        <div
                            key={movie.id}
                            className={`poster-wrapper ${isLarge ? "large" : ""}`}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            <img
                                className={`row-poster ${isLarge ? "row-posterLarge" : ""}`}
                                src={`${base_url}${isLarge ? movie.poster_path : movie.backdrop_path}`}
                                alt={movie.title || movie.name}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <p className="movie-title">{movie.title || movie.name}</p>
                        </div>
                    ))}
                </div>
                <div className="slider-arrow right" onClick={() => scroll(300)}>
                    <ChevronRight />
                </div>
            </div>
        </div>
    );
};

export default Row;
