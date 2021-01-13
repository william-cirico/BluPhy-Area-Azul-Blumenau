import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../commonStyles';
import Vehicle from '../components/Vehicles';
import Button from '../components/Button';

export default ({ navigation }) => {
    const DATA = [
        {
            id_veiculo: '1',
            placa: 'ABCD-1233',
            modelo: 'Kwid'
        },
        {
            id_veiculo: '2',
            placa: 'ABCD-1533',
            modelo: 'Duster'
        },
        {
            id_veiculo: '3',
            placa: 'ABAD-1233',
            modelo: 'Captur'
        },
        {
            id_veiculo: '4',
            placa: 'ASDD-1233',
            modelo: 'Zoe'
        },        
    ];

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
                    <Text style={styles.balanceText}>R$ 500.00</Text>
                    <TouchableOpacity
                        style={styles.rechargeButton}
                        activeOpacity={0.9}
                        onPress={() => console.log('clique')}
                    >
                        <Icon name='plus' size={30} color='white' />
                    </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <FlatList
                    style={styles.vehicles}
                    data={DATA}
                    renderItem={({ item }) => <Vehicle licensePlate={item.placa} carModel={item.modelo} />} 
                    keyExtractor={vehicle => vehicle.id_veiculo}                                   
                />
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
    vehicles: {        
        flexGrow: 0,        
    },  
});