import api from './apiService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/payments`;
const INVOICES_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/invoices`;

export const create = async (invoiceId, data) => {
    try {
        const res = await api.post(`${INVOICES_URL}/${invoiceId}/payments`, data);
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

export const deletePayment = async (id) => {
    try {
        const res = await api.delete(`${BASE_URL}/${id}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.response?.data?.detail || err.message);
    }
};

export const createPayment = create;