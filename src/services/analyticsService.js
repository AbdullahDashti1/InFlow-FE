import api from './apiService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/analytics`;

export const getSummary = async () => {
    try {
        const res = await api.get(`${BASE_URL}/summary`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};