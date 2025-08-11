import React from 'react';
import { useKeycloak } from '@/context/KeycloakContext';

interface RoleProtectedComponentProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  userRole?: string;
  fallback?: React.ReactNode;
}

const RoleProtectedComponent: React.FC<RoleProtectedComponentProps> = ({
  children,
  requiredRoles = [],
  userRole,
  fallback = null,
}) => {
  const keycloakContext = useKeycloak();

  if (!keycloakContext) {
    // Context not ready, you can choose to show fallback or nothing
    return <>{fallback}</>;
  }

  const { keycloak } = keycloakContext;

  let effectiveRole = userRole;
  if (!effectiveRole && keycloak && keycloak.tokenParsed) {
    const roles = keycloak.tokenParsed.realm_access?.roles;
    if (roles && roles.length > 0) {
      effectiveRole = roles[0];
    }
  }

  const hasRequiredRole = () => {
    if (requiredRoles.length === 0) return true;
    if (!effectiveRole) return false;
    return requiredRoles.includes(effectiveRole);
  };

  if (hasRequiredRole()) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};


export default RoleProtectedComponent; 