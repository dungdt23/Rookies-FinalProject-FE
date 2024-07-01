export interface ReturnRequest {
    id: string;
    assetId: string;
    assetCode: string;
    assetName: string;
    requesterId: string;
    requestedBy: string;
    assignedDate: string;
    accepterId?: string;
    acceptedBy?: string;
    returnedDate?: string;
    state: ReturnRequestState;
}


export enum ReturnRequestState {
    WaitingForReturning = 0,
    Completed = 1,
    Declined = -1,
}