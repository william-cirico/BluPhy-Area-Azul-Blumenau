import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';


import VehicleEditScreen from '../screens/VehicleEditScreen';
import CardEditScreen from '../screens/CardEditScreen';
import MainScreen from '../screens/MainScreen';
import VehicleRegisterScreen from '../screens/VehicleRegisterScreen';
import RechargeScreen from '../screens/RechargeScreen';
import ParkScreen from '../screens/ParkScreen';
import PaymentScreen from '../screens/PaymentScreen';

const MenuDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();


const MainScreenDrawer = ({ navigation }) => (
    <MenuDrawer.Navigator>
        <MenuDrawer.Screen
            name='MainScreen'
            component={MainScreen}        
        >
        </MenuDrawer.Screen>
        <MenuDrawer.Screen 
            name='VehicleEdit'
            component={VehicleEditScreen}
        />
        <MenuDrawer.Screen 
            name='CardEditScreen'
            component={CardEditScreen}
        />
    </MenuDrawer.Navigator>
)


export default ({ navigation }) => (
        <AppStack.Navigator
            initialRouteName='VehicleRegisterScreen'
        >
            <AppStack.Screen 
            name='MainScreen' 
            component={MainScreenDrawer} 
            options={{ headerShown: false }}    
        />
            <AppStack.Screen name='VehicleRegisterScreen' component={VehicleRegisterScreen} />
            <AppStack.Screen name='RechargeScreen' component={RechargeScreen} />
            <AppStack.Screen name='ParkScreen' component={ParkScreen} />
            <AppStack.Screen name='PaymentScreen' component={PaymentScreen} />
        </AppStack.Navigator>
);