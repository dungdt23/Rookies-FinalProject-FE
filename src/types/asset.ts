import { Assignment } from "./assignment";

export interface Asset {
    id: string;
    assetCode: string;
    assetName: string;
    category: string;
    location: string;
    specification: string;
    installedDate: string;
    state: AssetState;
    assignments: Assignment[];
}

export enum AssetState {
    Available = 1,
    NotAvailable = 2,
    Assigned = 3,
    WaitingForRecycling = 4,
    Recycled = 5
}
export interface CreateAssetRequest {
    assetName: string;
    categoryId: string;
    installedDate: string;
    specification: string;
    state: AssetState;
}
