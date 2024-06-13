import { RouteObject } from 'react-router-dom';
import { routeNames } from '../constants/routeName';
import { AdminLayout } from '../layouts/adminLayout';
import { HomePage } from '../pages/homePage';


export const commonRoutes: RouteObject[] = [
    {
        element: <AdminLayout />,
        children: [
            {
                path: routeNames.index,
                element: <HomePage />
            }
        ]
    }
];