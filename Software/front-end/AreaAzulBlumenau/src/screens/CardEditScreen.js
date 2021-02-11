import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';

import Input from '../components/Input';
import Button from '../components/Button';

export default props => {
    const [number, setNumber] = useState('');

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{flex: 3, justifyContent: 'center', marginBottom: 25,}}
                behavior='height'
            >
                
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
            </KeyboardAvoidingView>
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