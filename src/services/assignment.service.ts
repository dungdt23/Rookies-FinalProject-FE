import axios, { AxiosResponse } from "axios";
import { Assignment } from "../types/assignment";
import { PaginateResponse } from "../types/common";
import { UserType } from "../types/user";
import axiosInstance from "./axios";
import { apiEndpoints } from "../constants/apiEndpoint";
import { ApiResponse } from "./user.service";

export interface GetAllAssignmentParams {
    locationId: string;
    userId?: string;
    userType: UserType;
    searchString?: string;
    isAscending: boolean;
    fieldFilter: FieldAssignmentFilter;
    index: number;
    size: number;
}

export enum FieldAssignmentFilter {
    AssetCode = 1,
    AssetName = 2,
    AssignedTo = 3,
    AssignedBy = 4,
    AssignedDate = 5,
    State = 6
}

export interface CreateAssignmentRequest {
    assetId: string;
    assignerId: string;
    assigneeId: string;
    assignedDate: Date;
    note?: string;
}

export interface EditAssignmentRequest {
    assetId: string;
    assignerId: string;
    assigneeId: string;
    assignedDate: Date;
    note?: string;
}

export interface RespondAssignmentRequest {
    assignmentId: string;
    isAccept: boolean;
}

export const fetchAllAssignments = async (params: GetAllAssignmentParams): Promise<PaginateResponse<Assignment>> => {
    const response: AxiosResponse<PaginateResponse<Assignment>> = await axiosInstance.get(apiEndpoints.ASSIGNMENT.GET_ALL, { params });
    return response.data;
}

export const createAssignment = async (payload: CreateAssignmentRequest): Promise<ApiResponse<Assignment>> => {
    const response: AxiosResponse<ApiResponse<Assignment>> = await axiosInstance.post(apiEndpoints.ASSIGNMENT.CREATE, payload)
    return response.data
}

export const editAssignmentById = async (id: string, payload: EditAssignmentRequest): Promise<ApiResponse<Assignment>> => {
    const response: AxiosResponse<ApiResponse<Assignment>> = await axiosInstance.put(apiEndpoints.ASSIGNMENT.EDIT(id), payload)
    return response.data
}

export const respondAssignment = async (payload: RespondAssignmentRequest): Promise<ApiResponse<Assignment>> => {
    const response: AxiosResponse<ApiResponse<Assignment>> = await axiosInstance.put(apiEndpoints.ASSIGNMENT.RESPOND, payload)
    return response.data
}

export const fetchAssignmentById = async (id: string): Promise<ApiResponse<Assignment>> => {
    const response: AxiosResponse<ApiResponse<Assignment>> = await axiosInstance.get(`${apiEndpoints.ASSIGNMENT.GET_ID(id)}`)
    return response.data
}

export const disableAssignmentrById = async (id: string): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${apiEndpoints.ASSIGNMENT.DELETE(id)}`);
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
