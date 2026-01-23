import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Login.css';

// Iconos SVG simples para no depender de librerías externas
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                // REGISTRO
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden.');
                    return;
                }

                await api.post('/api/auth/register', {
                    username: formData.username,
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    email: formData.email,
                    password: formData.password
                });

                alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
                setIsRegistering(false);
                setFormData({ ...formData, password: '', confirmPassword: '' });

            } else {
                // LOGIN (Usando EMAIL)
                const response = await api.post('/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                localStorage.setItem('token', response.data.token);
                navigate('/home');
            }
        } catch (err) {
            console.error(err);
            if (err.response) {
                if (!isRegistering && (err.response.status === 403 || err.response.status === 401)) {
                    setError('Contraseña o correo incorrectos.');
                } else if (err.response.data) {
                    setError(typeof err.response.data === 'string' ? err.response.data : 'Error en el registro. Verifica los datos.');
                } else {
                    setError('Ocurrió un error. Inténtalo de nuevo.');
                }
            } else {
                setError('Error de conexión con el servidor.');
            }
        }
    };

    return (
        <div className="login-container">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="auth-box"
            >
                <h1 className="title">The Theatre</h1>
                <p className="subtitle">Tu butaca reservada en el mundo del cine.</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="register-fields"
                        >
                            <div className="input-group">
                                <input type="text" name="username" placeholder="Nombre de usuario (Nick)" onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <input type="text" name="nombre" placeholder="Nombre real" onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
                            </div>
                        </motion.div>
                    )}

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {isRegistering && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="input-group"
                        >
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Repetir Contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="main-btn"
                        type="submit"
                    >
                        {isRegistering ? 'Crear Cuenta' : 'Entrar'}
                    </motion.button>
                </form>

                <p className="switch-text">
                    {isRegistering ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}
                    <button
                        className="link-btn"
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                        }}
                    >
                        {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;