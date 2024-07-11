// errorHandler.ts
import { AxiosError, AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { routeNames } from '../constants/routeName';
import { ApiResponse } from '../services/user.service';

export const handleResponseError = (
    error: AxiosError,
    showSnackbar: (message: string, severity?: 'error' | 'warning' | 'info' | 'success') => void,
    navigate: NavigateFunction,
    logout: () => void
) => {
    console.log(error);

    if (!error.response) {
        if (error.message === "Operation canceled by the user.") {
            console.log("Request canceled")
            return Promise.reject(new Error("Request canceled"));
        } else {
            console.error('Network error, unable to connect to API');
            showSnackbar('Network error, unable to connect to API', 'error');
            return Promise.reject(new Error('Network error, unable to connect to API'));
        }
    }

    const status = error.response.status;

    if (status === 401 && window.location.pathname !== routeNames.login) {
        console.error('Unauthorized, redirecting to login...');
        logout();
        navigate(routeNames.login);
        showSnackbar('Unauthorized, redirecting to login...', 'error');
        return Promise.reject(error);
    }

    if (status === 500) {
        showSnackbar('Server error, redirecting...', 'error');
        navigate(routeNames.serverError);
        return Promise.reject(error);
    }

    console.log(status === 401);
    
    const responseData = error.response.data as ApiResponse<any> | null;
    showSnackbar(`Error ${status}: ${responseData?.message ?? "Something went wrong"}`, 'error');
    return Promise.reject(error);
};

export const handleResponseSuccess = (success: AxiosResponse) => {
    return success;
}