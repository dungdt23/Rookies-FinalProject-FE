import { jwtDecode } from 'jwt-decode';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { JWTPayload } from '../types/user';
import { LocalStorageConstants } from '../constants/localStorage';

interface AuthContextProps {
  user: JWTPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<JWTPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(LocalStorageConstants.TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        setUser(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem(LocalStorageConstants.TOKEN);
      }
    }
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
