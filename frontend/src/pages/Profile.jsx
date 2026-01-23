import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Asegúrate de que esto importa tu instancia axios configurada
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'movies', 'social'
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // Estados para editar
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get('/usuarios/perfil');
            setUser(res.data);
            setFormData({
                nombre: res.data.nombre,
                apellidos: res.data.apellidos,
                fotoPerfil: res.data.fotoPerfil
            });
        } catch (error) {
            console.error("Error cargando perfil:", error);
            // NO REDIRIGIMOS AUTOMÁTICAMENTE para que veas el error
            setErrorMsg("No se pudo cargar el perfil. ¿Has iniciado sesión?");
        }
    };

    // Convertir imagen a Base64
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

    const handleSave = async () => {
        try {
            await api.put('/usuarios/perfil', formData);
            setEditMode(false);
            loadProfile(); // Recargar datos
        } catch (error) {
            alert("Error al guardar");
        }
    };

    const handleSearchUsers = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get(`/usuarios/buscar?query=${searchQuery}`);
            setSearchResults(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (errorMsg) return <div className="profile-error">{errorMsg} <button onClick={() => navigate('/')}>Ir al Login</button></div>;
    if (!user) return <div className="loading">Cargando...</div>;

    return (
        <div className="profile-page-container">
            <div className="profile-sidebar">
                <div className="avatar-section">
                    <img
                        src={formData.fotoPerfil || "https://via.placeholder.com/150"}
                        alt="Perfil"
                        className="profile-avatar-big"
                    />
                    {editMode && (
                        <label className="upload-btn">
                            📷 Cambiar Foto
                            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                        </label>
                    )}
                </div>
                <h2>{user.username}</h2>
                <p>{user.email}</p>

                <div className="stats-row">
                    <div className="stat"><span>0</span> Seguidores</div>
                    <div className="stat"><span>0</span> Seguidos</div>
                    <div className="stat"><span>{user.interacciones ? user.interacciones.length : 0}</span> Pelis</div>
                </div>

                <div className="menu-buttons">
                    <button onClick={() => setActiveTab('info')} className={activeTab === 'info' ? 'active' : ''}>Mis Datos</button>
                    <button onClick={() => setActiveTab('movies')} className={activeTab === 'movies' ? 'active' : ''}>Mis Películas</button>
                    <button onClick={() => setActiveTab('social')} className={activeTab === 'social' ? 'active' : ''}>Buscar Gente</button>
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} className="logout-btn">Cerrar Sesión</button>
                </div>
            </div>

            <div className="profile-main-content">

                {/* PESTAÑA INFO */}
                {activeTab === 'info' && (
                    <div className="tab-content">
                        <h3>Información Personal</h3>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                disabled={!editMode}
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos</label>
                            <input
                                disabled={!editMode}
                                value={formData.apellidos}
                                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                            />
                        </div>

                        {!editMode ? (
                            <button className="action-btn" onClick={() => setEditMode(true)}>Editar Perfil</button>
                        ) : (
                            <div className="edit-actions">
                                <button className="save-btn" onClick={handleSave}>Guardar</button>
                                <button className="cancel-btn" onClick={() => { setEditMode(false); loadProfile() }}>Cancelar</button>
                            </div>
                        )}
                    </div>
                )}

                {/* PESTAÑA PELÍCULAS */}
                {activeTab === 'movies' && (
                    <div className="tab-content">
                        <h3>Historial de Películas</h3>
                        <div className="movies-grid-profile">
                            {user.interacciones && user.interacciones.map(movie => (
                                <div key={movie.id} className="movie-card-mini">
                                    <img src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`} alt={movie.titulo} />
                                    <div className="movie-info-mini">
                                        <h4>{movie.titulo}</h4>
                                        {movie.visto && <span className="tag-seen">👁 Visto</span>}
                                        {movie.puntuacion > 0 && <span className="tag-rate">★ {movie.puntuacion}</span>}
                                        <p className="comment-preview">"{movie.comentario}"</p>
                                    </div>
                                </div>
                            ))}
                            {(!user.interacciones || user.interacciones.length === 0) && <p>Aún no has guardado ninguna película.</p>}
                        </div>
                    </div>
                )}

                {/* PESTAÑA SOCIAL */}
                {activeTab === 'social' && (
                    <div className="tab-content">
                        <h3>Buscar Usuarios</h3>
                        <form onSubmit={handleSearchUsers} className="search-users-form">
                            <input
                                type="text"
                                placeholder="Buscar por nombre de usuario..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit">Buscar</button>
                        </form>

                        <div className="users-list">
                            {searchResults.map(u => (
                                <div key={u.id} className="user-card">
                                    <img src={u.fotoPerfil || "https://via.placeholder.com/50"} alt="Avatar" />
                                    <span>{u.username}</span>
                                    <button className="follow-btn">Seguir (Pronto)</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;