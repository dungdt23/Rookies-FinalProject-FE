import { AxiosResponse } from 'axios';
import { apiEndpoints } from "../constants/apiEndpoint";
import { Category, CreateRequestCategory, PrefixNameFilter } from '../types/category';
import axiosInstance from "./axios";

interface ApiResponse<T> {
    data: T[],
    statusCode: number;
    message: string;
}

export const fetchAllCategory = async (): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await axiosInstance.get(apiEndpoints.CATEGORY.GET_ALL)
    return response.data
}

export const createCategory = async (payload: CreateRequestCategory): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await axiosInstance.post(apiEndpoints.CATEGORY.CREATE, payload)
    return response.data
};

export const checkUniquePrefixName = async (filter: PrefixNameFilter): Promise<ApiResponse<boolean>> => {
    const response: AxiosResponse<ApiResponse<boolean>> = await axiosInstance.get(apiEndpoints.CATEGORY.CHECK_UNIQUE, {
        params: filter
    });
    return response.data;
};