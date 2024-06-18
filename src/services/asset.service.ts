import { AxiosResponse } from "axios";
import { apiEndpoints } from "../constants/apiEndpoint";
import { Asset, AssetState } from "../types/asset";
import { PaginateResponse, SortOrder } from "../types/common";
import axiosInstance from "./axios";

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
    const response: AxiosResponse<PaginateResponse<Asset>> = await axiosInstance.get(apiEndpoints.USER.GET_ALL, { params });
    return response.data;
};
