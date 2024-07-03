import { jwtDecode } from 'jwt-decode';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LocalStorageConstants } from '../constants/localStorage';
import { ScreenLoader } from '../pages/screenLoader';
import { JWTPayload } from '../types/user';

interface AuthContextProps {
  user: JWTPayload | null;
  loading: boolean,
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const logout = () => {
  localStorage.removeItem(LocalStorageConstants.TOKEN);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(LocalStorageConstants.TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setUser(decoded);
        console.log(decoded)
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem(LocalStorageConstants.TOKEN);
      }
    }
    setLoading(false);
  }, []);


  const login = (token: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      localStorage.setItem(LocalStorageConstants.TOKEN, token);
      setUser(decoded);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem(LocalStorageConstants.TOKEN);
    setUser(null);
  };

  if (loading) {
    return <ScreenLoader />
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
