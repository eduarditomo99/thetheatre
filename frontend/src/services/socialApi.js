import { api } from './api';

export const searchUsers = async (query) => {
    const response = await api.get(`/api/social/search?q=${query}`);
    return response.data;
};

export const getUserProfile = async (userId) => {
    const response = await api.get(`/api/social/profile/${userId}`);
    return response.data;
};

export const toggleFollow = async (userId) => {
    const response = await api.post(`/api/social/follow/${userId}`);
    return response.data;
};

export const getFeed = async () => {
    const response = await api.get('/api/social/feed');
    return response.data;
};

export const sendMessage = async (receiverId, content) => {
    const response = await api.post(`/api/social/messages/${receiverId}`, { content });
    return response.data;
};

export const getChatHistory = async (userId) => {
    const response = await api.get(`/api/social/messages/history/${userId}`);
    return response.data;
};

export const addPrivateComment = async (reviewId, content) => {
    const response = await api.post(`/api/social/reviews/${reviewId}/comments`, { content });
    return response.data;
};

export const getPrivateComments = async (reviewId) => {
    const response = await api.get(`/api/social/reviews/${reviewId}/comments`);
    return response.data;
};
