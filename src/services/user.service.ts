import axios, { AxiosResponse } from 'axios';
import { apiEndpoints } from '../constants/apiEndpoint';
import { User, UserGender, UserType } from '../types/user';
import axiosInstance from './axios';
import { PaginateResponse } from '../types/common';
import { AxiosConstants } from '../constants/axiosConstants';

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
    fieldFilter?: UserFieldFilter
}

export enum UserFieldFilter {
    staffCode = 1,
    fullName = 2,
    joinedDate = 3,
    type = 4,
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
    dateOfBirth: string,
    gender: UserGender,
    joinedDate: string,
    type: UserType,
}

export interface LoginRequest {
    userName: string,
    password: string
}

export interface ChangePasswordRequest {
    oldPassword: string,
    newPassword: string
}

export interface ChangePasswordFirstTimeRequest {
    newPassword: string
}

export interface LoginResponse {
    tokenType: string,
    token: string,
    isPasswordChanged: boolean
}

export const fetchAllUsers = async (params: GetAllUserParams): Promise<PaginateResponse<User>> => {
    const response: AxiosResponse<PaginateResponse<User>> = await axiosInstance.get(apiEndpoints.USER.GET_ALL, { params });
    return response.data;
};

export const createUser = async (payload: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.post(apiEndpoints.USER.CREATE, payload)
    return response.data
}

export const editUserById = async (id: string, payload: EditUserRequest): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> =await axiosInstance.put(apiEndpoints.USER.EDIT(id), payload)
    return response.data
}

export const loginPost = async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    console.log("hihi" + AxiosConstants.AXIOS_BASEURL);

    const response: AxiosResponse<ApiResponse<LoginResponse>> = await axiosInstance.post(apiEndpoints.LOGIN, payload)
    return response.data
}

export const fetchUserById = async (id: string): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.get(`${apiEndpoints.USER.GET_ID(id)}`)
    return response.data
}

export const changePassword = async (payload: ChangePasswordRequest): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.put(apiEndpoints.USER.CHANGE_PASSWORD, payload)
    return response.data
}

export const changePasswordFirstTime = async (payload: ChangePasswordFirstTimeRequest): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await axiosInstance.put(apiEndpoints.USER.CHANGE_PASSWORD_FIRST_TIME, payload)
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