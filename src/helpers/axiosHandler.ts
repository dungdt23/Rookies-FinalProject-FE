// errorHandler.ts
import { AxiosError, AxiosResponse } from 'axios';
import { routeNames } from '../constants/routeName';
import { logout } from '../contexts/AuthContext';
import { ApiResponse } from '../services/user.service';

export const handleResponseError = (error: AxiosError, showSnackbar: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void) => {
    console.error(error);

    if (!error.response) {
        console.error('Network error, unable to connect to API');
        showSnackbar('Network error, unable to connect to API', 'error');
        return Promise.reject(new Error('Network error, unable to connect to API'));
    }

    const status = error.response.status;

    if (status === 401 && window.location.pathname !== routeNames.login) {
        console.error('Unauthorized, redirecting to login...');
        showSnackbar('Unauthorized, redirecting to login...', 'error');
        logout();
        window.location.href = routeNames.login;
    }

    if (status === 500) {
        showSnackbar('Server error, redirecting...', 'error');
        window.location.href = routeNames.serverError;
    }

    const responseData = error.response.data as ApiResponse<any>;
    showSnackbar(`Error ${status}: ${responseData?.message ?? "Something went wrong"}`, 'error');
    return Promise.reject(error);
};

export const handleResponseSuccess = (success: AxiosResponse, showSnackbar: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void) => {
    return success;
}