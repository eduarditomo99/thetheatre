import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import PersonDetail from './pages/PersonDetail';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import CategoryView from './pages/CategoryView';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';

// Módulo Social
import SocialFeed from './pages/SocialFeed';
import UserSearch from './pages/UserSearch';
import UserProfile from './pages/UserProfile';
import PrivateChat from './pages/PrivateChat';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categoria/:nombre" element={<CategoryView />} />

        {/* Rutas Módulo Social */}
        <Route path="/feed" element={<div style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%', minHeight: '100vh', backgroundColor: '#141414' }}><SocialFeed /></div>} />
        <Route path="/users" element={<div style={{ paddingTop: '100px', paddingLeft: '4%', paddingRight: '4%', minHeight: '100vh', backgroundColor: '#141414' }}><UserSearch /></div>} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/chat/:id" element={<PrivateChat />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;