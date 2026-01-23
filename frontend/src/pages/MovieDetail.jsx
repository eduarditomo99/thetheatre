import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdbApi } from '../services/api';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState({ directors: [], writers: [] });
    const navigate = useNavigate();
    const imageUrl = "https://image.tmdb.org/t/p/original";
    const profileUrl = "https://image.tmdb.org/t/p/w185";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detailRes = await tmdbApi.get(`/movie/${id}?language=es-ES`);
                setMovie(detailRes.data);

                const creditsRes = await tmdbApi.get(`/movie/${id}/credits?language=es-ES`);

                setCast(creditsRes.data.cast.slice(0, 10));

                const directors = creditsRes.data.crew.filter(person => person.job === 'Director');
                const writers = creditsRes.data.crew.filter(person => person.department === 'Writing' || person.job === 'Screenplay' || person.job === 'Writer');

                const uniqueWriters = Array.from(new Set(writers.map(a => a.id)))
                    .map(id => writers.find(a => a.id === id));

                setCrew({ directors, writers: uniqueWriters });
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    if (!movie) return <div style={{ color: 'white', padding: 50, background: '#141414', height: '100vh' }}>Cargando...</div>;

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

    return (
        <div style={{
            backgroundImage: `linear-gradient(to right, rgba(20,20,20,1) 20%, rgba(20,20,20,0.7)), url(${imageUrl}${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            color: 'white',
            padding: '50px',
            paddingTop: '100px'
        }}>
            <button onClick={() => navigate('/home')} style={{
                padding: '10px 20px', cursor: 'pointer', marginBottom: 30, background: '#333', color: 'white', border: 'none', borderRadius: '4px'
            }}> ⬅ Volver </button>

            <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    style={{ borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.5)', maxWidth: '300px', width: '100%' }}
                    alt={movie.title}
                />

                <div style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', lineHeight: 1.1 }}>{movie.title}</h1>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', fontSize: '1.1rem', color: '#ccc' }}>
                        <span style={{ color: '#46d369', fontWeight: 'bold' }}>Puntuación: {Math.round(movie.vote_average * 10)}%</span>
                        <span>{movie.release_date.split('-')[0]}</span>
                        <span>{movie.runtime} min</span>
                    </div>

                    <p style={{ lineHeight: '1.6', fontSize: '1.2rem', marginBottom: '30px' }}>{movie.overview}</p>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#777', fontSize: '1rem', marginBottom: '5px' }}>Director:</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {crew.directors.map(d => <PersonLink key={d.id} person={d} />)}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#777', fontSize: '1rem', marginBottom: '5px' }}>Guionistas:</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {crew.writers.length > 0
                                ? crew.writers.map(w => <PersonLink key={w.id} person={w} />)
                                : <span>Desconocido</span>}
                        </div>
                    </div>

                    <div>
                        <h3 style={{ color: '#777', fontSize: '1rem', marginBottom: '10px' }}>Reparto Principal:</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {cast.map(actor => (
                                <div key={actor.id} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px' }}>
                                    <PersonLink person={actor} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;