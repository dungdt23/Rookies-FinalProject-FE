import { AxiosResponse } from "axios";
import saveAs from "file-saver";
import { apiEndpoints } from "../constants/apiEndpoint";
import { PaginateResponse } from "../types/common";
import { ReportResponse } from "../types/report";
import axiosInstance from "./axios";

export interface GetAllReportParams {
    sortby?: TypeReportSort,
    ascending?: boolean,
    index: number,
    size: number
}

export enum TypeReportSort {
    CategoryName = 1,
    Total = 2,
    Assigned = 3,
    Available = 4,
    NotAvailable = 5,
    WaitingForRecycling = 6,
    Recycled = 7
}

export const fetchReport = async (params: GetAllReportParams): Promise<PaginateResponse<ReportResponse>> => {
    const response: AxiosResponse<PaginateResponse<ReportResponse>> = await axiosInstance.get(apiEndpoints.REPORT.GET_ALL, { params });
    return response.data;
};

export const exportReport = async (): Promise<void> => {
    try {
        const response = await axiosInstance.get(apiEndpoints.REPORT.EXPORT, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
        
        const fileName = `AssetManagement_Report_${formattedDate}.xlsx`;
        saveAs(blob, fileName);
    } catch (error) {
        console.error('Error exporting report:', error);
    }
};
