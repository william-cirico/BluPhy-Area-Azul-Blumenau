import React, { useReducer } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import Input from '../components/Input';
import Button from '../components/Button';
import commonStyles from '../commonStyles';
import { emailRegex } from '../regExp';

export default ({ navigation }) => {
    const reducer = (prevState, action) => {
        switch(action.type){
            case 'EMAIL':
                if (emailRegex.test(action.email)) {
                    return {
                        ...prevState,
                        email: action.email,
                        isEmailValid: true,
                    }
                } else {
                    return {
                        ...prevState,
                        email: action.email,
                        isEmailValid: false,
                    }
                }
            case 'CODE':
                return {
                    ...prevState,
                    code: action.code,                    
                }
            case 'SEND_CODE':
                return {
                    ...prevState,
                    wasCodeSent: true,                    
                }
            case 'VALID_CODE':
                return {
                    ...prevState,
                    showInputs: true,
                }
            case 'PASSWORD':
                if (action.password.trim().length >= 6) {
                    return {
                        ...prevState,
                        password: action.password,
                        isPasswordValid: true,
                    }                
                } else {
                    return {
                        ...prevState,
                        password: action.password,
                        isPasswordValid: false,
                    }
                }                
            case 'CONFIRM_PASSWORD':
                if (action.confirmPassword === prevState.password) {
                    return {
                        ...prevState,
                        confirmPassword: action.confirmPassword,
                        isConfirmPasswordValid: true,
                    }
                } else {
                    return {
                        ...prevState,
                        confirmPassword: action.confirmPassword,
                        isConfirmPasswordValid: false,
                    }
                }                            
        }
            
    };

    const initialState = {
        email: '',
        isEmailValid: false,
        code: '',
        wasCodeSent: false,
        showInputs: false,
        password: '',
        isPasswordValid: false,
        confirmPassword: '',
        isConfirmPasswordValid: false,
    };

    const [state, dispatch] = useReducer(reducer, initialState);
            

    const sendCode = () => {
        // TODO: Implementar
        dispatch({ type: 'SEND_CODE' })
    }


    const checkCode = () => {
        // TODO: Implementar
        if (state.code === '12345678') {            
            dispatch({ type: 'VALID_CODE' })
        } else {
            Alert.alert('Código inválido')
        }
    };

    const saveNewPassword = () => {
        // TODO: Integrar com a API
        navigation.navigate('SignInScreen');
    };   
        
    const validForm = state.isPasswordValid && state.isConfirmPasswordValid;

    if (state.showInputs) {
        return (
            <View style={styles.container}>                
                <Input 
                    onChangeText={text => dispatch({ type: 'PASSWORD', password: text })}
                    isValid={state.isPasswordValid}
                    placeholder='Nova senha'
                    secureTextEntry={true}
                />
                <Input
                    onChangeText={text => dispatch({ type: 'CONFIRM_PASSWORD', confirmPassword: text })}  
                    isValid={state.isConfirmPasswordValid}
                    placeholder='Confirmar nova senha'
                    secureTextEntry={true}
                /> 
                <Button 
                    title='Redefinir senha'
                    disabled={!validForm}
                    onPress={() => saveNewPassword()}                    
                />
            </View>
        );
    }
    
    if (state.wasCodeSent) {        
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>Digite o código enviado ao seu e-mail</Text>
                <Input 
                    onChangeText={text => dispatch({ type: 'CODE', code: text })}
                    placeholder='CÓDIGO DE VERIFICAÇÃO'
                /> 
                <Button 
                    title='Verificar código'
                    onPress={() => checkCode()}
                />
            </View>
        );
    }

    
    return (
        <View style={styles.container}>
            <Input
                onChangeText={text => dispatch({ type: 'EMAIL', email: text })} 
                placeholder='E-MAIL'
                keyboardType='email-address'
                isValid={state.isEmailValid}                
            />
            <Button 
                title='Enviar código'                
                disabled={!state.isEmailValid}
                onPress={sendCode}
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