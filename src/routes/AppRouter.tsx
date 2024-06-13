import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { commonRoutes } from './routes';


const AppRouter: React.FC = () => {
    const getRoutes = (): RouteObject[] => (commonRoutes)
    const routes = useRoutes(getRoutes());

    return (routes);
};

export default AppRouter;
