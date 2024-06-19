import { AxiosResponse } from 'axios';
import { apiEndpoints } from "../constants/apiEndpoint";
import { Category} from '../types/category';
import axiosInstance from "./axios";
import { ApiResponse } from './user.service';

export interface CreateCategoryRequest {
    prefix: string;
    categoryName: string;
}

export interface PrefixNameFilter {
    isPrefix: boolean;
    value: string;
}

export const fetchAllCategory = async (): Promise<ApiResponse<Category[]>> => {
    const response: AxiosResponse<ApiResponse<Category[]>> = await axiosInstance.get(apiEndpoints.CATEGORY.GET_ALL)
    return response.data
}

export const createCategory = async (payload: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await axiosInstance.post(apiEndpoints.CATEGORY.CREATE, payload)
    return response.data
};

export const checkUniquePrefixName = async (filter: PrefixNameFilter): Promise<ApiResponse<boolean>> => {
    const response: AxiosResponse<ApiResponse<boolean>> = await axiosInstance.get(apiEndpoints.CATEGORY.CHECK_UNIQUE, {
        params: filter
    });
    return response.data;
};