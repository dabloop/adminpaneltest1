import axios from 'axios';

const BASE_URL = 'http://localhost:3500';
const FIVEM_URL = 'http://localhost:30120';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const fivemAxios = axios.create({
    baseURL: FIVEM_URL,
});