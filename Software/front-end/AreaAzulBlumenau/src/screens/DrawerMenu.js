import React, { useContext }  from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../contexts/AuthContext';
import commonStyles from '../theme/commonStyles';


export default props => {    
    const [_, __, { signOut }] = useContext(AuthContext);   

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.header}>
                    <Text style={styles.headerLabel}>William Círico</Text>
                </View>  
                <View style={styles.body}>
                    <DrawerItem 
                        icon={({color, size}) => (
                            <Icon 
                                name='car'
                                color={color}
                                size={size}
                            />
                        )}
                        label='Editar Veículos'
                        onPress={() => {props.navigation.navigate('VehicleEditScreen')}}
                        inactiveBackgroundColor='white'
                    />
                    <DrawerItem 
                        icon={({color, size}) => (
                            <Icon 
                                name='user'
                                color={color}
                                size={size}
                            />
                        )}
                        label='Editar dados do usuário'
                        onPress={() => {props.navigation.navigate('VehicleEditScreen')}}
                    />
                    <View style={styles.footer}> 
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                    name='sign-out'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label='Sair'
                            onPress={signOut}
                        />             
                    </View>                                
                </View>
            </DrawerContentScrollView>
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
        fontSize: 30,
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