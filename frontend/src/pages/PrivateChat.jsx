import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChatHistory, sendMessage, getUserProfile } from '../services/socialApi';

const PrivateChat = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const profileData = await getUserProfile(id);
                if (!profileData.areMutuals) {
                    setError('No puedes chatear con este usuario porque no sois mutuals.');
                    setLoading(false);
                    return;
                }
                setTargetUser(profileData.user);
                const history = await getChatHistory(id);
                setMessages(history);
            } catch (err) {
                setError('Error al cargar el chat.');
            } finally {
                setLoading(false);
            }
        };
        fetchChatData();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        try {
            const sentMsg = await sendMessage(id, newMessage);
            setMessages([...messages, sentMsg]);
            setNewMessage('');
        } catch (err) {
            console.error('Error enviando mensaje', err);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando chat...</div>;
    if (error) return <div className="min-h-screen bg-gray-900 text-red-500 flex items-center justify-center">{error}</div>;

    return (
        <div className="min-h-screen bg-[#141414] text-white flex flex-col" style={{ paddingTop: '70px' }}>
            {/* Header */}
            <div className="bg-[#222] border-b border-[#333] p-4 shadow-md z-10 flex items-center">
                <button onClick={() => window.history.back()} className="mr-4 text-[#aaa] hover:text-white transition">
                    &larr; Volver
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e50914] rounded-full flex items-center justify-center font-bold">
                        {targetUser?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="font-semibold">{targetUser?.username}</h2>
                        <p className="text-xs text-[#e50914] font-bold">Mutual</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#141414]">
                {messages.length === 0 ? (
                    <div className="text-center text-[#777] mt-10">
                        No hay mensajes aún. ¡Envía el primer mensaje!
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        // Aquí asumimos que el msg.sender.id igual a id es el targetUser, por tanto el resto somos nosotros
                        const isMine = msg.sender.id !== parseInt(id);
                        return (
                            <div key={msg.id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                                    isMine 
                                        ? 'bg-[#e50914] text-white rounded-br-none' 
                                        : 'bg-[#222] text-[#ddd] rounded-bl-none border border-[#333]'
                                }`}>
                                    <p className="break-words">{msg.content}</p>
                                    <span className={`text-xs block mt-2 ${isMine ? 'text-white/70' : 'text-[#777]'}`}>
                                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#222] p-4 border-t border-[#333]">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-[#333] border border-[#444] text-white rounded-full px-6 py-3 focus:outline-none focus:border-[#e50914] transition"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-[#e50914] hover:bg-[#b0070f] disabled:bg-[#444] disabled:text-[#888] disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-bold transition"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PrivateChat;
