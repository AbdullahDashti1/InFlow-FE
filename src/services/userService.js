import api from './apiService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;
const ME_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/me`;

export const index = async () => {
    try {
        const res = await api.get(BASE_URL);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const updateProfile = async (data) => {
    try {
        const res = await api.put(ME_URL, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const updatePassword = async (data) => {
    try {
        const res = await api.put(`${ME_URL}/password`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};