import { RouteObject } from 'react-router-dom';
import { routeNames } from '../constants/routeName';
import { AdminLayout } from '../layouts/adminLayout';
import { SimpleLayout } from '../layouts/simpleLayout';
import { CreateAssetPage } from '../pages/assetPages/assetCreate';
import { EditAssetPage } from '../pages/assetPages/assetEdit';
import AssetListPage from '../pages/assetPages/assetList/AssetListPage';
import { CreateAssignmentPage } from '../pages/assignmentPages/assignmentCreate';
import AssignmentListPageStaff from '../pages/assignmentPages/assignmentList/AssginmentListPageStaff';
import AssignmentListPageAdmin from '../pages/assignmentPages/assignmentList/AssignmentListPageAdmin';
import { Error401, Error403, Error404, Error500 } from '../pages/errorPage/ErrorPages';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/login';
import CreateUserPage from '../pages/user/userCreate/CreateUserPage';
import { EditUserPage } from '../pages/user/userEdit';
import UserListPage from '../pages/user/userList/UserListPage';
import { UserType } from '../types/user';
import RequireAuth from './RequireAuth';
import RequireGuest from './RequireGuest';
import { EditAssignmentPage } from '../pages/assignmentPages/assignmentEdit';
import ReturnRequestListPage from '../pages/returnRequestPages/returnRequestList/ReturnRequestListPage';
import ReportPage from '../pages/reportPages/ReportPage';
import AssetHistoryPage from '../pages/assetPages/assetHistory/AssetHistoryPage';

const commonRoutes: RouteObject[] = [
  {
    element: <RequireGuest />,
    children: [
      {
        path: routeNames.login,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <SimpleLayout />,
    children: [
      {
        path: routeNames.notFound,
        element: <Error404 />,
      },
      {
        path: routeNames.unauthorized,
        element: <Error401 />,
      },
      {
        path: routeNames.forbidden,
        element: <Error403 />,
      },
      {
        path: routeNames.serverError,
        element: <Error500 />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export const adminRoutes: RouteObject[] = [
  {
    element: <RequireAuth allowedTypes={[UserType.Admin]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: routeNames.index,
            element: <AssignmentListPageStaff />
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
            path: routeNames.asset.history(':assetId'),
            element: <AssetHistoryPage />
          },
          {
            path: routeNames.assignment.list,
            element: <AssignmentListPageAdmin />
          },
          {
            path: routeNames.assignment.create,
            element: <CreateAssignmentPage />
          },
          {
            path: routeNames.assignment.edit(':assignmentId'),
            element: <EditAssignmentPage />
          },
          {
            path: routeNames.returnRequest.list,
            element: <ReturnRequestListPage />
          },
          {
            path: routeNames.report.list,
            element: <ReportPage />,
          },
        ]
      }
    ]
  },
  ...commonRoutes,

];

export const guestRoutes: RouteObject[] = [
  {
    element: <AdminLayout />,
    children: [
      {
        path: routeNames.index,
        element: <HomePage />,
      },
    ],
  },
  ...commonRoutes,
];

export const staffRoutes: RouteObject[] = [
  {
    element: <RequireAuth allowedTypes={[UserType.Staff]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: routeNames.assignment.staffList,
            element: <AssignmentListPageStaff />,
          },
        ],
      },
    ],
  },
  ...commonRoutes,
];
