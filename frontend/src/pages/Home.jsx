import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';
import './Home.css';

const SearchIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const UserIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const ChevronLeft = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRight = () => (<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);

const Home = () => {
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [categories, setCategories] = useState({
        trending: [], topRated: [], action: [], comedy: [], horror: [], romance: [], documentary: [], drama: []
    });
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const navigate = useNavigate();
    const imageUrl = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trending, topRated, action, comedy, horror, romance, documentary, drama] = await Promise.all([
                    tmdbApi.get('/trending/movie/week'),
                    tmdbApi.get('/movie/top_rated'),
                    tmdbApi.get('/discover/movie?with_genres=28'),
                    tmdbApi.get('/discover/movie?with_genres=35'),
                    tmdbApi.get('/discover/movie?with_genres=27'),
                    tmdbApi.get('/discover/movie?with_genres=10749'),
                    tmdbApi.get('/discover/movie?with_genres=99'),
                    tmdbApi.get('/discover/movie?with_genres=18'),
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

                const random = Math.floor(Math.random() * trending.data.results.length);
                setFeaturedMovie(trending.data.results[random]);
            } catch (error) { console.error("Error cargando películas:", error); }
        };
        fetchData();

        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
            setShowMobileSearch(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="home-container">
            <nav className={`navbar ${isScrolled ? "nav-black" : ""}`}>
                <div className="nav-left">
                    <div className="logo" onClick={() => window.scrollTo(0, 0)}>The Theatre</div>
                    <span className="nav-link">Inicio</span>
                    <span className="nav-link">Series</span>
                    <span className="nav-link">Películas</span>
                </div>

                <div className="nav-center">
                    <form onSubmit={handleSearch} className="search-box">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Buscar títulos, actores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div className="nav-right">
                    <div className="mobile-search-icon" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                        <SearchIcon />
                    </div>

                    <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                        <UserIcon />
                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                    👤 Mi Perfil
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item logout" onClick={handleLogout}>
                                    Cerrar Sesión
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {showMobileSearch && (
                <div className="mobile-search-bar">
                    <form onSubmit={handleSearch}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>
            )}

            {featuredMovie && (
                <header
                    className="hero"
                    style={{ backgroundImage: `url("${imageUrl}${featuredMovie.backdrop_path}")` }}
                >
                    <div className="hero-content">
                        <h1 className="hero-title">{featuredMovie.title || featuredMovie.name}</h1>
                        <p className="hero-desc">{featuredMovie.overview?.substring(0, 150)}...</p>
                        <div className="hero-buttons">
                            <button className="btn btn-play" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>▶ Reproducir</button>
                            <button className="btn btn-info" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>ℹ Más Info</button>
                        </div>
                    </div>
                    <div className="hero-fade-bottom"></div>
                </header>
            )}

            <div className="rows-container">
                <Row title="Tendencias" movies={categories.trending} isLarge />
                <Row title="Mejor Valoradas" movies={categories.topRated} />
                <Row title="Acción" movies={categories.action} />
                <Row title="Comedia" movies={categories.comedy} />
                <Row title="Terror" movies={categories.horror} />
                <Row title="Romance" movies={categories.romance} />
                <Row title="Documentales" movies={categories.documentary} />
            </div>
        </div>
    );
};

const Row = ({ title, movies, isLarge }) => {
    const base_url = "https://image.tmdb.org/t/p/w500";
    const navigate = useNavigate();
    const rowRef = useRef(null);

    const scroll = (offset) => {
        if (rowRef.current) {
            rowRef.current.scrollLeft += offset;
        }
    };

    return (
        <div className="row">
            <h2>{title}</h2>
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
                                alt={movie.name}
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

export default Home;