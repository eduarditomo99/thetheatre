import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, tmdbApi } from '../services/api';
import './Profile.css';

// Componentes del Módulo Social
import SocialFeed from './SocialFeed';
import UserSearch from './UserSearch';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('movies');
    const [socialTab, setSocialTab] = useState('feed'); // Sub-pestaña social
    const [movieDetails, setMovieDetails] = useState({});
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        nombre: '', apellidos: '', password: '', confirmPassword: '', fotoPerfil: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get('/api/usuarios/perfil');
            setProfile(res.data);
            setFormData({
                nombre: res.data.nombre || '',
                apellidos: res.data.apellidos || '',
                password: '',
                confirmPassword: '',
                fotoPerfil: res.data.fotoPerfil || ''
            });

            if (res.data.historial) {
                res.data.historial.forEach(async (item) => {
                    try {
                        const tmdbRes = await tmdbApi.get(`/movie/${item.tmdbId}`);
                        setMovieDetails(prev => ({ ...prev, [item.tmdbId]: tmdbRes.data }));
                    } catch (err) { console.error(err); }
                });
            }
        } catch (error) {
            setErrorMsg("No se pudo cargar el perfil. ¿Has iniciado sesión?");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, fotoPerfil: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        try {
            await api.put('/api/usuarios/perfil', {
                nombre: formData.nombre,
                apellidos: formData.apellidos,
                password: formData.password,
                fotoPerfil: formData.fotoPerfil
            });
            alert("Perfil actualizado correctamente");
            loadProfile();
        } catch (err) {
            alert("Error al actualizar perfil");
        }
    };

    const handleDeleteMovie = async (e, idValoracion) => {
        e.stopPropagation();
        if (window.confirm("¿Seguro que quieres eliminar esta película de tu historial?")) {
            try {
                await api.delete(`/api/valoraciones/${idValoracion}`);
                loadProfile();
            } catch (err) {
                alert("Error al eliminar");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (errorMsg) return <div className="profile-error">{errorMsg} <button onClick={() => navigate('/')} className="btn-logout">Ir al Login</button></div>;
    if (!profile) return <div className="loading-screen">Cargando perfil...</div>;

    return (
        <div className="profile-wrapper">

            <header className="profile-header-bar">
                <button onClick={() => navigate(-1)} className="back-btn-profile"> ⬅ Volver </button>
                <h1 className="header-brand">THE THEATRE</h1>
            </header>

            <div className="profile-content-container">
                <aside className="profile-sidebar">
                    <div className="sidebar-header">
                        <div className="avatar-large">
                            {formData.fotoPerfil ? (
                                <img src={formData.fotoPerfil} alt="Avatar" className="avatar-img-real" />
                            ) : (
                                <span>{profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}</span>
                            )}
                        </div>

                        <label className="edit-avatar-btn">
                            📷 Cambiar Foto
                            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                        </label>

                        <h2 className="username-display">{profile.username}</h2>
                        <p className="email-display">{profile.email}</p>
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-item ${activeTab === 'movies' ? 'active' : ''}`} onClick={() => setActiveTab('movies')}>
                            🎬 Mis Películas
                        </button>
                        <button className={`nav-item ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>
                            👥 Social
                        </button>
                        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            ⚙️ Ajustes
                        </button>
                    </nav>

                    <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
                </aside>

                <main className="profile-main">
                    {activeTab === 'movies' && (
                        <div className="tab-section">
                            <h3>Películas Vistas ({profile.historial ? profile.historial.length : 0})</h3>
                            <div className="movies-grid">
                                {(!profile.historial || profile.historial.length === 0) && (
                                    <p className="empty-msg">No has guardado ninguna película aún.</p>
                                )}

                                {profile.historial && profile.historial.map((item) => {
                                    const movieData = movieDetails[item.tmdbId];
                                    return (
                                        <div key={item.id} className="profile-movie-card" onClick={() => navigate(`/movie/${item.tmdbId}`)}>
                                            {movieData ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${movieData.poster_path}`} alt="poster" />
                                            ) : <div className="placeholder-poster">...</div>}

                                            <div className="delete-btn-overlay" onClick={(e) => handleDeleteMovie(e, item.id)}>🗑️</div>

                                            <div className="card-overlay">
                                                {item.puntuacion > 0 && <span className="rate-badge">★ {item.puntuacion}</span>}
                                                {item.visto && <span className="view-badge">Visto</span>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="tab-section">
                            <div className="flex gap-6 mb-8 border-b border-[#333] pb-4 justify-center">
                                <button 
                                    className={`px-8 py-3 text-lg font-bold transition rounded border border-transparent ${socialTab === 'feed' ? 'bg-[#222] text-[#e50914] border-[#e50914]' : 'bg-transparent text-[#aaa] hover:bg-[#1f1f1f] hover:text-white border-[#333]'}`}
                                    onClick={() => setSocialTab('feed')}
                                >
                                    Mi Muro
                                </button>
                                <button 
                                    className={`px-8 py-3 text-lg font-bold transition rounded border border-transparent ${socialTab === 'search' ? 'bg-[#222] text-[#e50914] border-[#e50914]' : 'bg-transparent text-[#aaa] hover:bg-[#1f1f1f] hover:text-white border-[#333]'}`}
                                    onClick={() => setSocialTab('search')}
                                >
                                    Buscar Usuarios
                                </button>
                            </div>
                            
                            <div className="bg-[#141414] min-h-[500px]">
                                {socialTab === 'feed' ? <SocialFeed /> : <UserSearch />}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="tab-section">
                            <h3>Editar Perfil</h3>
                            <form onSubmit={handleUpdateProfile} className="settings-form">
                                <div className="input-group">
                                    <label>Nombre</label>
                                    <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Apellidos</label>
                                    <input type="text" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} />
                                </div>

                                <hr className="divider" />
                                <h4>Cambiar Contraseña</h4>
                                <div className="input-group">
                                    <label>Nueva Contraseña</label>
                                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Dejar en blanco para no cambiar" />
                                </div>
                                <div className="input-group">
                                    <label>Confirmar Contraseña</label>
                                    <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                                </div>

                                <button type="submit" className="save-btn">Guardar Cambios</button>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;