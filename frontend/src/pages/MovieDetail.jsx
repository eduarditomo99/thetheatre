import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdbApi, api } from '../services/api';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState({ directors: [], writers: [], musicians: [] });

    const [ratingInput, setRatingInput] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [isWatched, setIsWatched] = useState(false);
    const [loadingInteraction, setLoadingInteraction] = useState(false);

    const imageUrl = "https://image.tmdb.org/t/p/original";
    const posterUrl = "https://image.tmdb.org/t/p/w500";
    const profileUrl = "https://image.tmdb.org/t/p/w185";

    useEffect(() => {
        setMovie(null);
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                const detailRes = await tmdbApi.get(`/movie/${id}`);
                setMovie(detailRes.data);

                const creditsRes = await tmdbApi.get(`/movie/${id}/credits`);
                setCast(creditsRes.data.cast.slice(0, 10));

                const directors = creditsRes.data.crew.filter(p => p.job === 'Director');
                const writers = creditsRes.data.crew.filter(p => p.department === 'Writing' || p.job === 'Screenplay' || p.job === 'Writer');
                const musicians = creditsRes.data.crew.filter(p => p.job === 'Original Music Composer' || p.job === 'Music');

                const uniqueWriters = Array.from(new Set(writers.map(a => a.id)))
                    .map(id => writers.find(a => a.id === id));

                const uniqueMusicians = Array.from(new Set(musicians.map(a => a.id)))
                    .map(id => musicians.find(a => a.id === id));

                setCrew({ directors, writers: uniqueWriters, musicians: uniqueMusicians });

                setRatingInput("");
                setCommentInput("");
                setIsWatched(false);

                try {
                    const myInteraction = await api.get(`/api/valoraciones/pelicula/${id}`);
                    if (myInteraction.data) {
                        setIsWatched(myInteraction.data.visto);
                        if (myInteraction.data.puntuacion) {
                            setRatingInput(myInteraction.data.puntuacion.toString().replace('.', ','));
                        }
                        if (myInteraction.data.resena) {
                            setCommentInput(myInteraction.data.resena);
                        }
                    }
                } catch (err) {
                    console.log("No interaction found");
                }

            } catch (error) {
                console.error("Error fetching movie:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleRatingChange = (e) => {
        const val = e.target.value;
        const regex = /^([0-9](,[0-9]?)?|10)?$/;
        if (regex.test(val)) {
            setRatingInput(val);
        }
    };

    const saveInteraction = async (newWatchedState) => {
        setLoadingInteraction(true);
        try {
            let numericRating = 0;
            if (ratingInput) {
                numericRating = parseFloat(ratingInput.replace(',', '.'));
            }

            const finalWatchedState = numericRating > 0 ? true : newWatchedState;

            const payload = {
                tmdbId: movie.id,
                puntuacion: numericRating,
                visto: finalWatchedState,
                resena: commentInput
            };

            await api.post('/api/valoraciones', payload);
            setIsWatched(finalWatchedState);
            alert("✅ Guardado correctamente");

        } catch (error) {
            console.error(error);
            alert("Error al guardar. Asegúrate de haber iniciado sesión.");
        } finally {
            setLoadingInteraction(false);
        }
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

    // Enlace directo a la búsqueda interna de Spotify
    const SpotifyLink = ({ person }) => (
        <div className="person-hover-container">
            <a
                href={`https://open.spotify.com/search/${encodeURIComponent(person.name)}`}
                target="_blank"
                rel="noreferrer"
                className="person-link"
            >
                {person.name}
            </a>
            {person.profile_path && (
                <div className="person-tooltip">
                    <img src={`${profileUrl}${person.profile_path}`} alt={person.name} />
                </div>
            )}
        </div>
    );

    if (!movie) return <div className="loading-screen" style={{ color: 'white', paddingTop: '100px', textAlign: 'center' }}>Cargando...</div>;

    return (
        <div className="movie-detail-container" style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,1) 20%, rgba(20,20,20,0.6)), url(${imageUrl}${movie.backdrop_path})`
        }}>
            <button onClick={() => navigate(-1)} className="back-btn"> ⬅ Volver </button>

            <div className="detail-content">
                <div className="poster-section">
                    <img
                        src={`${posterUrl}${movie.poster_path}`}
                        className="detail-poster"
                        alt={movie.title}
                    />

                    <div className="user-actions-card">
                        <h3>Tu Actividad</h3>
                        <div className="rating-input-container">
                            <label>Tu Nota (0-10):</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={ratingInput}
                                    onChange={handleRatingChange}
                                    placeholder="Ej: 8,5"
                                    className="rating-box"
                                />
                            </div>
                        </div>

                        <div className="comment-container">
                            <label>Reseña:</label>
                            <textarea
                                className="comment-box"
                                placeholder="Escribe tu opinión aquí..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            />
                        </div>

                        <button
                            className={`btn-watch ${isWatched ? 'watched' : ''}`}
                            onClick={() => saveInteraction(true)}
                            disabled={loadingInteraction}
                        >
                            {loadingInteraction ? 'Guardando...' : (isWatched ? '✅ Actualizar Datos' : '💾 Guardar / Marcar Visto')}
                        </button>
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
                            <div className="cast-chips">
                                {crew.directors.map(d => <PersonLink key={d.id} person={d} />)}
                            </div>
                        </div>

                        <div className="credit-group">
                            <h3>Guionistas:</h3>
                            <div className="cast-chips">
                                {crew.writers.length > 0
                                    ? crew.writers.map(w => <PersonLink key={w.id} person={w} />)
                                    : <span>Desconocido</span>}
                            </div>
                        </div>

                        {crew.musicians.length > 0 && (
                            <div className="credit-group">
                                <h3>Banda Sonora:</h3>
                                <div className="cast-chips">
                                    {crew.musicians.map(m => <SpotifyLink key={m.id} person={m} />)}
                                </div>
                            </div>
                        )}

                        <div className="credit-group">
                            <h3>Reparto:</h3>
                            <div className="cast-chips">
                                {cast.map(actor => (
                                    <PersonLink key={actor.id} person={actor} />
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