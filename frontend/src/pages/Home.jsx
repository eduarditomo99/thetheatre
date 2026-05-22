import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';
import Row from '../components/Row';
import './Home.css';

const Home = () => {
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const navigate = useNavigate();
    const imageUrl = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const trending = await tmdbApi.get('/trending/movie/week');
                const random = Math.floor(Math.random() * trending.data.results.length);
                setFeaturedMovie(trending.data.results[random]);
            } catch (error) { 
                console.error("Error cargando película destacada:", error); 
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="home-container">
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
                <Row title="Tendencias" endpoint="/trending/movie/week" isLarge />
                <Row title="Mejor Valoradas" endpoint="/movie/top_rated" />
                <Row title="Acción" endpoint="/discover/movie?with_genres=28" />
                <Row title="Ciencia Ficción" endpoint="/discover/movie?with_genres=878" />
                <Row title="Terror" endpoint="/discover/movie?with_genres=27" />
                <Row title="Thriller" endpoint="/discover/movie?with_genres=53" />
                <Row title="Comedia" endpoint="/discover/movie?with_genres=35" />
                <Row title="Drama" endpoint="/discover/movie?with_genres=18" />
                <Row title="Romance" endpoint="/discover/movie?with_genres=10749" />
                <Row title="Animación" endpoint="/discover/movie?with_genres=16" />
                <Row title="Familia" endpoint="/discover/movie?with_genres=10751" />
                <Row title="Documentales" endpoint="/discover/movie?with_genres=99" />
            </div>
        </div>
    );
};

export default Home;