export interface Category {
    id: string;
    prefix: string;
    categoryName: string;
}


export interface CreateRequestCategory {
    prefix: string;
    categoryName: string;
}

export interface PrefixNameFilter {
    isPrefix: boolean;
    value: string;
}