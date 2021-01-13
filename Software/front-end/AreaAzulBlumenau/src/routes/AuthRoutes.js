import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPassword from '../screens/ForgotPasswordScreen';
import commonStyles from '../commonStyles';

const AuthStack = createStackNavigator();

export default ({ navigation }) => (
  	<AuthStack.Navigator 
	  	initialRouteName='SignInScreen'
		screenOptions={{
			headerStyle: {
				backgroundColor: 'white',
			},
			headerTintColor: commonStyles.colors.textColor,
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize: 25,
			},
			headerTitleAlign: 'center' ,
			headerLeft: props => (
				<TouchableOpacity
					{...props}
				>
					<Icon 						
						name='angle-left' 
						size={45}  
						color='#084cad'
						style={{marginLeft: 30}}						
					/>
				</TouchableOpacity>
			)
		}}
	>
  		<AuthStack.Screen 
      		name='SignInScreen' 
			component={SignInScreen} 
			options={{ headerShown: false }}
    	/>
  		<AuthStack.Screen 
			name='SignUpScreen' 
			component={SignUpScreen}
			options={{ title: 'Cadastrar Usuário' }}
		/>
		<AuthStack.Screen 
			name='ForgotPassword'
			component={ForgotPassword}
			options={{ title: 'Recuperar Senha' }}
		/>
  	</AuthStack.Navigator>
);