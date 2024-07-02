import dayjs from "dayjs";
import { ReturnRequestState } from "../types/returnRequest";

export interface GetAllReturnRequestParams {
    page: number;
    perPage: number;
    sortField?: FieldReturnRequestFilter;
    sortOrder?:SortOrder;
    stateFilter?:ReturnRequestState;
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