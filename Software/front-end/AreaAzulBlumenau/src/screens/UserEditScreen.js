import React, { useContext, useReducer } from 'react';
import {KeyboardAvoidingView, StyleSheet} from 'react-native';

import axios from 'axios';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { server, showErrorMessage } from '../utils/common';
import { AuthContext } from '../contexts/AuthContext';

export default ({ navigation, route }) => {
    const [_, __, { userUpdate }] = useContext(AuthContext);


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
        }
    };

     const initialState = {
        name: route.params.name || '',
        isNameValid: route.params.name ? true : false,
        email: route.params.email || '',
        isEmailValid: route.params.email ? true : false,    
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    
    
    const validations = [
        state.isNameValid, 
        state.isEmailValid,         
    ];
    
    const validForm = validations.reduce((acc, cv) => acc && cv)

    const handleEditUser = async () => {
        try {
            // Atualizando os dados no banco
            const res = await axios.put(
                `${server}/users/`,
                {
                    name: state.name,                    
                    email: state.email
                }
            );
            
            const userData = res.data;
            // Atualizando os dados do usuário no estado
            userUpdate(userData);

            Alert.alert(
                'Sucesso', 
                'Dados do usuário editados com sucesso!',
                [{
                    text: 'Ok',
                    onPress: () => navigation.push('MainScreen')
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
                value={state.name}            
            />
            <Input
                isValid={state.isEmailValid}
                onChangeText={text => dispatch({ type: 'EMAIL', email: text })} 
                placeholder='E-mail'
                keyboardType='email-address'                
                value={state.email}
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