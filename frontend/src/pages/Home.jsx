import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';
import './Home.css';

const Home = () => {
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const navigate = useNavigate();

    // URL base para las imágenes de TMDB
    const imageUrl = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Pedir Tendencias
                const trendingRes = await tmdbApi.get('/trending/movie/week');
                setTrending(trendingRes.data.results);

                // 2. Elegir una al azar para el Banner Principal
                const random = Math.floor(Math.random() * trendingRes.data.results.length);
                setFeaturedMovie(trendingRes.data.results[random]);

                // 3. Pedir Top Rated
                const topRes = await tmdbApi.get('/movie/top_rated');
                setTopRated(topRes.data.results);

                // 4. Pedir Acción (Genre ID 28)
                const actionRes = await tmdbApi.get('/discover/movie?with_genres=28');
                setActionMovies(actionRes.data.results);

            } catch (error) {
                console.error("Error cargando películas:", error);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="home-container">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">The Theatre</div>
                <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                </button>
            </nav>

            {/* HERO SECTION (Banner) */}
            {featuredMovie && (
                <header
                    className="hero"
                    style={{
                        backgroundImage: `url("${imageUrl}${featuredMovie.backdrop_path}")`
                    }}
                >
                    <div className="hero-content">
                        <h1 className="hero-title">{featuredMovie.title}</h1>
                        <p className="hero-desc">
                            {featuredMovie.overview
                                ? featuredMovie.overview.substring(0, 150) + "..."
                                : "Sin descripción disponible."}
                        </p>
                        <div className="hero-buttons">
                            <button className="btn-play">Reproducir</button>
                            <button className="btn-info">Más Info</button>
                        </div>
                    </div>
                    <div className="hero-fade-bottom"></div>
                </header>
            )}

            {/* FILAS DE PELÍCULAS */}
            <div className="rows-container">
                <Row title="Tendencias de la Semana" movies={trending} />
                <Row title="Mejor Valoradas" movies={topRated} isLarge />
                <Row title="Películas de Acción" movies={actionMovies} />
            </div>
        </div>
    );
};

// Componente auxiliar para las filas (Row)
const Row = ({ title, movies, isLarge }) => {
    const base_url = "https://image.tmdb.org/t/p/w500";

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row-posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        className={`row-poster ${isLarge && "row-posterLarge"}`}
                        src={`${base_url}${isLarge ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name}
                        // Fallback por si la imagen viene rota
                        onError={(e) => e.target.style.display = 'none'}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;