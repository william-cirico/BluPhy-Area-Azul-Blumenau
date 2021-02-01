import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthContext, { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AuthRoutes from './routes/AuthRoutes';


export default () => {
	const { isLoading, userToken } = useContext(AuthContext);
	
	if (isLoading) {
		return (
			<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
				<ActivityIndicator size="large"/>
			</View>
		);
	}

	return (
		<NavigationContainer>
			<AuthProvider>
				{userToken ? <AppRoutes /> : <AuthRoutes />}
			</AuthProvider>
		</NavigationContainer>
	);
}

