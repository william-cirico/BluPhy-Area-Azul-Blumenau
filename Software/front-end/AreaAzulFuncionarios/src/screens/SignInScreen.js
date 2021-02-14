import React, { useContext, useReducer } from 'react';
import { KeyboardAvoidingView, Image, StyleSheet, Text, View  } from 'react-native'; 

import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import commonStyles from '../theme/commonStyles';
import { emailRegex } from '../utils/regExp';

export default () => {
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

    const validForm = validations.reduce((acc, cv) => acc && cv)

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
            <View style={styles.boxLogo}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/logoFuncionarios.png')}
                    />
                </View>
            </View>
            <View style={styles.containerView}>
                <View style={styles.box}>
                    <Text style={styles.text}>E-mail</Text>
                    <Input
                        isValid={state.isEmailValid}
                        defaultValue={state.email}
                        onChangeText={text => dispatch({ type: 'EMAIL', email: text })}
                        keyboardType='email-address'
                    />
                    <Text style={styles.text}>Senha</Text>
                    <Input
                        isValid={state.isPasswordValid}
                        defaultValue={state.password}
                        onChangeText={text => dispatch({ type: 'PASSWORD', password: text })}
                        secureTextEntry={true}
                    />
                    <Button
                        title="Entrar"
                        validForm={validForm} 
                        disabled={!validForm}
                        onPress={() => {
                            authContext.signIn({username: state.email, password: state.password}); 
                        }}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: commonStyles.colors.backgroundColor, 
    },
    containerView: {        
        borderTopRightRadius: 95,    
        backgroundColor: commonStyles.colors.mainColor, 
    },
    box: {
        padding: 30,
    },
    boxLogo: {
        justifyContent: 'center',
        flex: 1,   
    },
    logoContainer: { 
        alignItems: 'center',  
    },
    logo: { 
        height: 200,
        width: 200,               
        backgroundColor: 'white',      
        borderRadius: 100,
        marginVertical: 10,               
    }, 
    text: {
        color: commonStyles.colors.textColor,
        fontSize: 16
    }
});