export interface Assignment {
    id: string;
    assetId: string;
    assetCode: string;
    assetName: string;
    specification: string;
    assigneeId: string;
    assignedTo: string;
    assignerId: string;
    assignedBy: string;
    assignedDate: string;
    state: AssignmentState;
    note?: string;
}


export enum AssignmentState {
    WaitingForAcceptance = 0,
    Accepted = -1,
    Rejected = 1,
}