import { AxiosResponse } from "axios";
import { apiEndpoints } from "../constants/apiEndpoint";
import { PaginateResponse } from "../types/common";
import { ReturnCreateRequest, ReturnRequest, ReturnRequestState } from "../types/returnRequest";
import axiosInstance from "./axios";

export interface GetAllReturnRequestParams {
    page: number;
    perPage: number;
    sortField?: FieldReturnRequestFilter;
    sortOrder?:SortOrder;
    requestState?:ReturnRequestState;
    returnedDate?:string;
    search?:string;
    
}


export enum FieldReturnRequestFilter {
    RequestedDate = 1,
    AssetCode,
    AssetName,
    RequestedBy,
    AssignedDate,
    AcceptedBy,
    ReturnedDate,
    State
}
export enum SortOrder{
    Ascending = 1,
    Descending = 0
}


export interface CreateReturnRequestRequest {
    assignmentId : string
}

export const fetchAllReturnRequest = async (params: GetAllReturnRequestParams): Promise<PaginateResponse<ReturnRequest>> => {
    const response: AxiosResponse<PaginateResponse<ReturnRequest>> = await axiosInstance.get(apiEndpoints.RETURN_REQUEST.GET_ALL, { params });
    return response.data;
}
export const createReturnRequest = async (payload: CreateReturnRequestRequest): Promise<ReturnCreateRequest> => {
    const response: AxiosResponse<ReturnCreateRequest> = await axiosInstance.post(apiEndpoints.RETURN_REQUEST.CREATE, payload)
    return response.data;
}