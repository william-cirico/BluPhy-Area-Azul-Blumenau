import React, {useReducer, useState} from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View  } from 'react-native';

import Car from 'react-native-vector-icons/FontAwesome';
import Motorcyle from 'react-native-vector-icons/MaterialIcons';

import LabelInput from '../components/LabelInput';
import Button from '../components/Button';
import commonStyles from '../commonStyles';
import { licensePlateRegex } from '../regExp';

export default ({ navigation }) => {    
    const reducer = (prevState, action) => {        
        switch(action.type) {
            case 'CAR':
                return {
                    ...prevState,
                    isCarChecked: true,
                    isMotorcycleChecked: false,
                }
            case 'MOTORCYCLE':
                return {
                    ...prevState,
                    isCarChecked: false,
                    isMotorcycleChecked: true,
                    
                }
            case 'LICENSE_PLATE':                            
                if (licensePlateRegex.test(action.licensePlate)) {                    
                    return {
                        ...prevState,
                        islicensePlateValid: true,
                        licensePlate: action.licensePlate,                        
                    }
                } else {
                    return {
                        ...prevState,
                        islicensePlateValid: false,
                        licensePlate: action.licensePlate,
                    }
                }
            case 'VEHICLE_MODEL':
                if (action.vehicleModel.trim().length >= 6) {
                    return {
                        ...prevState,
                        isVehicleModelValid: true,                    
                        vehicleModel: action.vehicleModel,
                    }
                } else {
                    return {
                        ...prevState,
                        isVehicleModelValid: false,                    
                        vehicleModel: action.vehicleModel,
                    }
                }
        }
    };

    initialState = {
        isCarChecked: true,
        isMotorcycleChecked: false,
        licensePlate: 'BRA2E19',
        islicensePlateValid: false,
        vehicleModel: '',
        isVehicleModelValid: false,
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const validations = [
        state.islicensePlateValid, 
        state.isVehicleModelValid,
    ]

    const validForm = validations.reduce((acc, cv) => acc && cv);

    const addVehicle = () => {
        //TODO: Implementar
        navigation.navigate('MainScreen')
    }

    return (
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={() => dispatch({ type: 'CAR' })}
                        style={
                            [styles.button, state.isCarChecked ? 
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >
                        <Car 
                            name='car' 
                            size={30} 
                            color={
                                state.isCarChecked ? 'white' : commonStyles.colors.mainColor
                            } 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => dispatch({ type: 'MOTORCYCLE' })}
                        style={
                            [styles.button, state.isMotorcycleChecked ? 
                            {backgroundColor: commonStyles.colors.mainColor} : 
                            {
                                backgroundColor: 'white',
                                borderColor: commonStyles.colors.mainColor,
                                borderWidth: 3,
                            }]
                        }
                    >            
                        <Motorcyle 
                            name='two-wheeler' 
                            size={50} 
                            color={
                                state.isMotorcycleChecked ? 'white' : commonStyles.colors.mainColor
                            }                         
                        />
                    </TouchableOpacity>
                </View>
                <LabelInput 
                    label='PLACA'
                    isValid={state.islicensePlateValid}
                    autoCapitalize='characters'                    
                    keyboardType='default'
                    onChangeText={text => dispatch({ 
                        type: 'LICENSE_PLATE',
                        licensePlate: text.toUpperCase(),
                    })} 
                    placeholder=''
                />           
                <LabelInput 
                    label='MODELO'
                    isValid={state.isVehicleModelValid}
                    autoCapitalize='characters'                    
                    keyboardType='default'
                    onChangeText={text => dispatch({ 
                        type: 'VEHICLE_MODEL',
                        vehicleModel: text.toUpperCase(),
                    })} 
                    placeholder=''
                />
            </View> 
            <View style={styles.containerButton}>
                <Button                               
                    title='Cadastrar Veículo'
                    disabled={!validForm}
                    onPress={() => addVehicle}
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
    containerButton: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    bodyContainer: {
        flex: 1,
        justifyContent: 'center'
    }
});