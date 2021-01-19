import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import commonStyles from '../commonStyles';

export default props => {
    [isLeftButtonShown, setIsLeftButtonShown] = useState(false);
    [isParked, setIsParked] = useState(false);

    const getLeftContent = () => {        
        return (
            <TouchableOpacity
                onPress={() => console.log('teste')} 
                style={styles.left}   
            >
                <Icon 
                    name='trash'
                    size={20}
                    color='white'
                />
            </TouchableOpacity>
        );        
    };

    return (  
        <View style={styles.container}>
            <Swipeable                
                renderLeftActions={getLeftContent}          
            >
                <View style={styles.innerContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.licensePlateText}>{props.licensePlate}</Text>
                        <Text style={styles.carModelText}>{props.carModel}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{isParked ? 'ESTACIONADO' : 'ESTACIONAR'}</Text>
                    </TouchableOpacity>                
                </View>
            </Swipeable> 
        </View>   
    );
}

const styles = StyleSheet.create({
    container: {        
        backgroundColor: 'white',
        marginBottom: 10,   
        borderRadius: 10,
        borderLeftWidth: 15,
        borderLeftColor: commonStyles.colors.textColor,            
    },
    innerContainer: {
        flexDirection: 'row',
    },
    left: {     
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'red',
    },
    textContainer: {
        flex: 2,                   
        justifyContent: 'center',
        alignItems: 'center',
    },
    licensePlateText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: commonStyles.colors.textColor,
    },  
    carModelText: {
        color: commonStyles.colors.textColor,
        fontSize: 18,        
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        backgroundColor: commonStyles.colors.textColor,        
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    }
});