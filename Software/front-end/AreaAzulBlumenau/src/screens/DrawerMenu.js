import React, { useContext, useEffect, useState }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {    
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import { server, showErrorMessage } from '../utils/common';
import { AuthContext } from '../contexts/AuthContext';
import commonStyles from '../theme/commonStyles';


export default props => {    
    const { authContext } = useContext(AuthContext);   
    const [userData, setUserData] = useState({});
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const res = await axios(
                    `${server}/users/`
                );
                setUserData(res.data);                
            } catch(e) {
                console.log(e);
            }
        }
        const loadVehicles = async () => {
            try {
                res = await axios(`${server}/vehicles/`);                
                setVehicles(res.data);                                
            } catch(e) {
                showErrorMessage(e);
            }
        };
        
        loadUserData();
        loadVehicles();        
    }, [])

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
                    {!!vehicles ?
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
                        onPress={authContext.signOut}                        
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