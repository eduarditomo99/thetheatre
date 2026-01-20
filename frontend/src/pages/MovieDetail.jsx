import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';

const MovieDetail = () => {
    const { id } = useParams(); // Obtenemos el ID de la URL
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();
    const imageUrl = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await tmdbApi.get(`/movie/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Error cargando detalles:", error);
            }
        };
        fetchDetail();
    }, [id]);

    if (!movie) return <div style={{ color: 'white', padding: 50 }}>Cargando...</div>;

    return (
        <div style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${imageUrl}${movie.backdrop_path})`,
            backgroundSize: 'cover',
            minHeight: '100vh',
            color: 'white',
            padding: '50px'
        }}>
            <button onClick={() => navigate('/home')} style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: 20 }}>
                ⬅ Volver
            </button>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    style={{ borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                    alt={movie.title}
                />
                <div style={{ maxWidth: '600px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{movie.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#fca311' }}>⭐ {movie.vote_average.toFixed(1)} / 10</p>
                    <p style={{ marginTop: '20px', lineHeight: '1.6', fontSize: '1.1rem' }}>{movie.overview}</p>
                    <p style={{ marginTop: '20px', color: '#aaa' }}>Fecha de estreno: {movie.release_date}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;