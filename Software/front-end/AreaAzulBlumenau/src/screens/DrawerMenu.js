import React, { useContext, useEffect, useState }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {    
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import { server, showErrorMessage } from '../utils/common';
import { AuthContext } from '../contexts/AuthContext';
import { VehicleContext } from '../contexts/VehicleContext';
import { UserContext } from '../contexts/UserContext';
import commonStyles from '../theme/commonStyles';


export default props => {    
    const { authContext } = useContext(AuthContext); 
    const { vehicles, clearVehicle } = useContext(VehicleContext);  
    const { userData, clearUser } = useContext(UserContext);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerLabel}>{userData.name}</Text>
            </View>                 
                <View style={styles.body}>                                  
                    <DrawerItem 
                        icon={({color, size}) => (
                            <Icon 
                                name='user'
                                color={color}
                                size={size}
                            />
                        )}
                        inactiveTintColor='black'
                        label='Editar perfil'
                        onPress={() => {props.navigation.navigate('UserEditScreen', {name: userData.name, email: userData.email})}}                                                
                    /> 
                    {vehicles ?
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name='car'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label='Editar Veículos'
                            inactiveTintColor='black'
                            onPress={() => {props.navigation.navigate('VehicleEditScreen')}}                                                            
                        />  :
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name='car'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label='Editar Veículos'                            
                        />
                    }
                    
                                       
                    <DrawerItem 
                        icon={({color, size}) => (
                            <Icon 
                                name='sign-out'
                                color={color}
                                size={size}
                            />
                        )}
                        inactiveTintColor='black'
                        label='Sair'
                        onPress={() => {
                            clearUser();
                            clearVehicle();
                            authContext.signOut();
                        }}                        
                    />                        
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    header: {
        height: 100,
        backgroundColor: commonStyles.colors.mainColor,
        justifyContent: 'center'              
    },
    body: {          
        backgroundColor: '#CCC',      
    },
    headerLabel: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white'
    },
    footer: {
        borderTopColor: '#DDD',
        borderTopWidth: 1,        
        flex: 1,
        justifyContent: 'flex-end',
    }
});