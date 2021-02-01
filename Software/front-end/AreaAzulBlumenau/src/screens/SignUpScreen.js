import React, { useContext, useReducer } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { emailRegex, cpfCnpjRegex, phoneRegex } from '../utils/regExp';
import { AuthContext } from '../components/AuthContext';


export default () => {
    const { signUp } = useContext(AuthContext);

    const reducer = (prevState, action) => {
        switch (action.type) {
            case 'NAME':
                if (action.name.length >= 6) {
                    return {
                        ...prevState,
                        name: action.name,
                        isNameValid: true,
                    }
                } else {
                    return {
                        ...prevState,
                        name: action.name,
                        isNameValid: false,
                    }
                }
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
            case 'PASSWORD':
                if (action.password.length >= 6) {
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
                if (action.confirmPassword === prevState.password && action.confirmPassword != '') {
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
        name: '',
        isNameValid: false,
        email: '',
        isEmailValid: false,
        documentNumber: '',
        isDocumentNumberValid: false,
        phone: '',
        isPhoneValid: false,
        password: '',
        isPasswordValid: false,        
        confirmPassword: '',
        isConfirmPasswordValid: false,        
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    
    
    const validations = [
        state.isNameValid, 
        state.isEmailValid, 
        state.isPasswordValid,
        state.isConfirmPasswordValid,
    ];
    
    const validForm = validations.reduce((acc, cv) => acc && cv)

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior='height'                       
        >
            <View>
                <Input
                    isValid={state.isNameValid}
                    onChangeText={text => handleNameChange(text)} 
                    placeholder='Nome'
                />
                <Input
                    isValid={state.isEmailValid}
                    onChangeText={text => handleEmailChange(text)} 
                    placeholder='E-mail'
                    keyboardType='email-address'                
                />
                <Input
                    isValid={state.isPasswordValid}
                    onChangeText={text => handlePasswordChange(text)} 
                    placeholder='Senha'
                    secureTextEntry={true}
                />
                <Input
                    isValid={state.isConfirmPasswordValid}
                    onChangeText={text => handleConfirmPasswordChange(text)} 
                    placeholder='Confirmar senha'
                    secureTextEntry={true}
                />
                <Button 
                    title='Cadastre-se' 
                    validForm={validForm} 
                    disabled={!validForm}
                    onPress={() => console.log('clique')}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyles.colors.backgroundColor,
        padding: 30,
        justifyContent: 'center',        
    },
});