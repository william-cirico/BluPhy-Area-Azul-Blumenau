import React, { useReducer, useContext } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View  } from 'react-native';

import Car from 'react-native-vector-icons/FontAwesome';
import Motorcyle from 'react-native-vector-icons/MaterialIcons';

import LabelInput from '../components/LabelInput';
import Button from '../components/Button';
import commonStyles from '../theme/commonStyles';
import { licensePlateRegex } from '../utils/regExp';
import {VehicleContext} from '../contexts/VehicleContext';

export default ({ navigation, route }) => {        
    const reducer = (prevState, action) => {        
        switch(action.type) {
            case 'VEHICLE_TYPE':
                return {
                    ...prevState,
                    vehicleType: action.vehicleType
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
                if (action.vehicleModel.trim().length >= 3) {
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
        licensePlate: route.params ? route.params.licensePlate : '',
        islicensePlateValid: !!route.params,
        vehicleModel: route.params ? route.params.vehicleModel : '',
        isVehicleModelValid: !!route.params,
        vehicleType: route.params ? route.params.vehicleType : 'CARRO',
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const validations = [
        state.islicensePlateValid, 
        state.isVehicleModelValid,
    ]

    const validForm = validations.reduce((acc, cv) => acc && cv);

    const { createVehicle } = useContext(VehicleContext);

    const addVehicle = () => {                
        createVehicle(state.licensePlate, state.vehicleModel, state.vehicleType) &&
        Alert.alert(
            'Sucesso', 
            'Veículo cadastrado com sucesso!',
            [
                {
                    title: 'Ok',
                    onPress: () => navigation.push('MainScreen')
                }
            ]
        );             
    }

    const { updateVehicle } = useContext(VehicleContext);

    const editVehicle = () => {
        updateVehicle(route.params.vehicleId, state.licensePlate, state.vehicleModel, state.vehicleType) &&
        Alert.alert(
            'Sucesso', 
            'Veículo editado com sucesso!',
            [
                {
                    title: 'Ok',
                    onPress: () => navigation.navigate('MainScreen')
                }
            ]
        ); 
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior="height"
        >
            <View style={styles.bodyContainer}>
                <View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            onPress={() => dispatch({ type: 'VEHICLE_TYPE', vehicleType: 'CARRO' })}
                            style={
                                [styles.button, state.vehicleType === 'CARRO' ? 
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
                                    state.vehicleType === 'CARRO' ? 'white' : commonStyles.colors.mainColor
                                } 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => dispatch({ type: 'VEHICLE_TYPE', vehicleType: 'MOTO' })}
                            style={
                                [styles.button, state.vehicleType === 'MOTO' ? 
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
                                    state.vehicleType === 'MOTO' ? 'white' : commonStyles.colors.mainColor
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
                        value={state.licensePlate}
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
                        value={state.vehicleModel}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button                               
                        title={route.params ? 'Editar' : 'Cadastrar'}
                        disabled={!validForm}
                        onPress={route.params ? editVehicle : addVehicle}
                    /> 
                </View>
            </View> 
                                 
        </KeyboardAvoidingView>
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
    bodyContainer: {
        flex: 1,
        justifyContent: 'space-evenly',       
    },
    buttonContainer: {        
        justifyContent: 'flex-end'
    }
});