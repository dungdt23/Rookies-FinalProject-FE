import axios, { AxiosResponse } from 'axios';
import { apiEndpoints } from "../constants/apiEndpoint";
import { Asset, AssetState, CreateAssetRequest } from "../types/asset";
import { PaginateResponse, SortOrder } from "../types/common";
import axiosInstance from "./axios";
import { ApiResponse } from "./user.service";

export interface GetAllAssetParams {
    state?: AssetState,
    categoryId?: string,
    search?: string,
    sort: AssetFieldFilter,
    order: SortOrder,
    index: number,
    size: number
}

export enum AssetFieldFilter {
    assetCode = 1,
    assetName = 2,
    category = 3,
    state = 4,
}

export const fetchAllAsset = async (params: GetAllAssetParams): Promise<PaginateResponse<Asset>> => {
    const response: AxiosResponse<PaginateResponse<Asset>> = await axiosInstance.get(apiEndpoints.ASSET.GET_ALL, { params });
    return response.data;
};

const API_BASE_URL = 'https://rookies-b7-g3-api.azurewebsites.net';

export const fetchCategories = async () => {
    return axios.get(`${API_BASE_URL}/categories`);
};

export const createAsset = async (payload: CreateAssetRequest): Promise<ApiResponse<Asset>> => {
    const response: AxiosResponse<ApiResponse<Asset>> = await axiosInstance.post(apiEndpoints.ASSET.CREATE, payload)
    return response.data
};

export const fetchAssetById = async (id: string): Promise<ApiResponse<Asset>> => {
    const response: AxiosResponse<ApiResponse<Asset>> = await axiosInstance.get(`${apiEndpoints.ASSET.GET_ID(id)}`)
    return response.data
}

export const editAssetById = async (id: string, payload: CreateAssetRequest): Promise<ApiResponse<Asset>> => {
    const response: AxiosResponse<ApiResponse<Asset>> =await axiosInstance.put(apiEndpoints.ASSET.EDIT(id), payload)
    return response.data
}