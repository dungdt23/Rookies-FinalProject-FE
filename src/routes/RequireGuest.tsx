import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { routeNames } from '../constants/routeName';

const RequireGuest = () => {
    const { user } = useAuth();
    return (
        !user
            ? <Outlet />
            : <Navigate to={routeNames.index} replace />
    )
}

export default RequireGuest;