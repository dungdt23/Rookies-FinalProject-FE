import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types/user';
import { adminRoutes, guestRoutes, staffRoutes } from './routes';


const AppRouter: React.FC = () => {
    const { user } = useAuth();
    const getRoutes = (): RouteObject[] => {
        switch (user?.type) {
            case UserType.Admin:
                return adminRoutes;
            case UserType.Staff:
                return staffRoutes;
            default:
                return guestRoutes;
        }
    }
    const routes = useRoutes(getRoutes());

    return (routes);
};

export default AppRouter;
