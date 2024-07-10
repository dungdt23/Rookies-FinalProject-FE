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

export default axiosInstance;