import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosConstants } from '../constants/axiosConstants';
import { LocalStorageConstants } from '../constants/localStorage';
import { routeNames } from '../constants/routeName';
import { logout } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { ApiResponse } from './user.service';

const axiosInstance = axios.create({
    baseURL: AxiosConstants.AXIOS_BASEURL,
    timeout: AxiosConstants.AXIOS_TIMEOUT,
    headers: AxiosConstants.AXIOS_HEADER
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const storedToken = localStorage.getItem(LocalStorageConstants.TOKEN);
        const token: string | null = storedToken ?? null;
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        if (process.env.NODE_ENV === 'development') {
            const method = config.method?.toUpperCase() ?? 'GET';
            const urlWithParams = method.concat(` ${config.url}`, (config.params ? `?${new URLSearchParams(config.params as Record<string, string>).toString()}` : ''));
            console.log('Request URL:', urlWithParams);
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(new Error(error.message));
    }
);

// axiosInstance.interceptors.response.use(
//     (response: AxiosResponse) => {
//         return response;
//     },
//     (error: AxiosError) => {
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;