import { AxiosResponse } from 'axios';
import { apiEndpoints } from '../constants/apiEndpoint';
import { User, UserType } from '../types/user';
import axiosInstance from './axios';

interface PaginateResponse {
    data: User[];
    totalCount: number,
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

export const fetchAllUser = async (params: GetAllUserParams): Promise<PaginateResponse> => {
    try {
        const response: AxiosResponse<PaginateResponse> = await axiosInstance.get(apiEndpoints.USER.GET_ALL, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};
