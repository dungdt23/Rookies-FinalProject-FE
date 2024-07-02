import { routeNames } from "../../constants/routeName";

export interface SidebarItem {
    label: string,
    to?: string
}
export const adminSidebarItems: SidebarItem[] = [
    { label: 'Home', to: routeNames.index },
    { label: 'Manage User', to: routeNames.user.list },
    { label: 'Manage Asset', to: routeNames.asset.list },
    { label: 'Manage Assignment', to: routeNames.assignment.list },
    { label: 'Request for Returning', to: routeNames.returnRequest.list },
    { label: 'Report', to: routeNames.report.list },
];

export const staffSidebarItems: SidebarItem[] = [
    { label: 'Home', to: routeNames.assignment.staffList },
];

export const guestSidebarItems: SidebarItem[] = [
    { label: 'Home', to: routeNames.index },
];