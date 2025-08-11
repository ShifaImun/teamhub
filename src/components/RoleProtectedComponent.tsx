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
  const { keycloak } = useKeycloak();
  // Use userRole prop if provided, otherwise get from Keycloak
  let effectiveRole = userRole;
  if (!effectiveRole && keycloak && keycloak.tokenParsed) {
    // Keycloak roles are usually in tokenParsed.realm_access.roles (array)
    const roles = keycloak.tokenParsed.realm_access?.roles;
    if (roles && roles.length > 0) {
      effectiveRole = roles[0]; // Use the first role, or adapt as needed
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