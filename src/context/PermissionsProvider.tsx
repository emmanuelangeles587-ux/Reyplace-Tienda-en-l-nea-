import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type UserRole = 'guest' | 'user' | 'superadmin';

interface PermissionsContextType {
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
  hasRole: () => false,
});

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  };

  return (
    <PermissionsContext.Provider value={{ hasRole }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const useAccess = () => useContext(PermissionsContext);
