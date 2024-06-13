import axios from "axios";
import { LocalStorageConstants } from "../constants/localStorage";
import { AxiosConstants } from "../constants/axiosConstants";
import { UserCredential } from "../types/user";
import { routeNames } from "../constants/routeName";

const axiosInstance = axios.create({
    baseURL: AxiosConstants.AXIOS_BASEURL,
    timeout: AxiosConstants.AXIOS_TIMEOUT,
    headers: AxiosConstants.AXIOS_HEADER
});

axiosInstance.interceptors.request.use(
    (config) => {
        const storedCredential = localStorage.getItem(LocalStorageConstants.USER_CREDENTIAL);
        const userCredential: UserCredential | null = storedCredential ? JSON.parse(storedCredential) : null;
        if (userCredential) {
            config.headers.Authorization = `Bearer ${userCredential.accessToken}`
        }

        if (process.env.NODE_ENV === 'development') {
            const method = config.method?.toUpperCase() ?? 'GET';
            const urlWithParams = method.concat(` ${config.url}`, (config.params ? `?${new URLSearchParams(config.params).toString()}` : ''));
            console.log('Request URL:', urlWithParams);
        }

        return config
    },
    (error) => {
        Promise.reject(new Error(error))
    }
)

axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (!error.response) {
            console.error('Network error, unable to connect to API');
            // Return a specific error message or object for network errors
            return Promise.reject(new Error('Network error, unable to connect to API'));
        }
        // Any status codes that fall outside the range of 2xx cause this function to trigger
        if (error.response && error.response.status === 401 && window.location.pathname !== routeNames.login) {
            // Handle unauthorized errors (e.g., redirect to login)
            console.log(window.location.href);
            console.error('Unauthorized, redirecting to login...');
            window.location.href = routeNames.login;
        }
        // You can add other error handling logic here

        return Promise.reject(new Error(error));
    }
)

export default axiosInstance;