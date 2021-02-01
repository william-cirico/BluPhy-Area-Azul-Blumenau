import React, { useContext, useReducer } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { AuthContext } from '../components/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { emailRegex, cpfCnpjRegex, phoneRegex } from '../utils/regExp';


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
            case 'DOCUMENT_NUMBER':
                if (cpfCnpjRegex.test(action.documentNumber)) {
                    return {
                        ...prevState,
                        documentNumber: action.documentNumber,
                        isDocumentNumberValid: true,
                    }
                } else {
                    return {
                        ...prevState,
                        documentNumber: action.documentNumber,
                        isDocumentNumberValid: false,
                    }
                }
            case 'PHONE':
                if (phoneRegex.test(action.phone)) {
                    return {
                        ...prevState,
                        phone: action.phone,
                        isPhoneValid: true,
                    }
                } else {
                    return {
                        ...prevState,
                        phone: action.phone,
                        isPhoneValid: false,
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
        state.isDocumentNumberValid, 
        state.isPhoneValid,
        state.isPasswordValid,
        state.isConfirmPasswordValid,
    ];
    
    const validForm = validations.reduce((acc, cv) => acc && cv)

    return (
        <KeyboardAvoidingView
            behavior='padding'            
            style={styles.container}  
        >                        
            <Input
                isValid={state.isNameValid}
                onChangeText={text => dispatch({ type: 'NAME', name: text })} 
                placeholder='Nome'
            />
            <Input
                isValid={state.isEmailValid}
                onChangeText={text => dispatch({ type: 'EMAIL', email: text })} 
                placeholder='E-mail'
                keyboardType='email-address'                
            />
            <Input
                isValid={state.isCpfCnpjValid}
                onChangeText={text => dispatch({ type: 'DOCUMENT_NUMBER', documentNumber: text })} 
                placeholder='CPF / CNPJ'
            />
            <Input
                isValid={state.isPhoneValid}
                onChangeText={text => dispatch({ type: 'PHONE', phone: text })} 
                placeholder='Telefone'
            />
            <Input
                isValid={state.isPasswordValid}
                onChangeText={text => dispatch({ type: 'PASSWORD', password: text })} 
                placeholder='Senha'
                secureTextEntry={true}
            />
            <Input
                isValid={state.isConfirmPasswordValid}
                onChangeText={text => dispatch({ type: 'CONFIRM_PASSWORD', confirmPassword: text })} 
                placeholder='Confirmar senha'
                secureTextEntry={true}         
            />
            <Button 
                title='Cadastre-se' 
                validForm={validForm} 
                disabled={!validForm}
                onPress={() => signUp({
                    name: state.name,
                    email: state.email,
                    documentNumber: state.documentNumber,
                    phone: state.phone,
                    password: state.password,
                })}
            />                    
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