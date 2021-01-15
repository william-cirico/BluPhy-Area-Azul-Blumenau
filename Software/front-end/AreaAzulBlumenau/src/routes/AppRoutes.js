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
import DrawerMenu from '../screens/DrawerMenu';
import commonStyles from '../commonStyles';

const MenuDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();


const MainScreenDrawer = ({ navigation }) => (
    <MenuDrawer.Navigator
        drawerContent={DrawerMenu}
        // openByDefault={true}
    >
        <MenuDrawer.Screen
            name='MainScreen'
            component={MainScreen}        
        />
    </MenuDrawer.Navigator>
)


export default ({ navigation }) => (
        <AppStack.Navigator
            initialRouteName='MainScreen'
            screenOptions={commonStyles.screenOptionsLayout}
        >
            <AppStack.Screen 
                name='MainScreen' 
                component={MainScreenDrawer} 
                options={{ headerShown: false }}    
            />
            <AppStack.Screen 
                name='VehicleRegisterScreen' 
                component={VehicleRegisterScreen} 
                options={{ title: 'Cadastrar Veículo' }}
            />
            <AppStack.Screen 
                name='RechargeScreen' 
                component={RechargeScreen}                
            />
            <AppStack.Screen name='ParkScreen' component={ParkScreen} />
            <AppStack.Screen name='PaymentScreen' component={PaymentScreen} />
            <AppStack.Screen 
                name='VehicleEditScreen' 
                component={VehicleEditScreen} 
                options={{ title: 'Editar Veículos' }}
            />            
            <AppStack.Screen 
                name='CardEditScreen' 
                component={CardEditScreen}
                options={{ title: 'Editar Cartões' }}
            />
        </AppStack.Navigator>
);