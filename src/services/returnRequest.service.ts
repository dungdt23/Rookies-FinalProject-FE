import { AxiosResponse } from "axios";
import { apiEndpoints } from "../constants/apiEndpoint";
import { PaginateResponse } from "../types/common";
import { ReturnRequest, ReturnRequestState } from "../types/returnRequest";
import axiosInstance from "./axios";
import { ApiResponse } from "./user.service";

export interface GetAllReturnRequestParams {
    page: number;
    perPage: number;
    sortField?: FieldReturnRequestFilter;
    sortOrder?: SortOrder;
    requestState?: ReturnRequestState;
    returnedDate?: string;
    search?: string;

}


export enum FieldReturnRequestFilter {
    CreatedAt = 1,
    AssetCode,
    AssetName,
    RequestedBy,
    AssignedDate,
    AcceptedBy,
    ReturnedDate,
    State
}
export enum SortOrder {
    Ascending = 1,
    Descending = 0
}

export interface CompleteReturnRequestPayload {
    state: number;
}

export const fetchAllReturnRequest = async (params: GetAllReturnRequestParams): Promise<PaginateResponse<ReturnRequest>> => {
    const response: AxiosResponse<PaginateResponse<ReturnRequest>> = await axiosInstance.get(apiEndpoints.RETURN_REQUEST.GET_ALL, { params });
    return response.data;
}

export const completeReturnRequest = async (payload: CompleteReturnRequestPayload, id: string): Promise<ApiResponse<ReturnRequest>> => {
    const response: AxiosResponse<ApiResponse<ReturnRequest>> = await axiosInstance.post(apiEndpoints.RETURN_REQUEST.COMPLETE(id), payload);
    return response.data;
}