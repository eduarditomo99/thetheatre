import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdbApi, api } from '../services/api';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState({ directors: [], writers: [] });

    const [userRating, setUserRating] = useState(0);
    const [isWatched, setIsWatched] = useState(false);
    const [loadingInteraction, setLoadingInteraction] = useState(false);

    const imageUrl = "https://image.tmdb.org/t/p/original";
    const posterUrl = "https://image.tmdb.org/t/p/w500";
    const profileUrl = "https://image.tmdb.org/t/p/w185";

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                const detailRes = await tmdbApi.get(`/movie/${id}`);
                setMovie(detailRes.data);

                const creditsRes = await tmdbApi.get(`/movie/${id}/credits`);
                setCast(creditsRes.data.cast.slice(0, 10));

                const directors = creditsRes.data.crew.filter(p => p.job === 'Director');
                const writers = creditsRes.data.crew.filter(p => p.department === 'Writing' || p.job === 'Screenplay' || p.job === 'Writer');
                const uniqueWriters = Array.from(new Set(writers.map(a => a.id)))
                    .map(id => writers.find(a => a.id === id));
                setCrew({ directors, writers: uniqueWriters });

                try {
                    const myInteraction = await api.get(`/api/valoraciones/pelicula/${id}`);
                    if (myInteraction.data) {
                        setIsWatched(myInteraction.data.visto);
                        setUserRating(myInteraction.data.puntuacion || 0);
                    }
                } catch (err) {
                    console.log(err);
                }

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const saveInteraction = async (newWatchedState, newRating) => {
        setLoadingInteraction(true);
        try {
            const payload = {
                tmdbId: movie.id,
                puntuacion: newRating,
                visto: newWatchedState
            };

            await api.post('/api/valoraciones', payload);

            setIsWatched(newWatchedState);
            setUserRating(newRating);

        } catch (error) {
            console.error(error);
            alert("Error al guardar. Asegúrate de haber iniciado sesión.");
        } finally {
            setLoadingInteraction(false);
        }
    };

    const handleToggleWatched = () => {
        saveInteraction(!isWatched, userRating);
    };

    const handleRate = (rate) => {
        saveInteraction(true, rate);
    };

    const PersonLink = ({ person }) => (
        <div className="person-hover-container">
            <Link to={`/person/${person.id}`} className="person-link">
                {person.name}
            </Link>
            {person.profile_path && (
                <div className="person-tooltip">
                    <img src={`${profileUrl}${person.profile_path}`} alt={person.name} />
                </div>
            )}
        </div>
    );

    if (!movie) return <div className="loading-screen">Cargando...</div>;

    return (
        <div className="movie-detail-container" style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,1) 20%, rgba(20,20,20,0.6)), url(${imageUrl}${movie.backdrop_path})`
        }}>
            <button onClick={() => navigate('/home')} className="back-btn"> ⬅ Volver </button>

            <div className="detail-content">
                <div className="poster-section">
                    <img
                        src={`${posterUrl}${movie.poster_path}`}
                        className="detail-poster"
                        alt={movie.title}
                    />

                    <div className="user-actions-card">
                        <h3>Tu Actividad</h3>
                        <button
                            className={`btn-watch ${isWatched ? 'watched' : ''}`}
                            onClick={handleToggleWatched}
                            disabled={loadingInteraction}
                        >
                            {isWatched ? '✅ Visto' : '👁 Marcar como Visto'}
                        </button>

                        <div className="rating-area">
                            <span>Tu nota: </span>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= userRating ? 'filled' : ''}`}
                                    onClick={() => handleRate(star)}
                                    style={{ cursor: 'pointer', fontSize: '1.2rem', color: star <= userRating ? '#fca311' : '#555' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h1 className="movie-title-large">{movie.title}</h1>

                    <div className="meta-data">
                        <span className="score-tag">TMDB: {Math.round(movie.vote_average * 10)}%</span>
                        <span>{movie.release_date?.split('-')[0]}</span>
                        <span>{movie.runtime} min</span>
                    </div>

                    <p className="overview-text">{movie.overview}</p>

                    <div className="credits-section">
                        <div className="credit-group">
                            <h3>Director:</h3>
                            <div className="credit-list">
                                {crew.directors.map(d => <PersonLink key={d.id} person={d} />)}
                            </div>
                        </div>

                        <div className="credit-group">
                            <h3>Guionistas:</h3>
                            <div className="credit-list">
                                {crew.writers.length > 0
                                    ? crew.writers.map(w => <PersonLink key={w.id} person={w} />)
                                    : <span>Desconocido</span>}
                            </div>
                        </div>

                        <div className="credit-group">
                            <h3>Reparto:</h3>
                            <div className="cast-chips">
                                {cast.map(actor => (
                                    <div key={actor.id} className="cast-chip">
                                        <PersonLink person={actor} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;