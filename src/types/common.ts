export interface ListPageProps {
    alertString?: string,
    presetEntry?: string,
}

export interface ListPageState<T> {
    alertString?: string,
    presetEntry?: T,
}

export enum SortOrder {
    Ascending = 1,
    Descending = 0
}

export interface PaginateResponse<T> {
    data: T[];
    totalCount: number,
    statusCode: number;
    message: string;
}