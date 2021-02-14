import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LicensePlateConsultScreen from '../screens/LicensePlateConsultScreen';
import VehicleInformationScreen from '../screens/VehicleInformationScreen';
import commonStyles from '../theme/commonStyles';

const AppStack = createStackNavigator();


export default ({ navigation }) => (        
    <AppStack.Navigator
        initialRouteName='LicensePlateConsultScreen'
        screenOptions={commonStyles.screenOptionsLayout}
    >
        <AppStack.Screen 
            name='LicensePlateConsultScreen'
            component={LicensePlateConsultScreen}
            options={{headerShown: false}}
        />
        <AppStack.Screen 
            name='VehicleInformationScreen'
            component={VehicleInformationScreen}  
            options={{ title: 'Veículo' }}          
        />
    </AppStack.Navigator>  
);