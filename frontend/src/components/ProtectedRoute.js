import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Ensures only authenticated admins can access specific routes.
 * Prevents "flash" of dashboard content by checking token before render.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('admin_token');
    const location = useLocation();

    if (!token) {
        // Redirect them to the /admin/login page, but save the current location they were
        // trying to go to. This allows us to send them back after they login.
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
