import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import commonStyles from '../commonStyles';

export default props => {
    [isParked, setIsParked] = useState(false)

    return (
        <View style={styles.container}>
            <View style={styles.vehicleInfo}>
                <Text style={styles.licensePlateText}>{props.licensePlate}</Text>
                <Text style={styles.carModelText}>{props.carModel}</Text>
            </View>
            <TouchableOpacity
                style={[styles.button, isParked ? {} : {backgroundColor: commonStyles.colors.textColor, borderLeftColor: '#0a51ad'}]}
            >
                <Text style={styles.buttonText}>{isParked ? 'ESTACIONADO' : 'ESTACIONAR'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        backgroundColor: 'white',
        borderLeftWidth: 15,
        borderRadius: 15,
        flexDirection: 'row',
        borderLeftColor: commonStyles.colors.textColor,
    },
    vehicleInfo: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button : {
        flex: 2,
        paddingVertical: 20,   
        borderRadius: 15,  
        justifyContent: 'center',
        alignItems: 'center',          
    },
    buttonText: {
        color: 'white', 
        fontWeight: 'bold',
    },
    licensePlateText: {
        color: commonStyles.colors.textColor,
        fontWeight: 'bold',
        fontSize: 20
    },
    carModelText: {
        color: commonStyles.colors.textColor,
        fontSize: 20,        
    },
});