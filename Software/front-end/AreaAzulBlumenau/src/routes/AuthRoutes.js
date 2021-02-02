import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import commonStyles from '../theme/commonStyles';

const AuthStack = createStackNavigator();

export default ({ navigation }) => (
  	<AuthStack.Navigator 
	  	initialRouteName='ForgotPasswordScreen'
		screenOptions={commonStyles.screenOptionsLayout}
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
			name='ForgotPasswordScreen'
			component={ForgotPasswordScreen}
			options={{ title: 'Recuperar Senha' }}
		/>
  	</AuthStack.Navigator>
);