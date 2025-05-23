import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
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

    // Function to initialize authentication (runs on page load)
    const initAuth = async () => {
        const token = localStorage.getItem('token'); // Get token from storage
        if (!token) return; // If no token, do nothing
    
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Send token in request
            },
          });
          console.log(response);
    
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
    
          const data = await response.json(); // Extract response data
          console.log(data);
          setUsername(data.username);
          setRole(data.role);
        } catch (error) {
          console.error('Error fetching user:', error);
          logout(); // Clear auth state if request fails
        }
      };
    
      // Run initAuth when the component mounts
      useEffect(() => {
        initAuth();
      }, []);

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
