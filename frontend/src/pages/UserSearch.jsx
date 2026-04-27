import React, { useState } from 'react';
import { searchUsers } from '../services/socialApi';
import { Link } from 'react-router-dom';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const data = await searchUsers(query);
            setResults(data);
        } catch (error) {
            console.error('Error buscando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full text-white">
            <h2 className="text-2xl font-bold mb-6 border-b border-[#333] pb-4">Buscar Usuarios</h2>
            
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nombre de usuario..."
                        className="flex-1 bg-[#333] border border-[#444] text-white rounded px-4 py-3 focus:outline-none focus:border-[#e50914] transition"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-[#e50914] text-white px-6 py-3 rounded font-bold transition hover:bg-red-700"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                {results.length === 0 && query && !loading && (
                    <p className="text-[#aaa]">No se encontraron usuarios.</p>
                )}
                {results.map(user => (
                    <Link key={user.id} to={`/user/${user.id}`} className="block">
                        <div className="bg-[#222] rounded p-4 flex items-center justify-between hover:bg-[#1f1f1f] transition cursor-pointer border border-transparent hover:border-[#333]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#e50914] rounded-full flex items-center justify-center font-bold text-xl border-2 border-[#1f1f1f]">
                                    {(user.nick || user.username).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{user.nick || user.username}</h3>
                                    <p className="text-sm text-[#777]">{user.nombre} {user.apellidos}</p>
                                </div>
                            </div>
                            <span className="text-[#e50914] font-medium">Ver Perfil &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UserSearch;
