import 'react-native-gesture-handler';
import React, { useContext } from 'react'
import { ActivityIndicator, View } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import AuthProvider, { AuthContext } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AuthRoutes from './routes/AuthRoutes';

const Router = () => {
    const [userData, isLoading] = useContext(AuthContext);

    if (isLoading) {
        return (
			<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
				<ActivityIndicator size="large" color="black" />
			</View>
		);
    }

    if (userData) {
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

	
