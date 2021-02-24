import React, { useContext, useReducer, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import Logo from '../assets/logo.png';
import { emailRegex } from '../utils/regExp';
import { AuthContext } from '../contexts/AuthContext';
import LoadingModal from '../components/LoadingModal';


export default ({ navigation }) => {
    const { authContext } = useContext(AuthContext);

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

    const [isLoading, setIsLoading] = useState(false);

    const validForm = validations.reduce((acc, cv) => acc && cv)

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior='padding'
        >    
            <LoadingModal isVisible={isLoading} />
            <View style={styles.containerView}>
                <View style={styles.logoContainer}>
                    <Image 
                        style={styles.logo}
                        source={Logo}
                    />
                </View>
                <View style={styles.body}>
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
                    {/* <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ForgotPasswordScreen')
                        }}
                    >
                        <Text style={[styles.text, {fontWeight: 'bold'}]}>Esqueceu a senha?</Text>
                    </TouchableOpacity> */}
                    <Button 
                        title='Login' 
                        validForm={validForm} 
                        disabled={!validForm}
                        onPress={() => {
                            setIsLoading(true);
                            authContext.signIn({username: state.email, password: state.password}); 
                            setIsLoading(false);
                        }}                    
                    />
                    <TouchableOpacity style={styles.register}
                        onPress={() => {
                            navigation.push('SignUpScreen');
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.text}>Não tem conta ainda?</Text>
                        <Text style={[styles.text, {fontWeight: 'bold', fontSize: 17}]}> Cadastre-se!</Text>
                    </TouchableOpacity>
                </View>
            </View>                               
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    containerView: {          
        justifyContent: 'center',                
    },
    logoContainer: {      
        justifyContent: 'center',
        alignItems: 'center',        
        backgroundColor: commonStyles.colors.mainColor,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        marginBottom: 50,
    }, 
    logo: { 
        height: 200,
        width: 200,               
        backgroundColor: 'white',      
        borderRadius: 100,
        marginVertical: 10,               
    }, 
    body: {        
        marginHorizontal: 15,                
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