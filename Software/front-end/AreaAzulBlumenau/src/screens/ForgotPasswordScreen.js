import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import Input from '../components/Input';
import Button from '../components/Button';
import commonStyles from '../commonStyles';
import { emailRegex } from '../regExp';
import { shouldUseActivityState } from 'react-native-screens';

export default () => {
    // TODO: Implementar o email vindo do formulário de login    
    const [state, setState] = useState({
        email: '',
        isEmailValid: false,
        code: '',
        wasCodeSent: false,
        showInputs: false,
    });

    // Validações
    const validations = [state.isEmailValid];
    if (state.wasCodeSent) {
        validations.push(state.code.trim() >= 8);
    }
    
    const validForm = validations.reduce((previousValue, currentValue) => previousValue && currentValue);

    const handleEmailChange = text => {
        if (emailRegex.test(text)) {
            setState({...state, email: text, isEmailValid: true});
        } else {
            setState({...state, email: text, isEmailValid: false});
        }
        console.log(state.isEmailValid);        
    };

    const handleCodeVerifier = text => {
        if (code === '12345678') {            
            setState({...state, showInputs: true});
        } else {
            Alert.alert('Código inválido')
        }
    };

    const saveNewPassword = () => {
        // TODO: Integrar com a API
    };
    

    if (state.wasCodeSent) {        
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>Digite o código enviado ao seu e-mail</Text>
                <Input 
                    onChangeText={text => setState({...state, code: text})}
                    placeholder='CÓDIGO DE VERIFICAÇÃO'
                /> 
                <Button 
                    title='Verificar código'
                    validForm={validForm}
                    disabled={!validForm}
                    onPress={() => handleCodeVerifier()}
                />
            </View>
        );
    }

    if (state.showInputs) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>Digite o código enviado ao seu e-mail</Text>
                <Input 
                    placeholder='Nova senha'
                />
                <Input  
                    placeholder='Confirmar nova senha'
                /> 
                <Button 
                    title='Salvar'
                    validForm={validForm}
                    disabled={!validForm}
                    onPress={() => saveNewPassword()}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Input
                onChangeText={text => handleEmailChange(text)} 
                placeholder='E-MAIL'
                keyboardType='email-address'
                isValid={state.isEmailValid}                
            />
            <Button 
                title='Enviar código'
                validForm={validForm}
                disabled={!validForm}
                onPress={() => setState({...state, wasCodeSent: true})}
            />
        </View>        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,
        padding: 30,
        justifyContent: 'center'
    }, 
});