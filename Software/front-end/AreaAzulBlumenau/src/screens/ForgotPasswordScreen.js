import React, { useReducer } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import axios from 'axios';

import Input from '../components/Input';
import Button from '../components/Button';
import commonStyles from '../theme/commonStyles';
import { emailRegex } from '../utils/regExp';
import { server, showErrorMessage } from '../utils/common';

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
                    isLoading: false,
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
            case 'LOADING':
                return {
                    ...prevState,
                    isLoading: !prevState.isLoading
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
        isLoading: false,
    };

    const [state, dispatch] = useReducer(reducer, initialState);
            
    const sendCode = async () => {
        dispatch({ type: 'LOADING' });
        try {            
            await axios.get(`${server}/users/send-verification-code/${state.email}`);
            dispatch({type: 'SEND_CODE'});            
        } catch(e) {       
            dispatch({ type: 'LOADING' });                
            showErrorMessage(e);
        }                    
    };

    const checkCode = async () => {
        try {             
            await axios.post(
                `${server}/users/check-verification-code/${state.email}`,
                { verification_code: state.code }
            )
            dispatch({ type: 'VALID_CODE' })
        } catch(e) {
            showErrorMessage(e);
        }
    };

    const saveNewPassword = async () => {
        try {
            await axios.put(
                `${server}/users/change-password/${state.email}`,
                {
                    verification_code: state.code,
                    new_password: state.password
                }
            )
            Alert.alert('Sucesso', 'Senha alterada com sucesso!', [{
                text: 'OK',
                onPress: () => navigation.navigate('SignInScreen')
            }]);
        } catch(e) {
            showErrorMessage(e);
        }        
    };   
        
    const validForm = state.isPasswordValid && state.isConfirmPasswordValid;

    if (state.isLoading) {	
		return (
			<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
				<ActivityIndicator size="large" color="black"/>
			</View>
		);
	}

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
                value={state.email}
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