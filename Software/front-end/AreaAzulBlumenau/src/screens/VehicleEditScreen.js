import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { VehicleContext } from '../contexts/VehicleContext';
import commonStyles from '../theme/commonStyles';

const VehicleEdit = props => (    
    <TouchableOpacity
        style={styles.containerVehicleEdit}            
        onPress={props.editVehicle}
    >
        <View>
            <Text style={styles.licensePlate}>{props.licensePlate}</Text>
            <Text style={styles.vehicleModel}>{props.vehicleModel}</Text>
        </View>
    </TouchableOpacity>    
);


export default ({navigation}) => {
    const { vehicles } = useContext(VehicleContext);

    const editVehicle = () => {
        navigation.navigate('VehicleRegisterScreen', {
            vehicleId: props.vehicleId,
            licensePlate: props.licensePlate,
            model: props.model,
            vehicleType: props.vehicleType 
        })
    }

    return (
        <View style={styles.container}>
            <Text style={{textAlign: 'center'}}>Selecione o veículo que você quer editar</Text>
            <FlatList
                data={vehicles}
                renderItem={({ item }) => <VehicleEdit
                    vehicleId={item.vehicle_id} 
                    licensePlate={item.license_plate} 
                    vehicleModel={item.model}
                    vehicleType={item.vehicle_type}   
                    editVehicle={() => navigation.navigate('VehicleRegisterScreen', {
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',        
    },
    containerVehicleEdit: {
        height: 50,
        margin: 15,
        flex: 1,
        flexDirection: 'row',
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
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: commonStyles.colors.textColor,
    },
    vehicleModel: {
        textAlign: 'center',
        color: commonStyles.colors.textColor,
        fontSize: 18,  
    }
});