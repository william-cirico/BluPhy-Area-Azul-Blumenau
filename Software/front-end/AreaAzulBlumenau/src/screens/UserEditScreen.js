import React, { useContext, useReducer } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet } from 'react-native';

import axios from 'axios';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { UserContext } from '../contexts/UserContext';
import { server, showErrorMessage } from '../utils/common';
import { emailRegex, cpfCnpjRegex } from '../utils/regExp';

export default ({ navigation, route }) => {
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
        }
    };

     const initialState = {
        name: route.params.name || '',
        isNameValid: route.params.name ? true : false,
        email: route.params.email || '',
        isEmailValid: route.params.email ? true : false,    
        document: route.params.document || '',
        isDocumentValid: route.params.document ? true : false,
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    
    
    const validations = [
        state.isNameValid, 
        state.isEmailValid,  
        state.isDocumentValid       
    ];
    
    const validForm = validations.reduce((acc, cv) => acc && cv)

    const { loadUser } = useContext(UserContext);

    const handleEditUser = async () => {
        try {
            // Atualizando os dados no banco
            console.log(state.name, state.email, state.document)
            await axios.put(
                `${server}/users/`,
                {
                    name: state.name,                    
                    email: state.email,
                    document: state.document,
                }
            );

            loadUser();

            Alert.alert(
                'Sucesso', 
                'Dados do usuário editados com sucesso!',
                [{
                    text: 'Ok',
                    onPress: () => navigation.push('MainScreen')
                }]
            );              
        } catch(e) {       
            console.log(e);     
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
                value={state.name}            
            />
            <Input
                isValid={state.isEmailValid}
                onChangeText={text => dispatch({ type: 'EMAIL', email: text })} 
                placeholder='E-mail'
                keyboardType='email-address'                
                value={state.email}
            />  
            <Input
                isValid={state.isDocumentValid}
                onChangeText={text => dispatch({ type: 'DOCUMENT', document: text })} 
                placeholder='CPF/CNPJ'
                keyboardType='numeric'                
                value={state.document}
            />   
            <Button 
                title='Editar usuário' 
                validForm={validForm} 
                disabled={!validForm}
                onPress={handleEditUser}
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