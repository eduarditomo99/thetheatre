import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, toggleFollow } from '../services/socialApi';

const UserProfile = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(id);
                setProfileData(data);
            } catch (err) {
                setError('Error al cargar el perfil del usuario.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleFollowToggle = async () => {
        try {
            await toggleFollow(id);
            // Refresh profile data
            const data = await getUserProfile(id);
            setProfileData(data);
        } catch (err) {
            console.error('Error toggling follow status', err);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando perfil...</div>;
    if (error) return <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">{error}</div>;

    const { user, isFollowing, areMutuals } = profileData;

    return (
        <div className="min-h-screen bg-[#141414] text-white p-6 relative" style={{ paddingTop: '100px' }}>
            <button 
                onClick={() => window.history.back()} 
                className="absolute left-6 bg-transparent border border-[#555] text-[#ccc] px-4 py-2 rounded hover:bg-[#333] transition font-bold text-sm z-10"
                style={{ top: '100px' }}
            >
                ⬅ Volver
            </button>
            <div className="max-w-4xl mx-auto mt-12">
                <div className="bg-[#222] rounded-lg p-8 shadow-xl border border-[#333] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-black border-b border-[#333]"></div>
                    
                    <div className="relative mt-12 flex flex-col items-center sm:flex-row sm:items-end gap-6">
                        <div className="w-32 h-32 bg-[#e50914] border-4 border-[#141414] rounded-full flex items-center justify-center text-5xl font-bold shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-center sm:text-left mb-2">
                            <h1 className="text-4xl font-bold">{user.username}</h1>
                            <p className="text-[#aaa] text-lg">{user.nombre} {user.apellidos}</p>
                            {areMutuals && (
                                <span className="inline-block mt-2 px-3 py-1 bg-transparent text-[#e50914] rounded-full text-sm font-bold border border-[#e50914]">
                                    Mutuals
                                </span>
                            )}
                        </div>
                        <div className="flex gap-4">
                            {areMutuals && (
                                <Link 
                                    to={`/chat/${user.id}`} 
                                    className="px-6 py-2 bg-transparent border border-[#555] hover:bg-[#333] text-[#ccc] rounded font-medium transition flex items-center"
                                >
                                    Enviar Mensaje
                                </Link>
                            )}
                            <button 
                                onClick={handleFollowToggle}
                                className={`px-6 py-2 rounded font-bold transition ${
                                    isFollowing 
                                        ? 'bg-transparent border border-[#555] text-[#ccc] hover:text-white hover:border-[#999]' 
                                        : 'bg-[#e50914] text-white hover:bg-[#b0070f]'
                                }`}
                            >
                                {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-2">Actividad de {user.username}</h2>
                    <p className="text-[#aaa] bg-[#222] p-6 rounded text-center border border-[#333]">
                        {!isFollowing && !areMutuals 
                            ? "Sigue a este usuario para ver su actividad detallada." 
                            : "No hay actividad reciente para mostrar."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
