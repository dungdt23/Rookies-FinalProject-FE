export interface ReturnRequest {
    id: string;
    requestorId: string;
    requestorUsername: string;
    responderId: string | null;
    responderUsername: string | null;
    assignmentId: string;
    assignmentAssignedDate: string; 
    assetId: string;
    assetCode: string;
    assetName: string;
    state: ReturnRequestState; 
    requestedDate: string; 
    returnedDate: string | null; 
}
export interface ReturnCreateRequest {
    id: string;
    requestorId: string;
    responderId: string;
    assignmentId: string;
    state: ReturnRequestState;
    returnedDate: string;
}

export enum ReturnRequestState {
    WaitingForReturning = 0,
    Completed = 1,
    Rejected = 2
}
