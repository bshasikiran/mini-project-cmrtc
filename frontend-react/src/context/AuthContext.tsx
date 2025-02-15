import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
interface AuthContextType {
  username: string | null;
  role: string | null;
  login: (username: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = (username: string, role: string) => {
    setUsername(username);
    setRole(role);
  };

  const logout = () => {
    setUsername(null);
    setRole(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const authValue = useMemo(() => ({ username, role, login, logout }), [username, role]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
