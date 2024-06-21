import { RouteObject } from 'react-router-dom';
import { routeNames } from '../constants/routeName';
import { AdminLayout } from '../layouts/adminLayout';
import { SimpleLayout } from '../layouts/simpleLayout';
import { Error401, Error403, Error404, Error500 } from '../pages/errorPage/ErrorPages';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/login';
import CreateUserPage from '../pages/user/userCreate/CreateUserPage';
import UserListPage from '../pages/user/userList/UserListPage';
import { UserType } from '../types/user';
import RequireAuth from './RequireAuth';
import RequireGuest from './RequireGuest';
import { EditUserPage } from '../pages/user/userEdit';
import AssetListPage from '../pages/assetPages/assetList/AssetListPage';
import { CreateAssetPage } from '../pages/assetPages/assetCreate';
import { EditAssetPage } from '../pages/assetPages/assetEdit';
import AssignmentListPage from '../pages/assignment/AssignmentListPage';
import { CreateAssignmentPage } from '../pages/assignmentPages/assignmentCreate';
import { EditAssignmentPage } from '../pages/assignmentPages/assignmentEdit';

const commonRoutes: RouteObject[] = [
    {
        element: <RequireGuest />,
        children: [
            {
                path: routeNames.login,
                element: <LoginPage />
            }
        ]
    },
    {
        element: <SimpleLayout />,
        children: [
            {
                path: routeNames.notFound,
                element: <Error404 />
            },
            {
                path: routeNames.unauthorized,
                element: <Error401 />
            },
            {
                path: routeNames.forbidden,
                element: <Error403 />
            },
            {
                path: routeNames.serverError,
                element: <Error500 />
            },
        ]
    },
    {
        path: '*',
        element: <Error404 />,
    },
]

export const adminRoutes: RouteObject[] = [
    {
        element: <RequireAuth allowedTypes={[UserType.Admin]} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: routeNames.index,
                        element: <HomePage />
                    },
                    {
                        path: routeNames.user.list,
                        element: <UserListPage />
                    },
                    {
                        path: routeNames.user.create,
                        element: <CreateUserPage />
                    },
                    {
                        path: routeNames.user.edit(':userId'),
                        element: <EditUserPage />
                    },
                    {
                        path: routeNames.asset.list,
                        element: <AssetListPage />
                    },
                    {
                        path: routeNames.asset.create,
                        element: <CreateAssetPage />
                    },
                    {
                        path: routeNames.asset.edit(':assetId'),
                        element: <EditAssetPage />
                    },
                    {
                        path: routeNames.assignment.list,
                        element: <AssignmentListPage />
                    },
                    {
                        path: routeNames.assignment.create,
                        element: <CreateAssignmentPage />
                    },
                    {
                        path: routeNames.assignment.edit(':assignmentId'),
                        element: <EditAssignmentPage />
                    }
                ]
            }
        ]
    },
    ...commonRoutes
];

export const guestRoutes: RouteObject[] = [
    {
        element: <RequireAuth allowedTypes={[UserType.Staff, UserType.Admin]} />,
        children: [
            {
                path: routeNames.index,
                element: <></>
            },
        ]
    },
    ...commonRoutes
]

export const staffRoutes: RouteObject[] = [
    {
        element: <RequireAuth allowedTypes={[UserType.Staff]} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: routeNames.index,
                        element: <HomePage />
                    },
                    {
                        path: routeNames.assignment.list,
                        element: <AssignmentListPage />
                    }
                ]
            }
        ]
    },
    ...commonRoutes
]