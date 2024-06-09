import React from 'react';
import { Navigate } from 'react-router-dom';
import { getFromLocalStorage } from '../utils/storage';

const PrivateRoute = ({ element }) => {
    const user = getFromLocalStorage('user');
    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
