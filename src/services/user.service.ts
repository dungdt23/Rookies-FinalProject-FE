import axios, { AxiosResponse } from 'axios';
import { apiEndpoints } from '../constants/apiEndpoint';
import { User, UserGender, UserType } from '../types/user';
import axiosInstance from './axios';

interface PaginateResponse {
    data: User[];
    totalCount: number,
    statusCode: number;
    message: string;
}

export interface ApiResponse<T> {
    data: T,
    statusCode: number;
    message: string;
}

export interface GetAllUserParams {
    userType?: UserType,
    searchString?: string,
    isAscending: boolean,
    index: number, // pageNumber
    size: number, // pageSize
    fieldFilter?: FieldFilter
}

export enum FieldFilter {
    staffCode = 1,
    fullName = 2,
    joinedDate = 3
}

export interface CreateUserRequest {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    gender: UserGender,
    joinedDate: string,
    type: UserType,
}

export interface EditUserRequest {
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    gender: UserGender,
    joinedDate: string,
    type: UserType,
}

export interface LoginRequest {
    userName: string,
    password: string
}

export interface LoginResponse {
    tokenType: string,
    token: string
}

export const fetchAllUser = async (params: GetAllUserParams): Promise<PaginateResponse> => {
    const response: AxiosResponse<PaginateResponse> = await axiosInstance.get(apiEndpoints.USER.GET_ALL, { params });
    return response.data;
};

export const createUser = async (payload: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.post(apiEndpoints.USER.CREATE, payload)
    return response.data
}

export const editUserById = async (id: string, payload: EditUserRequest): Promise<void> => {
    await axiosInstance.put(apiEndpoints.USER.EDIT(id), payload)
    return
}

export const loginPost = async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await axiosInstance.post(apiEndpoints.LOGIN, payload)
    return response.data
}

export const fetchUserById = async (id: string): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.get(`${apiEndpoints.USER.GET_ID(id)}`)
    return response.data
}

export const disableUserById = async (id: string): Promise<boolean> => {
    try {
        await axiosInstance.delete(`${apiEndpoints.USER.DELETE(id)}`);
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