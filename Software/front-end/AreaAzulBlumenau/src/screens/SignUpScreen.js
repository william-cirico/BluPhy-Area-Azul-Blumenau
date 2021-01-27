import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { emailRegex, cpfCnpjRegex, phoneRegex } from '../utils/regExp';


export default () => {
    const [state, setState] = useState({
        name: '',
        isNameValid: false,
        email: '',
        isEmailValid: false,
        cpfCnpj: '',
        isCpfCnpjValid: false,
        phone: '',
        isPhoneValid: false,
        password: '',
        isPasswordValid: false,        
        confirmPassword: '',
        isConfirmPasswordValid: false,
    });
    
    
    const validations = [
        state.isNameValid, 
        state.isEmailValid, 
        state.isCpfCnpjValid, 
        state.isPhoneValid,
        state.isPasswordValid,
        state.isConfirmPasswordValid,
    ];
    
    const validForm = validations.reduce((acc, cv) => acc && cv)

    const handleNameChange = text => {
        if (text.trim().length >= 6) {
            setState({...state, name: text, isNameValid: true});
        } else {
            setState({...state, name: text, isNameValid: false});
        }        
    };

    const handleEmailChange = text => {
        if (emailRegex.test(text)) {
            setState({...state, email: text, isEmailValid: true});
        } else {
            setState({...state, email: text, isEmailValid: false});
        }        
    };

    const handleCpfCnpjChange = text => {
        if (cpfCnpjRegex.test(text)) {
            setState({...state, cpfCnpj: text, isCpfCnpjValid: true});
        } else {
            setState({...state, cpfCnpj: text, isCpfCnpjValid: false});
        }    
    }

    const handlePhoneChange = text => {
        if (phoneRegex.test(text)) {
            setState({...state, phone: text, isPhoneValid: true});
        } else {
            setState({...state, phone: text, isPhoneValid: false});
        }    
    }

    const handlePasswordChange = text => {
        if (text.trim().length >= 6) {
            setState({...state, password: text, isPasswordValid: true});
        } else {
            setState({...state, password: text, isPasswordValid: false});
        }
    }

    const handleConfirmPasswordChange = text => {
        if (text === state.password) {
            setState({...state, confirmPassword: text, isConfirmPasswordValid: true});
        } else {
            setState({...state, confirmPassword: text, isConfirmPasswordValid: false});
        }
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior='height'                       
        >
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
                isValid={state.isCpfCnpjValid}
                onChangeText={text => handleCpfCnpjChange(text)} 
                placeholder='CPF / CNPJ'
            />
            <Input
                isValid={state.isPhoneValid}
                onChangeText={text => handlePhoneChange(text)}                 
                placeholder='Telefone'
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