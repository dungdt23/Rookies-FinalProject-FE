export interface Assignment {
    id: string;
    assetCode: string;
    assetName: string;
    assignedTo: string;
    assignedBy: string;
    assignedDate: Date;
    state: AssignmentState;
}

export enum AssignmentState {
    WaitingForAcceptance = 0,
    Accepted = 1,
    Rejected = -1,
}