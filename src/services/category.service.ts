import { AxiosResponse } from "axios";
import { apiEndpoints } from "../constants/apiEndpoint";
import { Category } from "../types/category";
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