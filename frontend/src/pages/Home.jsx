import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';
import './Home.css';

// --- ICONOS SVG (Para no depender de librerías externas) ---
const SearchIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const Home = () => {
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [categories, setCategories] = useState({
        trending: [],
        topRated: [],
        action: [],
        comedy: [],
        horror: [],
        romance: [],
        documentary: [],
        drama: []
    });
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const imageUrl = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ejecutamos todas las peticiones en paralelo para que cargue más rápido
                const [trending, topRated, action, comedy, horror, romance, documentary, drama] = await Promise.all([
                    tmdbApi.get('/trending/movie/week'),
                    tmdbApi.get('/movie/top_rated'),
                    tmdbApi.get('/discover/movie?with_genres=28'),    // Acción
                    tmdbApi.get('/discover/movie?with_genres=35'),    // Comedia
                    tmdbApi.get('/discover/movie?with_genres=27'),    // Terror
                    tmdbApi.get('/discover/movie?with_genres=10749'), // Romance
                    tmdbApi.get('/discover/movie?with_genres=99'),    // Documental
                    tmdbApi.get('/discover/movie?with_genres=18'),    // Drama
                ]);

                setCategories({
                    trending: trending.data.results,
                    topRated: topRated.data.results,
                    action: action.data.results,
                    comedy: comedy.data.results,
                    horror: horror.data.results,
                    romance: romance.data.results,
                    documentary: documentary.data.results,
                    drama: drama.data.results,
                });

                // Banner aleatorio
                const random = Math.floor(Math.random() * trending.data.results.length);
                setFeaturedMovie(trending.data.results[random]);

            } catch (error) {
                console.error("Error cargando películas:", error);
            }
        };

        fetchData();

        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            console.log("Buscando:", searchTerm);
            // Aquí podrías redirigir a una página de búsqueda real
            // navigate(`/search?q=${searchTerm}`);
        }
    };

    return (
        <div className="home-container">
            {/* NAVBAR */}
            <nav className={`navbar ${isScrolled ? "nav-black" : ""}`}>
                <div className="nav-left">
                    <div className="logo" onClick={() => window.scrollTo(0, 0)}>The Theatre</div>
                    <span className="nav-link">Inicio</span>
                    <span className="nav-link">Series</span>
                    <span className="nav-link">Películas</span>
                </div>

                <div className="nav-right">
                    <form onSubmit={handleSearch} className="search-box">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Títulos, gente, géneros..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <div className="nav-icon" title="Ajustes"><SettingsIcon /></div>
                    <div className="nav-icon" title="Perfil"><UserIcon /></div>
                </div>
            </nav>

            {/* HERO (BANNER) */}
            {featuredMovie && (
                <header
                    className="hero"
                    style={{ backgroundImage: `url("${imageUrl}${featuredMovie.backdrop_path}")` }}
                >
                    <div className="hero-content">
                        <h1 className="hero-title">{featuredMovie.title || featuredMovie.name}</h1>
                        <p className="hero-desc">
                            {featuredMovie.overview ? featuredMovie.overview.substring(0, 150) + "..." : "Sin descripción."}
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-play" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>
                                ▶ Reproducir
                            </button>
                            <button className="btn btn-info" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>
                                ℹ Más Información
                            </button>
                        </div>
                    </div>
                    <div className="hero-fade-bottom"></div>
                </header>
            )}

            {/* LISTAS DE PELÍCULAS (TODOS LOS FILTROS) */}
            <div className="rows-container">
                <Row title="Tendencias de la Semana" movies={categories.trending} isLarge />
                <Row title="Mejor Valoradas" movies={categories.topRated} />
                <Row title="Acción y Aventura" movies={categories.action} />
                <Row title="Comedias para reír" movies={categories.comedy} />
                <Row title="Terror y Suspense" movies={categories.horror} />
                <Row title="Dramas Emocionantes" movies={categories.drama} />
                <Row title="Romance" movies={categories.romance} />
                <Row title="Documentales" movies={categories.documentary} />
            </div>
        </div>
    );
};

// COMPONENTE ROW (FILA)
const Row = ({ title, movies, isLarge }) => {
    const base_url = "https://image.tmdb.org/t/p/w500";
    const navigate = useNavigate();

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row-posters">
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        className={`poster-wrapper ${isLarge ? "large" : ""}`}
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        <img
                            className={`row-poster ${isLarge ? "row-posterLarge" : ""}`}
                            src={`${base_url}${isLarge ? movie.poster_path : movie.backdrop_path}`}
                            alt={movie.name}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                        {/* Título debajo de la película */}
                        <p className="movie-title">{movie.title || movie.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;