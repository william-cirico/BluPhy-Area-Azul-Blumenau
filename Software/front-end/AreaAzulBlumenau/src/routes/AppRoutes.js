import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';


import UserEditScreen from '../screens/UserEditScreen';
import MainScreen from '../screens/MainScreen';
import VehicleRegisterEditScreen from '../screens/VehicleRegisterEditScreen';
import RechargeScreen from '../screens/RechargeScreen';
import ParkScreen from '../screens/ParkScreen';
import PaymentScreen from '../screens/PaymentScreen';
import DrawerMenu from '../screens/DrawerMenu';
import VehicleEditScreen from '../screens/VehicleEditScreen';
import commonStyles from '../theme/commonStyles';

const MenuDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();



const MainScreenDrawer = ({ navigation }) => (
    <MenuDrawer.Navigator
        drawerContent={props => <DrawerMenu {...props} />}
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
        initialRouteName='CardEditScreen'
        screenOptions={commonStyles.screenOptionsLayout}
    >
        <AppStack.Screen 
            name='MainScreen' 
            component={MainScreenDrawer} 
            options={{ headerShown: false }}    
        />
        <AppStack.Screen 
            name='VehicleRegisterEditScreen' 
            component={VehicleRegisterEditScreen} 
            options={({ route }) => ({ title: route.params && route.params.title || 'Cadastrar Veículo' })}
        />
        <AppStack.Screen 
            name='RechargeScreen' 
            component={RechargeScreen} 
            options={{title: 'Recarga'}}               
        />
        <AppStack.Screen 
            name='ParkScreen' 
            component={ParkScreen} 
            options={{ title: 'Estacionar' }}
        />
        <AppStack.Screen name='PaymentScreen' component={PaymentScreen} />                    
        <AppStack.Screen 
            name='UserEditScreen' 
            component={UserEditScreen}
            options={{ title: 'Editar Usuário' }}
        />
        <AppStack.Screen 
            name='VehicleEditScreen' 
            component={VehicleEditScreen} 
            options={{ title: 'Editar veículos' }}
        />
    </AppStack.Navigator>  
);