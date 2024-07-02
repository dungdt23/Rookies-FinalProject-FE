import { adminSidebarItems, guestSidebarItems, SidebarItem, staffSidebarItems } from "../layouts/siderbar/sidebarItems";
import { routeNames } from "./routeName";

export const routeNameBreadcrumbsNameMap: { [key: string]: string } = {
    [routeNames.login]: 'Login',
    [routeNames.index]: 'Home',
    [routeNames.unauthorized]: 'Unauthorized',
    [routeNames.forbidden]: 'Forbidden',
    [routeNames.notFound]: 'Not Found',
    [routeNames.serverError]: 'Server Error',
    [routeNames.user.list]: 'Users',
    [routeNames.user.create]: 'Create New User',
    [routeNames.user.edit('')]: 'Edit User',
    [routeNames.asset.list]: 'Assets',
    [routeNames.asset.create]: 'Create New Asset',
    [routeNames.asset.edit('')]: 'Edit Asset',
    [routeNames.assignment.list]: 'Assignments',
    [routeNames.assignment.create]: 'Create New Assignment',
    [routeNames.assignment.edit('')]: 'Edit Assignment',
    [routeNames.assignment.staffList]: 'My Assignments',
    [routeNames.returnRequest.list]: 'Return Requests',
    [routeNames.report.list]: 'Reports',
};

export const routeNameSidebarNameMap: { [key: string]: SidebarItem } = {
    [routeNames.index]: guestSidebarItems.Home,
    [routeNames.user.list]: adminSidebarItems.ManageUser,
    [routeNames.user.create]: adminSidebarItems.ManageUser,
    [routeNames.user.edit('')]: adminSidebarItems.ManageUser,
    [routeNames.asset.list]: adminSidebarItems.ManageAsset,
    [routeNames.asset.create]: adminSidebarItems.ManageAsset,
    [routeNames.asset.edit('')]: adminSidebarItems.ManageAsset,
    [routeNames.assignment.list]: adminSidebarItems.ManageAssignment,
    [routeNames.assignment.create]: adminSidebarItems.ManageAssignment,
    [routeNames.assignment.edit('')]: adminSidebarItems.ManageAssignment,
    [routeNames.assignment.staffList]: staffSidebarItems.Home,
    [routeNames.returnRequest.list]: adminSidebarItems.RequestForReturning,
    [routeNames.report.list]: adminSidebarItems.Report,
};