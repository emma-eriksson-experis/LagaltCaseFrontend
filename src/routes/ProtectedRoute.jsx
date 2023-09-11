import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roles, children }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading Keycloak...</div>;
  }

  if (!keycloak.authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }

  if (!roles || roles.some((role) => keycloak.hasRealmRole(role))) {
    // Render the component if the user has the required role(s)
    return children;
  } else {
    // Redirect to a forbidden page if the user doesn't have the required role(s)
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;