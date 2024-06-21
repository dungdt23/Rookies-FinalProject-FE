import { routeNames } from "../../constants/routeName";

export interface SidebarItem {
    label: string,
    to?: string
}
export const menuItems: SidebarItem[] = [
    { label: 'Home', to: routeNames.index },
    { label: 'Manage User', to: routeNames.user.list },
    { label: 'Manage Asset', to:routeNames.asset.list },
    { label: 'Manage Assignment', to:routeNames.assignment.list },
    { label: 'Request for Returning' },
    { label: 'Report' },
];