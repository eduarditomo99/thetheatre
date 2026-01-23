import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbApi } from '../services/api';

const PersonDetail = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const navigate = useNavigate();
    const base_url = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const personRes = await tmdbApi.get(`/person/${id}?language=es-ES`);
                setPerson(personRes.data);

                const creditsRes = await tmdbApi.get(`/person/${id}/combined_credits?language=es-ES`);

                const sortedCredits = creditsRes.data.cast
                    .filter(item => item.poster_path)
                    .sort((a, b) => b.popularity - a.popularity);

                setCredits(sortedCredits);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    if (!person) return <div style={{ backgroundColor: '#141414', height: '100vh' }}></div>;

    return (
        <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white', padding: '100px 40px' }}>
            <button onClick={() => navigate(-1)} style={{
                background: '#333', border: 'none', color: 'white',
                padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginBottom: '30px'
            }}>
                ← Volver
            </button>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '50px' }}>
                <img
                    src={person.profile_path ? `${base_url}${person.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={person.name}
                    style={{ borderRadius: '10px', width: '300px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{person.name}</h1>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>
                        {person.birthday} {person.place_of_birth && `| ${person.place_of_birth}`}
                    </p>
                    <h3 style={{ marginBottom: '10px' }}>Biografía</h3>
                    <p style={{ lineHeight: '1.6', color: '#ccc' }}>
                        {person.biography || "No hay biografía disponible en español."}
                    </p>
                </div>
            </div>

            <h2>Filmografía y Apariciones</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {credits.map(item => (
                    <div
                        key={item.id}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => navigate(`/movie/${item.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img
                            src={`${base_url}${item.poster_path}`}
                            alt={item.title || item.name}
                            style={{ width: '100%', borderRadius: '4px' }}
                        />
                        <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '5px' }}>{item.title || item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonDetail;