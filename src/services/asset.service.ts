import axios, { AxiosResponse } from 'axios';
import { apiEndpoints } from "../constants/apiEndpoint";
import { Asset, AssetState, CreateAssetRequest } from "../types/asset";
import { PaginateResponse, SortOrder } from "../types/common";
import axiosInstance from "./axios";
import { ApiResponse } from "./user.service";
import { HistoricalAssignment } from '../types/assignment';

export interface GetAllAssetParams {
    state?: AssetState,
    category?: string,
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

export const fetchAllAssets = async (params: GetAllAssetParams): Promise<PaginateResponse<Asset>> => {
    const response: AxiosResponse<PaginateResponse<Asset>> = await axiosInstance.get(apiEndpoints.ASSET.GET_ALL, { params });
    return response.data;
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
export const deleteAssetById = async (id: string): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${apiEndpoints.ASSET.DELETE(id)}`);
        return true;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 409) {
                return false;
            }
        }
        // Re-throw other errors
        throw error;
    }
};

export const fetchAssetHistory = async (assetId: string, isDateDescending: boolean, index: number = 1, size: number = 10): Promise<PaginateResponse<HistoricalAssignment>> => {
    const response = await axiosInstance.get(`${apiEndpoints.ASSIGNMENT.HISTORY(assetId)}`, {
        params: { isDateDescending: isDateDescending, index: index, size: size }
    });
    return response.data;
}