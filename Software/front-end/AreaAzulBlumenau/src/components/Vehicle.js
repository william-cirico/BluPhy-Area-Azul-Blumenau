import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import axios from 'axios';


import commonStyles from '../theme/commonStyles';
import { VehicleContext } from '../contexts/VehicleContext';
import { server, showErrorMessage } from '../utils/common';
import Timer from './Timer';

export default props => { 
    const [timer, setTimer] = useState(null);     

    useEffect(() => {
        const loadTimer = async () => {
            if (props.is_parked) {
                try {
                    const res = await axios.get(`${server}/vehicles/parking-time/${props.vehicle_id}`);                    
                    const time = new Date(res.data.end_time);                    
                    setTimer(time);                
                } catch(e) {
                    console.log(e);
                }
            }
            console.log(timer)
        };

        loadTimer();
    }, []);

    const { deleteVehicle, loadVehicles } = useContext(VehicleContext);

    const cancelParking = () => {
        Alert.alert(
            'Cancelar Ticket', 
            'Você tem certeza que deseja cancelar o ticket de estacionamento?',
            [
                {
                    text: 'Sim', 
                    onPress: async () => {
                        try {
                            await axios.delete(`${server}/parking-tickets/${props.vehicle_id}`);
                            setTimer(null);
                            loadVehicles();                            
                        } catch(e) {
                            showErrorMessage(e);
                        }
                    }
                },
                {
                    text: 'Não'
                }
            ]
        );
    }

    const getLeftContent = () => {                   
        return (
            <TouchableOpacity
                onPress={() => deleteVehicle(props.vehicle_id)} 
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
        <View style={[styles.container, !props.is_active && {borderLeftColor: '#ccc'}]}>
            <Swipeable                
                renderLeftActions={getLeftContent}          
            >
                <View style={styles.innerContainer}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.licensePlateText, !props.is_active && {color: '#aaa'}]}>{props.license_plate}</Text>
                        <Text style={[styles.carModelText, !props.is_active && {color: '#ccc'}]}>{props.model}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={props.is_parked ? cancelParking : props.parkCar}
                        style={[styles.button, !props.is_active && {backgroundColor: '#ccc'}]}
                        disabled={!props.is_active}
                    > 
                        {timer ? 
                            <Timer expiryTimestamp={timer} style={styles.buttonText}/> :
                            <Text style={styles.buttonText}>Estacionar</Text>
                        }                                                
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