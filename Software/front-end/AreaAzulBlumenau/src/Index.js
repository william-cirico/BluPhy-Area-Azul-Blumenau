import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthRoutes from './routes/AuthRoutes';
import AppRoutes from './routes/AppRoutes';


export default () => (
    <NavigationContainer>
        <AuthRoutes />
    </NavigationContainer>
);