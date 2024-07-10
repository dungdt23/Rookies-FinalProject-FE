import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { FC, ReactNode, useEffect } from "react";
import { apiEndpoints } from "./constants/apiEndpoint";
import { LocalStorageConstants } from "./constants/localStorage";
import { useAuth } from "./contexts/AuthContext";
import { useSnackbar } from "./contexts/SnackbarContext";
import { handleResponseError, handleResponseSuccess } from "./helpers/axiosHandler";
import axiosInstance from "./services/axios";
import { useNavigate } from "react-router-dom";

interface AxiosInterceptorsProps {
    children: ReactNode;
}

const firstTimeApiEndpointsWhiteList = [
    apiEndpoints.USER.CHANGE_PASSWORD_FIRST_TIME,
    apiEndpoints.LOGIN
]

const AxiosInterceptors: FC<AxiosInterceptorsProps> = ({ children }) => {
    const { showSnackbar } = useSnackbar();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    // useEffect(() => {
    axiosInstance.interceptors.request.clear();
    axiosInstance.interceptors.response.clear();

    const requestInterceptor = axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const storedToken = localStorage.getItem(LocalStorageConstants.TOKEN);
            const token: string | null = storedToken ?? null;

            if (process.env.NODE_ENV === 'development') {
                const method = config.method?.toUpperCase() ?? 'GET';
                const urlWithParams = method.concat(` ${config.url}`, (config.params ? `?${new URLSearchParams(config.params as Record<string, string>).toString()}` : ''));
                console.log('Request URL:', urlWithParams);
            }

            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
                // Check if the user's password is changed for the first time
                if (user?.isPasswordChangedFirstTime === "0") {
                    // Check if the request URL is in the whitelist
                    if (!firstTimeApiEndpointsWhiteList.includes(config.url as string)) {
                        // Cancel the request using the cancel token
                        console.log("Canceled the request");
                        throw new axios.Cancel('Operation canceled by the user.');
                    }
                }
            }

            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(new Error(error.message));
        }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => handleResponseSuccess(response),
        (error) => handleResponseError(error, showSnackbar, navigate, logout)
    );


    //     return () => {
    //         axiosInstance.interceptors.request.eject(requestInterceptor);
    //         axiosInstance.interceptors.response.eject(responseInterceptor);
    //     }
    // }, [])
    return (
        <>
            {children}
        </>
    );
}

export default AxiosInterceptors;