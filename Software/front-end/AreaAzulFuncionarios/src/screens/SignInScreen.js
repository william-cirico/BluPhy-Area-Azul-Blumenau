import React, { useContext, useReducer, useEffect, useState } from 'react';
import { 
    KeyboardAvoidingView, 
    Image, 
    StyleSheet, 
    Text, 
    View,
    Animated,   
    Keyboard,
} from 'react-native'; 

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

    const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));

    const keyboardDidHide = () => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    };

    const keyboardDidShow = () => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }
        ).start();
    };

    useEffect(() => {
        keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    }, []);

    
    return (
        <View style={styles.background} behavior='height'>
            <View style={styles.containerLogo}>
                <Animated.Image
                    style={{
                        width: 200,
                        height: 200,
                        opacity: fadeAnim
                    }}
                    source={require('../assets/logoFuncionarios.png')}
                />
            </View>
            <KeyboardAvoidingView  style={styles.container}>
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
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,        
        backgroundColor: commonStyles.colors.backgroundColor, 
    },
    container: {        
        borderTopRightRadius: 95,    
        backgroundColor: commonStyles.colors.mainColor,        
        justifyContent: 'center',     
        padding: 30,   
    },
    containerLogo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
    },    
    text: {
        color: commonStyles.colors.textColor,
        fontSize: 16
    }
});