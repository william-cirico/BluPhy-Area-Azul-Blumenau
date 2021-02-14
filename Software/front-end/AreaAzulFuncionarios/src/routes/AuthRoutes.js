import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import commonStyles from '../theme/commonStyles';

const AuthStack = createStackNavigator();

export default ({ navigation }) => (
  	<AuthStack.Navigator 
	  	initialRouteName='SignInScreen'
		screenOptions={commonStyles.screenOptionsLayout}
	>
  		<AuthStack.Screen 
      		name='SignInScreen' 
			component={SignInScreen} 
			options={{ headerShown: false }}
    	/>
  	</AuthStack.Navigator>
);