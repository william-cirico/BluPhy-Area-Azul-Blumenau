import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Input from '../components/Input';
import Button from '../components/Button';

export default props => {
    const [number, setNumber] = useState('');

    return (
        <View style={styles.container}>
            <View style={{flex: 3, justifyContent: 'center'}}>
                <Input 
                    placeholder='Número do cartão'
                />
                <View style={{flexDirection: 'row'}}>
                    <Input
                        style={{ flex: 1 }}
                        placeholder='Validade'
                    />
                    <Input 
                        style={{ flex: 1, marginLeft: 15}}
                        placeholder='CVV'
                    />
                </View>
                <Input 
                    placeholder='Nome do Titular'
                />
                <Input 
                    placeholder='CPF'
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end'}}>
                <Button 
                    title='Editar Cartão'                
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,        
    }
});