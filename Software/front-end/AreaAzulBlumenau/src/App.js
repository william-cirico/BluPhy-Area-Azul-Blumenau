import React, { useContext } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import AuthProvider, { AuthContext } from './contexts/AuthContext';
import UserProvider from './contexts/UserContext';
import VehicleProvider from './contexts/VehicleContext';
import AppRoutes from './routes/AppRoutes';
import AuthRoutes from './routes/AuthRoutes';

const Router = () => {
    const {userToken} = useContext(AuthContext);

    if (userToken) {
        return (
            <UserProvider>
                <VehicleProvider>
                    <AppRoutes />
                </VehicleProvider>
            </UserProvider>
        )        
    }

    return <AuthRoutes />
}

export default () => {    
    return (		
		<AuthProvider>
            <NavigationContainer>
				<Router />
			</NavigationContainer>
        </AuthProvider>			
	);    
};

	
