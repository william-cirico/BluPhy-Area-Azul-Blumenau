import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import Vehicle from '../components/Vehicle';

export default props => {
    const DATA = [
        {
            id_veiculo: '1',
            placa: 'ASB-1234',
            modelo: 'Fusca'
        },
        {
            id_veiculo: '2',
            placa: 'CDE-1234',
            modelo: 'Gol'
        },
        {
            id_veiculo: '3',
            placa: 'FGH-1234',
            modelo: 'Golf'
        },
    ]


    return (
        <View>
            <Text>Selecione o veículo que quer editar</Text>
            <FlatList
                style={styles.vehicles}
                data={DATA}
                renderItem={({ item }) => <Vehicle licensePlate={item.placa} carModel={item.modelo} />} 
                keyExtractor={item => item.id_veiculo}                                   
            />
        </View>        
    );
}

const styles = StyleSheet.create({
    vehicles: {
        color: 'black'
    },
});
