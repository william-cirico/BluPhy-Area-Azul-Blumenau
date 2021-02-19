import React from 'react';

import { StyleSheet, Text, View  } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Timer from '../components/Timer';

import commonStyles from '../theme/commonStyles';


export default ({navigation, route}) => {  
    return (
        <View style={styles.container}>
            <View style={styles.containerInformation}>
                <View style={styles.containerVehicle}>
                    <View style={styles.boxVehicle}>
                        {route.params.vehicle_type == 'CARRO' ? 
                            <Icon
                                name='car'
                                size={50}
                                color='white'
                            /> :
                            <Icon
                                name='motorcycle' 
                                size={50} 
                                color='white'                       
                            />
                        }
                        
                    </View>
                    <View style={styles.clock}>
                        <Timer expiryTimestamp={new Date(route.params.end_time)} style={styles.textClock}/>                        
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
                            <Text style={styles.descriptText}>{route.params.license_plate}</Text>
                        </View>
                        <View>
                            <Text style={styles.descriptTitle}>Modelo do veículo</Text>
                            <Text style={styles.descriptText}>{route.params.model}</Text>
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
        flexDirection: 'row',
    },
    boxVehicle: {
        backgroundColor: '#1253aa',
        width: 115,
        height: 108,
        borderRadius: 20,
        borderColor: '#1253aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clock: {
        flex: 1,
        color: '#1253aa',
        justifyContent: 'center',        
    },
    textClock: {
        color: '#1253aa',        
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1253aa',
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
