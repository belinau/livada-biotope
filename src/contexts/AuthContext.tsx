import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define user type
interface User {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any; // For any additional user properties
}

// Define login options type
interface LoginOptions {
  returnTo?: string;
  [key: string]: any; // For any additional options
}

// Define the Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  loginWithRedirect: (options?: LoginOptions) => void;
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
  const [isAuthenticated] = useState(false);
  const [isLoading] = useState(false);
  const [user] = useState<User | null>(null);
  
  // Check if we're in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Simplified login function that redirects to Netlify CMS admin
  const loginWithRedirect = useCallback((options?: LoginOptions) => {
    if (isBrowser) {
      const returnTo = options?.returnTo || '/admin';
      window.location.href = returnTo;
    }
  }, [isBrowser]);
  
  // Simplified logout function
  const logout = useCallback(() => {
    if (isBrowser) {
      window.location.href = '/';
    }
  }, [isBrowser]);
  
  // Simplified token function
  const getAccessTokenSilently = useCallback(async (): Promise<string> => {
    return 'netlify-cms-token';
  }, []);
  
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
