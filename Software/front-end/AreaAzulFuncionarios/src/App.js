import 'react-native-gesture-handler';
import React, { useContext } from 'react';


import { NavigationContainer } from '@react-navigation/native';
import AuthProvider, { AuthContext } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AuthRoutes from './routes/AuthRoutes';
import LicensePlateConsultScreen from './screens/LicensePlateConsultScreen';

const Router = () => {
    const {userToken} = useContext(AuthContext);

    if (userToken) {
        return <AppRoutes />                        
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

	
