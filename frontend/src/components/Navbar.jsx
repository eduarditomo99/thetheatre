import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const SearchIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const UserIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm}`);
            setShowMobileSearch(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // No mostrar el navbar en Login ni en Perfil
    if (location.pathname === '/' || location.pathname === '/profile') {
        return null;
    }

    return (
        <>
            <nav className={`navbar ${isScrolled ? "nav-black" : ""}`}>
                <div className="nav-left">
                    <div className="logo" onClick={() => navigate('/home')}>The Theatre</div>
                    <span className="nav-link" onClick={() => navigate('/home')}>Inicio</span>
                    <span className="nav-link" onClick={() => navigate('/feed')}>Mi Muro</span>
                    <span className="nav-link" onClick={() => navigate('/users')}>Comunidad</span>
                </div>

                <div className="nav-center">
                    <form onSubmit={handleSearch} className="search-box">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Buscar títulos, actores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                <div className="nav-right">
                    <div className="mobile-search-icon" onClick={() => setShowMobileSearch(!showMobileSearch)}>
                        <SearchIcon />
                    </div>

                    <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                        <UserIcon />
                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                    👤 Mi Perfil
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item logout" onClick={handleLogout}>
                                    Cerrar Sesión
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {showMobileSearch && (
                <div className="mobile-search-bar">
                    <form onSubmit={handleSearch}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>
            )}
        </>
    );
};

export default Navbar;
