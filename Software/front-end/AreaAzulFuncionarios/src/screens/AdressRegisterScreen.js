import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';

import commonStyles from '../theme/commonStyles';
import Button from '../components/Button';
import Input from '../components/Input';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default props => {
    return (
        <KeyboardAvoidingView style={styles.container}
        
            behavior='height'
        >
            <View style={{flex: 3, justifyContent: 'center', backgroundColor: '#e5e5e5', marginBottom: 50}}>
                <Input 
                 style={{ Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                    placeholder='CEP'
                   
                />
                <View style={{flexDirection: 'row'}}>
                    <Input
                        style={{ flex: 1 , Colors: '#1a73e9',Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                        placeholder='Cidade'
                    />
                    <Input 
                        style={{ flex: 1, marginLeft: 15, Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                        placeholder='UF'
                    />
                </View>
                <Input 
                    style={{ Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                    placeholder='Nome do Titular'
                />
                <View style={{flexDirection: 'row', Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}>
                    <Input
                        style={{ flex: 1, Colors: '#1a73e9', borderLeftColor: '#1a73e9' }}
                        placeholder='Rua'
                    />
                    <Input 
                        style={{ flex: 1, marginLeft: 15, Colors: '#1a73e9', borderLeftColor: '#1a73e9'}}
                        placeholder='Bairro'
                    />
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end'}}>
                <Button 
                    title='Cadastrar'                
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30, 
        backgroundColor: '#e5e5e5',       
    },
});