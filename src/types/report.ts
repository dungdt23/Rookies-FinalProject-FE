export interface ReportResponse {
    categoryName: string;
    total: number;
    assigned: number;
    available: number;
    notAvailable: number;
    waitingForRecycling: number;
    recycled: number;
}