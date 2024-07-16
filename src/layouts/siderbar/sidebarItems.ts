import { routeNames } from "../../constants/routeName";

export interface SidebarItem {
    label: string,
    to?: string
}

export const adminSidebarItems = {
    Home: { label: 'Home', to: routeNames.assignment.staffList },
    ManageUser: { label: 'Manage User', to: routeNames.user.list },
    ManageAsset: { label: 'Manage Asset', to: routeNames.asset.list },
    ManageAssignment: { label: 'Manage Assignment', to: routeNames.assignment.list },
    RequestForReturning: { label: 'Request for Returning', to: routeNames.returnRequest.list },
    Report: { label: 'Report', to: routeNames.report.list },
};


export const staffSidebarItems = {
    Home: { label: 'Home', to: routeNames.assignment.staffList },
}

export const guestSidebarItems = {
    Home: { label: 'Home', to: routeNames.index },
};