import React, {useReducer} from 'react';

import { StyleSheet, Text, View, Dimensions  } from 'react-native';

import Car from 'react-native-vector-icons/FontAwesome';
import Motorcyle from 'react-native-vector-icons/MaterialIcons';

import commonStyles from '../theme/commonStyles';


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
            <View style={styles.containerInformation}>
                <View style={styles.containerVehicle}>
                    <View style={styles.boxVehicle}>
                        <Car
                            name='car'
                            size={50}
                            color='white'
                        />
                        <Motorcyle
                            name='motorcycle'
                            size={50}
                            color='white'
                        />
                    </View>
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.parkingRulesContainer}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>INFORMAÇÕES DO VEÍCULO</Text>
                    </View>
                    <View style={styles.descriptBox}>
                        <View>
                            <Text style={styles.descriptTitle}>Placa</Text>
                            <Text style={styles.descriptText}>XXX - 000</Text>
                        </View>
                        <View>
                            <Text style={styles.descriptTitle}>Modelo do veículo</Text>
                            <Text style={styles.descriptText}>Honda Fit</Text>
                        </View>
                    </View>
                </View>
            </View>                     
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: commonStyles.colors.backgroundColor,                      
        padding: 30,  
    },
    containerInformation: {
        flex: 1,
        alignItems: 'center',
    },
    containerVehicle: {
        height: 110,
        width: 220,
        borderWidth: 2,
        borderColor: '#1253aa',
        marginVertical: 20,  
        borderRadius: 25,
    },
    boxVehicle: {
        backgroundColor: '#1253aa',
        width: 115,
        height: 108,
        borderRadius: 20,
        borderColor: '#1253aa',
        justifyContent: 'center',
        paddingLeft: 25,
    },
    bodyContainer: {
        flex: 3, 
        justifyContent: 'center'
    },
    parkingRulesContainer: {
        backgroundColor: 'white',
        marginVertical: 20,
        padding: 20,         
        borderLeftColor:'#1253aa',
        borderLeftWidth: 15,     
        borderRadius: 10,
    },
    titleBox: {
        fontSize: 16,
        alignItems: 'center',
    },
    title: {
        color: '#bcbcbc',
        fontFamily: 'arial',
        fontWeight: 'bold',
    },
    descriptBox: {
        paddingLeft: 5,
        height: 130,
        justifyContent: 'space-between',
        margin: 20,
    },
    descriptTitle: {
        fontSize: 17,
        color: '#1253aa',
        fontWeight: 'bold',
    },
    descriptText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1253aa',
    },
});