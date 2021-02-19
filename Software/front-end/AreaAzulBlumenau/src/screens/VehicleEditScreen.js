import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import commonStyles from '../theme/commonStyles';

const VehicleEdit = props => (    
    <TouchableOpacity
        style={styles.containerVehicleEdit}            
        onPress={props.editVehicle}
    >
        <View style={styles.textContainer}>
            <Text style={styles.licensePlate}>{props.licensePlate}</Text>
            <Text style={styles.vehicleModel}>{props.vehicleModel}</Text>
        </View>
    </TouchableOpacity>    
);


export default ({navigation, route}) => {    
    return (
        <View style={styles.container}>
            <View>
                <Text style={{textAlign: 'center', fontSize: 20, marginBottom: 20}}>Escolha o Veículo</Text>
                <FlatList
                    data={route.params.vehicles}
                    renderItem={({ item }) => <VehicleEdit
                        vehicleId={item.vehicle_id} 
                        licensePlate={item.license_plate} 
                        vehicleModel={item.model}
                        vehicleType={item.vehicle_type}   
                        editVehicle={() => navigation.navigate('VehicleRegisterEditScreen', {
                            title: 'Editar Veículo',
                            vehicleId: item.vehicle_id,
                            licensePlate: item.license_plate,
                            vehicleModel: item.model,
                            vehicleType: item.vehicle_type 
                        })}                  
                        />
                    } 
                    keyExtractor={item => item.vehicle_id + ''}                                                   
                />
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,             
        justifyContent: 'center'
    },
    containerVehicleEdit: {
        height: 50,
        marginVertical: 10,
        marginHorizontal: 50,        
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: commonStyles.colors.mainColor
    },
    licensePlate: {        
        fontWeight: 'bold',
        fontSize: 20,
        color: commonStyles.colors.textColor,
    },
    vehicleModel: {        
        color: commonStyles.colors.textColor,
        fontSize: 18,  
    },
    textContainer: {        
        alignItems: 'center',
    }
});