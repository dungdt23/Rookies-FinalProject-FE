import { apiEndpoints } from '../constants/apiEndpoint';
import { User, UserType } from '../types/user';
import axiosInstance from './axios';

interface ApiResponse {
    data: User[];
    statusCode: number;
    message: string;
}

export interface GetAllUserParams {
    type?: UserType,
    searchString?: string,
    isAscending: boolean,
    index: number, // pageNumber
    size: number, // pageSize
    fieldFilter?: fieldFilter
}

enum fieldFilter {
    staffCode = 0,
    fullName = 1,
    joinedDate = 2
}

export const fetchAllUser = async (params: GetAllUserParams): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.get<ApiResponse>(apiEndpoints.USER.GET_ALL, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  };
