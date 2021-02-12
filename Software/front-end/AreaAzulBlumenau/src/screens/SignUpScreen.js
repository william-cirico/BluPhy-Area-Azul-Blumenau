import React, { useContext, useReducer } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet } from 'react-native';

import axios from 'axios';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { emailRegex, cpfCnpjRegex } from '../utils/regExp';
import { server, showErrorMessage } from '../utils/common';


export default ({ navigation}) => {
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
            case 'DOCUMENT':
                if (cpfCnpjRegex.test(action.document)) {
                    return {
                        ...prevState,
                        document: action.document,
                        isDocumentValid: true,
                    }                
                } else {
                    return {
                        ...prevState,
                        document: action.document,
                        isDocumentValid: false,
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
        document: '',
        isDocumentValid: false,
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

    const handleSignUp = async () => {
        try {
            await axios.post(
                `${server}/users/`,
                {
                    name: state.name,
                    password: state.password,
                    email: state.email,
                    document: state.document
                }
            );                                
            Alert.alert(
                'Sucesso', 
                'Usuario criado com sucesso!',
                [{
                    text: 'Ok',
                    onPress: () => navigation.push('SignInScreen')
                }]
            );  
        } catch(e) {            
            showErrorMessage(e);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior='height'                       
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
                isValid={state.isDocumentValid}
                onChangeText={text => dispatch({ type: 'DOCUMENT', document: text})}
                placeholder="CPF/CNPJ"
                keyboardType='numeric'
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
                onPress={handleSignUp}
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