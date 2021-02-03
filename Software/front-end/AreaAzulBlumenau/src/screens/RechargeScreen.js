import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '../components/Button';
import commonStyles from '../theme/commonStyles';

export default ({ navigation, route }) => {
    const [value, setValue] = useState(7.5);

    return (
        <View style={styles.container}>
            <View style={{flex: 3, justifyContent: 'center'}}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={() => setValue(7.5)}
                        style={
                            [styles.button, value === 7.5 ? 
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >
                        <Text
                            style={
                                value === 7.5 ? 
                                {color: 'white'} : 
                                {color: commonStyles.colors.mainColor}
                            }
                        >R$ 7,50</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setValue(15)}
                        style={
                            [styles.button, value === 15 ?  
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >            
                        <Text
                            style={
                                value === 15 ? 
                                {color: 'white'} : 
                                {color: commonStyles.colors.mainColor}
                            }
                        >R$ 15,00</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setValue(30)}
                        style={
                            [styles.button, value === 30 ? 
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >            
                        <Text
                            style={
                                value === 30 ? 
                                {color: 'white'} : 
                                {color: commonStyles.colors.mainColor}
                            }
                        >R$ 30,00</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.parkingRulesContainer}>
                    <Text style={styles.title}>REGRAS DE ESTACIONAMENTO</Text>
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <Text style={styles.vehicleTypeText}>Carro</Text>
                            <Text style={styles.vehiclePriceText}>R$ 1,50 por hora</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.vehicleTypeText}>Moto</Text>
                            <Text style={styles.vehiclePriceText}>R$ 0,75 por hora</Text>
                        </View>
                    </View>
                    <Text style={styles.timeLimitText}>Tempo limite por vaga: 2 horas</Text>
                </View>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <Button 
                    title='Pagar'
                    disabled={false}                
                    onPress={() => navigation.push('PaymentScreen', {value: value})}
                />
            </View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,        
        padding: 30,
    },
    buttonsContainer: {
        flexDirection: 'row',                
        justifyContent: 'center',        
    },
    button: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').width / 4,        
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginHorizontal: 5,       
    },
    parkingRulesContainer: {
        backgroundColor: 'white',
        marginVertical: 20,
        padding: 20,        
        alignItems: 'center',        
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    time: {
        flex: 2
    },
    title: {
        fontSize: 20,
        color: commonStyles.colors.mainColor,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    vehicleTypeText: {
        fontWeight: 'bold'
    },
    vehiclePriceText: {
        color: '#777'
    },
    timeLimitText: {
        fontWeight: 'bold',
        color: commonStyles.colors.mainColor,
    }
});