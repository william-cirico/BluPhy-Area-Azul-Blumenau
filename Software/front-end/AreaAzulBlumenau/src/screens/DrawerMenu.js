import React from 'react';
import { ScrollView, StyleSheet, Text, TextBase, TouchableOpacity, View } from 'react-native';
import {
    DrawerContentScrollView, 
} from '@react-navigation/drawer';

import MenuItem from '../components/MenuItem';
import commonStyles from '../theme/commonStyles';


export default ({ navigation }) => {

    const logout = () => {
        // TODO: Implemenatar
        console.log('Sair')
    }

    return (
        <View            
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerLabel}>William Círico</Text>
            </View>  
            <View style={styles.body}>
                <MenuItem 
                    iconName='car'
                    label='Editar Veículos'
                    onPress={() => navigation.navigate('VehicleEditScreen')}
                />
                <MenuItem 
                    iconName='credit-card'
                    label='Editar Cartões'
                    onPress={() => navigation.navigate('CardEditScreen')}
                />                
            </View>           
            <View style={styles.footer}>
                <MenuItem 
                    iconName='sign-out'
                    label='Sair'
                    onPress={logout}                        
                />       
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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