import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

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

// Auth0 configuration
const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '',
  scope: 'read:translations update:translations',
  // Allow both GitHub and database authentication
  connection: ''
};

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope
      }}
    >
      <AuthContextContent>{children}</AuthContextContent>
    </Auth0Provider>
  );
};

// The actual context content
const AuthContextContent: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  // Create the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
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
