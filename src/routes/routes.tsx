import { RouteObject } from 'react-router-dom';
import { routeNames } from '../constants/routeName';
import { AdminLayout } from '../layouts/adminLayout';
import { HomePage } from '../pages/homePage';
import UserListPage from '../pages/user/userList/UserListPage';
import CreateUserPage from '../pages/user/userCreate/CreateUserPage';

export const commonRoutes: RouteObject[] = [
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
            }
        ]
    }
];