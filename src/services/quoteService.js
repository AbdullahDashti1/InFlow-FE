import api from './apiService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/quotes`;

export const index = async () => {
    try {
        const res = await api.get(BASE_URL);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const show = async (id) => {
    try {
        const res = await api.get(`${BASE_URL}/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const create = async (data) => {
    try {
        const res = await api.post(BASE_URL, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const update = async (id, data) => {
    try {
        const res = await api.put(`${BASE_URL}/${id}`, data);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const deleteQuote = async (id) => {
    try {
        const res = await api.delete(`${BASE_URL}/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const sendQuote = async (id) => {
    try {
        const res = await api.post(`${BASE_URL}/${id}/send`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const getQuotePdf = async (id) => {
    try {
        const res = await api.get(`${BASE_URL}/${id}/pdf`, { responseType: 'blob' });
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

// Alias for consistency if needed, checking standard naming
export const getPdf = getQuotePdf;