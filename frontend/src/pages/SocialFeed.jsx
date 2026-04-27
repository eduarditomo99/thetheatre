import React, { useState, useEffect } from 'react';
import { getFeed } from '../services/socialApi';
import { Link } from 'react-router-dom';

const SocialFeed = () => {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await getFeed();
                setFeed(data);
            } catch (err) {
                setError('Error al cargar el muro de actividad.');
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    if (loading) return <div className="w-full text-center py-10">Cargando actividad...</div>;
    if (error) return <div className="w-full text-center text-red-500 py-10">{error}</div>;

    return (
        <div className="w-full text-white">
            <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-4">Muro de Actividad</h2>
            {feed.length === 0 ? (
                <p className="text-[#aaa]">Aún no hay actividad. ¡Busca usuarios y síguelos!</p>
            ) : (
                <div className="space-y-6">
                    {feed.map((review) => (
                        <div key={review.id} className="bg-[#222] rounded p-6 shadow-lg border border-transparent transition transform hover:-translate-y-1 hover:border-[#333]">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-[#e50914] rounded-full flex items-center justify-center font-bold text-lg mr-4 border-2 border-[#1f1f1f]">
                                    {review.user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <Link to={`/user/${review.user.id}`} className="font-semibold text-lg hover:text-[#e50914] transition">
                                        {review.user?.username}
                                    </Link>
                                    <p className="text-sm text-[#777]">
                                        {new Date(review.watchedAt || review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-[#ccc]">Reseñó la película con ID: <span className="font-semibold text-white">{review.tmdbId}</span></span>
                                {review.rating && (
                                    <span className="ml-3 text-[#fca311] font-bold">★ {review.rating}/10</span>
                                )}
                            </div>
                            {review.comment && (
                                <p className="text-[#ddd] bg-[#141414] p-4 rounded italic border-l-4 border-[#e50914]">
                                    "{review.comment}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SocialFeed;
