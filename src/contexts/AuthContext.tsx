import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  loginWithRedirect: (options?: any) => void;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component that works with Netlify CMS
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Create a simplified context that redirects to Netlify CMS for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Simplified login function that redirects to Netlify CMS admin
  const loginWithRedirect = () => {
    if (isBrowser) {
      window.location.href = '/admin';
    }
  };
  
  // Simplified logout function
  const logout = () => {
    if (isBrowser) {
      window.location.href = '/';
    }
  };
  
  // Simplified token function
  const getAccessTokenSilently = async () => {
    return 'netlify-cms-token';
  };
  
  // Create the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
