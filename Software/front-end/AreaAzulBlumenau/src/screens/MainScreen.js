import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import { server, showErrorMessage } from '../utils/common';
import commonStyles from '../theme/commonStyles';
import Vehicle from '../components/Vehicle';
import Button from '../components/Button';

export default ({ navigation }) => {       
    const [vehicles, setVehicles] = useState([]);

    const [balance, setBalance] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserBalance = async () => {
            try {                                                              
                balance_res = await axios(
                    `${server}/users/balance`
                );                
                setBalance(balance_res.data.balance);                
                vehiclesList = await axios(
                    `${server}/vehicles/`
                );                                
                setVehicles(vehiclesList.data);                
                setIsLoading(false);
            } catch(e) {
                showErrorMessage(e);
            }
        }        
        loadUserBalance();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.menuButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.openDrawer()}
                >
                    <Icon name='bars' size={30} color={commonStyles.colors.mainColor} />
                </TouchableOpacity>                                
            </View>
            <View style={styles.balanceContainer}>
                    {isLoading ? 
                        <ActivityIndicator color={commonStyles.colors.mainColor} size='large' /> :
                        <Text style={styles.balanceText}>R$ {balance.toFixed(2)}</Text>
                    }
                    
                    <TouchableOpacity
                        style={styles.rechargeButton}
                        activeOpacity={0.9}
                        onPress={() => console.log('clique')}
                    >
                        <Icon name='plus' size={30} color='white' />
                    </TouchableOpacity>
            </View>
            <View style={styles.body}>
                {vehicles ? 
                    <FlatList
                        data={vehicles}
                        renderItem={({ item }) => <Vehicle licensePlate={item.license_plate} carModel={item.model} />} 
                        keyExtractor={item => item.vehicle_id}                                   
                    /> :
                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Você não possui veículos cadastrados</Text>
                }
                
                <Button 
                    title='Adicionar Veículo'
                    disabled={false}
                    onPress={() => navigation.navigate('VehicleRegisterScreen')}                             
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,        
    },
    menuButton: {        
        position: 'relative',        
        left: 40,
        height: 40,
        width: 40,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flex: 3,
        backgroundColor: commonStyles.colors.mainColor,
        borderBottomLeftRadius: 110, 
        justifyContent: 'center',        
    },
    body: {      
        flex: 7,
        paddingHorizontal: 30,
        marginTop: -Dimensions.get('window').width / 4 + 50,        
        justifyContent: 'space-evenly',        
    },
    balanceContainer: {
        alignSelf: 'center',
        position: 'relative',
        top: -Dimensions.get('window').width / 4,        
        height: Dimensions.get('window').width / 2,
        width: Dimensions.get('window').width / 2,
        borderWidth: 10,
        borderRadius: Dimensions.get('window').width / 2,
        borderColor: '#eed32e',
        alignItems: 'center',
        justifyContent: 'center',        
        backgroundColor: commonStyles.colors.backgroundColor,
    },
    balanceText: {
        textAlign: 'center',
        fontSize: 30,
        color: commonStyles.colors.mainColor,                             
        fontWeight: 'bold',
    },
    rechargeButton: {
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: commonStyles.colors.mainColor,           
        position: 'absolute',
        bottom: -30,
        padding: 10,
    },  
});