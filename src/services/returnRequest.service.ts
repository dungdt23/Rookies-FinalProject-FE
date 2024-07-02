import dayjs from "dayjs";
import { ReturnRequest, ReturnRequestState } from "../types/returnRequest";
import { PaginateResponse } from "../types/common";
import { AxiosResponse } from "axios";
import axiosInstance from "./axios";
import { ReturnRequest } from './../types/returnRequest';
import { apiEndpoints } from "../constants/apiEndpoint";

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
    CreatedAt = 1,
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

export const fetchAllReturnRequest = async (params: GetAllReturnRequestParams): Promise<PaginateResponse<ReturnRequest>> => {
    const response: AxiosResponse<PaginateResponse<ReturnRequest>> = await axiosInstance.get(apiEndpoints.RETURN_REQUEST.GET_ALL, { params });
    return response.data;
}