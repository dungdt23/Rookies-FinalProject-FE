export interface Assignment {
    id: string;
    assetCode: string;
    assetName: string;
    specification: string;
    assignedTo: string;
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