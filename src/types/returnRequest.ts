export interface ReturnRequest {
    id: string;
    requestorId: string;
    requestorUsername: string;
    responderId: string;
    responderUsername: string;
    assignmentId: string;
    assignmentAssignedDate: string; 
    assetId: string;
    assetCode: string;
    assetName: string;
    state: ReturnRequestState; 
    requestedDate: string; 
    returnedDate: string; 
}



export enum ReturnRequestState {
    WaitingForReturning = 0,
    Completed = 1,
    Rejected = 2
}