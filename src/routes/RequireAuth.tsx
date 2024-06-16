import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { JWTPayload, UserType } from '../types/user';
import { routeNames } from '../constants/routeName';

interface RequireAuthProps {
    allowedTypes?: UserType[]
}

const RequireAuth = ({ allowedTypes = [] }: RequireAuthProps) => {
    const { user } = useAuth();

    const redirect = (user: JWTPayload | null) => {
        if (user) return <Navigate to={routeNames.unauthorized} replace />
        return <Navigate to={routeNames.login} replace />
    }

    return (
        (user && allowedTypes.includes(user.type as UserType))
            ? <Outlet />
            : redirect(user)
    )
}

export default RequireAuth;