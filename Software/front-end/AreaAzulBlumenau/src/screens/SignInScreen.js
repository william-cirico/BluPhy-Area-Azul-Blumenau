import React, { useState, useReducer } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { emailRegex } from '../utils/regExp';



export default ({ navigation }) => {
    const reducer = (prevState, action) => {
        switch(action.type) {
            case 'EMAIL':
                if (emailRegex.test(action.email)) {
                    return {
                        ...prevState,
                        isEmailValid: true,
                        email: action.email,
                    }
                } else {
                    return {
                        ...prevState,
                        isEmailValid: false,
                        email: action.email,
                    }
                }
            case 'PASSWORD':                
                if (action.password.trim().length >= 6) {
                    return {
                        ...prevState,
                        isPasswordValid: true,
                        password: action.password,
                    }
                } else {
                    return {
                        ...prevState,
                        isPasswordValid: false,
                        password: action.password,
                    }
                }
        }
    }

    const initialState = {
        email: '',
        isEmailValid: false,
        password: '',
        isPasswordValid: false,
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    
    const validations = [
        state.isEmailValid,
        state.isPasswordValid,
    ];

    const validForm = validations.reduce((acc, cv) => acc && cv)

    return (
        <View style={styles.container}>
            <View style={styles.header} />                                   
            <View style={styles.logoContainer}>
                <Image style={styles.logo}/>
            </View>
            <KeyboardAvoidingView style={styles.body} 
                behavior='height'
                keyboardVerticalOffset={-80}
            >
                <Text style={styles.text}>E-mail</Text>
                <Input style={styles.input}
                    isValid={state.isEmailValid}
                    defaultValue={state.email}
                    onChangeText={text => dispatch({ type: 'EMAIL', email: text })}
                    keyboardType='email-address'
                />
                <Text style={styles.text}>Senha</Text>
                <Input style={styles.input}
                    isValid={state.isPasswordValid}
                    defaultValue={state.password}
                    onChangeText={text => dispatch({ type: 'PASSWORD', password: text })}
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ForgotPasswordScreen')
                    }}
                >
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>Esqueceu a senha?</Text>
                </TouchableOpacity>
                <Button 
                    title='Login' 
                    validForm={validForm} 
                    disabled={!validForm}
                    onPress={() => console.log('clique')}                    
                />
                <TouchableOpacity style={styles.register}
                    onPress={() => {
                        navigation.navigate('SignUpScreen');
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.text}>Não tem conta ainda?</Text>
                    <Text style={[styles.text, {fontWeight: 'bold', fontSize: 17}]}> Cadastre-se!</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,              
    },
    header: {
        height: 170,
        backgroundColor: commonStyles.colors.mainColor,
        borderBottomRightRadius: 130,                
    },
    body: {
        flex: 1,        
        padding: 30,
        justifyContent: 'center',        
    },
    logoContainer: {
        height: 100,
    },  
    logo: {
        alignSelf: 'center',
        position: 'relative',
        top: -100,        
        height: 200,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 100,        
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,      
        height: 40,
        marginTop: 5,
        marginBottom: 15,
        paddingLeft: 20,
        color: commonStyles.colors.textColor,        
    },
    text: {
        color: commonStyles.colors.textColor,
        fontSize: 16
    },
    register: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
});